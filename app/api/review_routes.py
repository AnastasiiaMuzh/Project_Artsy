from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import Review, User, ReviewImage, Product, ProductImage, Order
from sqlalchemy.orm import joinedload
from app.models.db import db
from app.api.auth_routes import unauthorized


review_routes = Blueprint('reviews', __name__)

# ***********************GET All Reviews of Current User ***********************
@review_routes.route('/current')
@login_required
def get_current_user_reviews():
    reviews = Review.query.options(
        joinedload(Review.products),  # ensures the Product is loaded with the Review
        joinedload(Review.review_images)  # ensures the related ReviewImages are loaded
    ).filter(Review.buyerId == current_user.id).all()

    if not reviews:
        return {"message": "No reviews found"}, 404

    preview_images_obj = {}
    product_ids = [review.productId for review in reviews]
    product_images = ProductImage.query.filter(
        ProductImage.productId.in_(product_ids),
        ProductImage.preview == True
    ).all()

    for preview_images in product_images:
        preview_images_obj[preview_images.productId] = preview_images.url

    # print('loooooooooooooooooooook', preview_images_obj)

    review_data = []
    for review in reviews:
        preview_image_url = preview_images_obj.get(review.productId)

        review_data.append({
            "id": review.id,
            "productId": review.productId,
            "buyerId": review.buyerId,
            "review": review.review,
            "stars": review.stars,
            "createdAt": review.createdAt,
            "updatedAt": review.updatedAt,
            "User": {
                "id": current_user.id,
                "firstName": current_user.firstName,
                "lastName": current_user.lastName
            },
            "Products": {
                "id": review.products.id,
                "name": review.products.name,
                "sellerId": review.products.sellerId,
                "price": review.products.price,
                "description": review.products.description,
                "category": review.products.category,
                "previewImage": preview_image_url
            },
            "ReviewImages": [
                {
                    "id": review_image.id,
                    "url": review_image.url
                }
                for review_image in review.review_images if review_image
            ]

        })

    return {"Reviews": review_data}


# ***********************GET All Reviews of Product ***********************
@review_routes.route('/<int:id>')
def get_product_reviews(id):
    product = Product.query.get(id)
    if not product:
        return { "message": "Product couldn't be found"}, 404

    reviews = Review.query.filter_by(productId=id).options(
        joinedload(Review.users),
        joinedload(Review.review_images)
    )

    if not reviews:
        return {"message": "No reviews found for this product"}, 404

    review_data = []
    for review in reviews:

        review_data.append({
            "id": review.id,
            "productId": review.productId,
            "buyerId": review.buyerId,
            "review": review.review,
            "stars": review.stars,
            "createdAt": review.createdAt,
            "updatedAt": review.updatedAt,
            "User": {
                "id": review.users.id,
                "firstName": review.users.firstName,
                "lastName": review.users.lastName
            },
            "ReviewImages": [
                {
                    "id": review_image.id,
                    "reviewId": review_image.reviewId,
                    "url": review_image.url
                }
                for review_image in review.review_images if review_image
            ]
        })

    return {"Reviews": review_data}


# ***********************CREATE Review ***********************
@review_routes.route('/products/<int:id>', methods=['POST'])
@login_required
def create_review(id):
    buyerId = current_user.id
    product = Product.query.get(id)
    reviews = Review.query.all()

    if not product:
        return { "message": "Product couldn't be found"}, 404

    order = Order.query.filter_by(buyerId=current_user.id, productId=id, status='delivered').first()
    if not order:
        return unauthorized()

    review_existing = Review.query.filter_by(productId=product.id, buyerId=buyerId).first()
    if review_existing:
        return { "message": "User already has a review for this product" }, 500

    data = request.get_json()
    review_text = data.get('review')
    stars = data.get('stars')


    errors = {}
    if not review_text:
        errors['review'] = "Review text is required"
    if stars is None or not isinstance(stars, int) or stars not in range(1,6):
        errors['stars'] = "Stars must be an integer from 1 to 5"

    if errors:
        return jsonify({"message": "Bad Request", "errors": errors}), 400


    new_review = Review(
        productId=id,
        buyerId=buyerId,
        review=review_text,
        stars=stars
    )

    db.session.add(new_review)
    db.session.commit()

    return jsonify({
        "message": "Review created",
        "review": {
            "id": new_review.id,
           "productId": new_review.productId,
            "buyerId": new_review.buyerId,
            "review": new_review.review,
            "stars": new_review.stars
        }
    }), 201


# ***********************EDIT Review***********************
@review_routes.route('/<int:id>', methods=['PATCH'])
@login_required
def edit_review(id):
    review = Review.query.get(id)
    if not review:
        return {"message": "Review couldn't be found"}, 404

    if review.buyerId != current_user.id:
        return jsonify({"message": "Unauthorized"})

    data = request.get_json()
    review_text = data.get('review')
    stars = data.get('stars')

    errors = {}
    if not review_text:
        errors['review'] = "Review text is required"
    if stars is None or not isinstance(stars, int) or stars not in range(1,6):
        errors['stars'] = "Stars must be an integer from 1 to 5"

    if errors:
        return jsonify({"message": "Bad Request", "errors": errors}), 400

    review.review = review_text
    review.stars = stars
    db.session.commit()

    return jsonify({
        "id": id,
        "productId": review.productId,
        "buyerId": review.buyerId,
        "review": review.review,
        "stars": review.stars
    }), 200


# ***********************DELETE Review***********************
@review_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_review(id):
    review = Review.query.get(id)
    if not review:
        return {"message": "Review couldn't be found"}, 404

    db.session.delete(review)
    db.session.commit()

    return jsonify({ "message": "Successfully deleted" }), 200


# ***********************CREATE Review Image***********************
@review_routes.route('/<int:id>', methods=['POST'])
@login_required
def add_review_image(id):
    review = Review.query.get(id)
    if not review:
        return {"message": "Review couldn't be found"}, 404

    if review.buyerId != current_user.id:
        return jsonify({"message": "Unauthorized"})

    review_images = ReviewImage.query.filter_by(reviewId=id).all()
    if len(review_images) == 10:
        return jsonify({ "message": "Maximum number of images for this resource was reached" }), 403

    data = request.get_json()
    review_url = data.get('url')

    new_review_image = ReviewImage(
        reviewId=review.id,
        url=review_url
    )
    db.session.add(new_review_image)
    db.session.commit()

    return jsonify({
        "id": review.id,
        "url": review_url
    }), 201


# ***********************DELETE Review Image***********************
@review_routes.route('/images/<string:url>', methods=['DELETE'])
@login_required
def delete_review_image(url):
    review_image = ReviewImage.query.filter_by(url=url).first()
    if not review_image:
        return {"message": "Review Image couldn't be found"}, 404

    review = Review.query.filter_by(id=review_image.reviewId).first()
    if not review:
        return {"message": "Review couldn't be found"}, 404
    if review.buyerId != current_user.id:
        return jsonify({"message": "Unauthorized"})

    db.session.delete(review_image)
    db.session.commit()

    return jsonify({ "message": "Successfully deleted" }), 200
