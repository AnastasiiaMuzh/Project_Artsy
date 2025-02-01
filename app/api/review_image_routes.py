from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import Review, ReviewImage
from app.models.db import db


review_image_routes = Blueprint('reviews_images', __name__)


# ***********************CREATE Review Image***********************
@review_image_routes.route('/<int:id>', methods=['POST'])
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
@review_image_routes.route('/images/<string:url>', methods=['DELETE'])
@login_required
def delete_review(url):
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
