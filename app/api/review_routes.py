from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import Review, User, ReviewImage, Product, ProductImage
from sqlalchemy import and_
from app.models.db import db


review_routes = Blueprint('reviews', __name__)

# ***********************GET All Reviews of Current User ***********************
@review_routes.route('/current')
@login_required
def get_current_user_reviews():

    reviews = Review.query.filter_by(buyerId=current_user.id).all()
    # print('LOOK HERE!!', reviews)

    if not reviews:
        return {"message": "No reviews found"}, 404

    # invalid productId, such as product is not found??

    review_data = []
    for review in reviews:
        product = Product.query.get(review.productId)
        review_images = ReviewImage.query.filter_by(reviewId=review.id).all()

        preview_image = ProductImage.query.filter(
            and_(ProductImage.productId == product.id, ProductImage.preview == True)
        ).first()
        preview_image_url = preview_image.url if preview_image else None

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
                "id": product.id,
                "name": product.name,
                "sellerId": product.sellerId,
                "price": product.price,
                "description": product.description,
                "category": product.category,
                "previewImage": preview_image_url
            },
            "ReviewImages": [
                {
                    "id": review_image.id,
                    "url": review_image.url
                }
                for review_image in review_images if review_image
            ]

        })

    return {"Reviews": review_data}


# ***********************GET All Reviews of Product ***********************
@review_routes.route('/<int:id>')
def get_product_reviews(id):
    product = Product.query.get(id)
    if not product:
        return { "message": "Product couldn't be found"}, 404

    reviews = Review.query.filter_by(productId=id).all()
    print('look here!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    print(reviews)

    if not reviews:
        return {"message": "No reviews found for this product"}, 404

    review_data = []
    for review in reviews:
        user = User.query.get(review.buyerId)
        review_images = ReviewImage.query.filter_by(reviewId=review.id).all()
        # print('erika look right here', user)

        review_data.append({
            "id": review.id,
            "productId": review.productId,
            "buyerId": review.buyerId,
            "review": review.review,
            "stars": review.stars,
            "createdAt": review.createdAt,
            "updatedAt": review.updatedAt,
            "User": {
                "id": user.id,
                "firstName": user.firstName,
                "lastName": user.lastName
            },
            "ReviewImages": [
                {
                    "id": review_image.id,
                    "reviewId": review_image.reviewId,
                    "url": review_image.url
                }
                for review_image in review_images if review_image
            ]
        })

    return {"Reviews": review_data}


# ***********************CREATE Review ***********************
@review_routes.route('/products/<int:id>', methods=['POST'])
@login_required
def create_review(id):
    buyerId = current_user.id
    product = Product.query.get(id)
    if not product:
        return { "message": "Product couldn't be found"}, 404

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
