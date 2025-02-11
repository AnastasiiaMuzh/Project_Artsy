from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import Review, ReviewImage, Product, ProductImage, Order, OrderItem
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

    reviews = Review.query.filter(Review.productId == id).options(
        joinedload(Review.users),
        joinedload(Review.review_images)
    ).all()

    if len(reviews) == 0:
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

    if not product:
        print(f"❌ Product {id} not found")
        return jsonify({ "message": "Product couldn't be found"}), 404

    order_item = OrderItem.query.join(Order).filter(
        Order.buyerId == buyerId,
        Order.status == 'delivered',
        OrderItem.productId == id,
    ).first()
    if not order_item:
        print(f"❌ Unauthorized: User {buyerId} has not purchased product {id}")
        return unauthorized()

    review_existing = Review.query.filter_by(productId=product.id, buyerId=buyerId).first()
    if review_existing:
        print(f"❌ Duplicate review detected for product {id} by user {buyerId}")
        return { "message": "User already has a review for this product" }, 400

    data = request.get_json()
    print('Received data', data)
    review_text = data.get('review')
    stars = data.get('stars')
    image_url = data.get('imageUrl')

    errors = {}
    if not review_text:
        errors['review'] = "Review text is required"
    if stars is None or not isinstance(stars, int) or stars not in range(1,6):
        errors['stars'] = "Stars must be an integer from 1 to 5"
    if image_url and not isinstance(image_url, str):
        errors['imageUrl'] = 'Image URL must be a valid string'

    if errors:
        print(f"❌ Validation errors: {errors}")
        return jsonify({"message": "Bad Request", "errors": errors}), 400


    new_review = Review(
        productId=id,
        buyerId=buyerId,
        review=review_text,
        stars=stars
    )

    db.session.add(new_review)
    db.session.commit()
    print(f"✅ Review {new_review.id} created successfully!")

    if image_url:
        new_review_image = ReviewImage(
            reviewId=new_review_image.id,
            url=image_url
        )
        db.session.add(new_review_image)
        db.session.commit()

    return jsonify({
        "message": "Review created",
        "review": {
            "id": new_review.id,
           "productId": new_review.productId,
            "buyerId": new_review.buyerId,
            "review": new_review.review,
            "stars": new_review.stars,
            "imageUrl": image_url if image_url else None
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
        return jsonify({"message": "Unauthorized"}), 403

    data = request.get_json()
    review_text = data.get('review')
    stars = data.get('stars')
    image_url = data.get('imageUrl')

    errors = {}
    if not review_text:
        errors['review'] = "Review text is required"
    if stars is None or not isinstance(stars, int) or stars not in range(1,6):
        errors['stars'] = "Stars must be an integer from 1 to 5"
    if image_url and not isinstance(image_url, str):
        errors['imageUrl'] = "Image URL must be a valid string"

    if errors:
        return jsonify({"message": "Bad Request", "errors": errors}), 400

    review.review = review_text
    review.stars = stars

    review_image = ReviewImage.query.filter_by(reviewId=id).first()
    if image_url:
        if review_image:
            # update
            review_image.url = image_url
        else:
            # create image
            review_image = ReviewImage(reviewId=review.id, url=image_url)
            db.session.add(review_image)
    elif review_image:
        # deletes image
        db.session.delete(review_image)


    db.session.commit()


    return jsonify({
        "id": id,
        "productId": review.productId,
        "buyerId": review.buyerId,
        "review": review.review,
        "stars": review.stars,
        "imageUrl": review_image.url if review_image else None
    }), 200


# ***********************DELETE Review***********************
@review_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_review(id):
    review = Review.query.get(id)
    if not review:
        return {"message": "Review couldn't be found"}, 404

    if review.buyerId != current_user.id:
        return {"messaage": "Unauthorized"}, 403

    review_image = ReviewImage.query.filter_by(reviewId=id).first()
    if review_image:
        db.session.delete(review_image)

    db.session.delete(review)
    db.session.commit()

    return jsonify({ "message": "Successfully deleted" }), 200


# ***********************CREATE Review Image***********************
# @review_routes.route('/<int:id>', methods=['POST'])
# @login_required
# def add_review_image(id):
#     review = Review.query.get(id)
#     if not review:
#         return {"message": "Review couldn't be found"}, 404

#     if review.buyerId != current_user.id:
#         return jsonify({"message": "Unauthorized"}), 403

#     # review_images = ReviewImage.query.filter_by(reviewId=id).all()
#     # if len(review_images) == 10:
#     #     return jsonify({ "message": "Maximum number of images for this resource was reached" }), 403

#     data = request.get_json()
#     review_url = data.get('url')

#     if not review_url:
#         return jsonify({ "message": "Please provide a valid image URL to add a review image."}), 400

#     new_review_image = ReviewImage(
#         reviewId=review.id,
#         url=review_url
#     )
#     db.session.add(new_review_image)
#     db.session.commit()

#     return jsonify({
#         "id": new_review_image.id,
#         "url": review_url
#     }), 201


# ***********************DELETE Review Image***********************
# @review_routes.route('/images/<string:url>', methods=['DELETE'])
# @login_required
# def delete_review_image(url):
#     review_image = ReviewImage.query.filter_by(url=url).first()
#     if not review_image:
#         return {"message": "Review Image couldn't be found"}, 404

#     review = Review.query.filter_by(id=review_image.reviewId).first()
#     if not review:
#         return {"message": "Review couldn't be found"}, 404
#     if review.buyerId != current_user.id:
#         return jsonify({"message": "Unauthorized"}), 403

#     db.session.delete(review_image)
#     db.session.commit()

#     return jsonify({ "message": "Successfully deleted" }), 200



# ***********************GET REVIEWABLE PRODUCTS***********************
@review_routes.route('/products')
@login_required
def get_reviewable_products():
    buyerId = current_user.id
    reviewable_products = OrderItem.query.join(Order).join(Product).outerjoin(
        Review, (Review.productId == Product.id) & (Review.buyerId == buyerId)  # ensures the reviews are user-specific
    ).filter(
        Order.buyerId == buyerId, #ensures the buyer for the order is the same as the logged in user
        Order.status == 'delivered', #ensures that the order is delievered
        Review.id == None  # because of the outerjoin, all OrderItems (from user) are included BUT if it's not reviewed it will have a value of None
    ).all()

    # print('TESSSSSSSSSSSSSSSSSSSTING!!!!!!!!!!!!', reviewable_products)
    if not reviewable_products:
        return {'message': 'You have left reviews on all your orders'}

    reviewable_data = []
    for item in reviewable_products:
        reviewable_data.append({
            # "id": item.id,
            "id": item.products.id,
            "productName": item.products.name,
            "createdAt": item.orders.createdAt
            # "previewImage": item.products.previewImage
            # "productImage": item.
        })

    return jsonify({"reviewlessProducts": reviewable_data})
