from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone


class Review(db.Model):
    __tablename__ = 'reviews'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    productId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("products.id")), nullable=False)
    buyerId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    review = db.Column(db.Text, nullable=False)
    stars = db.Column(db.Integer, nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)

    # relationships below
    users = db.relationship("User", back_populates="reviews")
    review_images = db.relationship("ReviewImage", back_populates="reviews")
    products = db.relationship("Product", back_populates="reviews")

    def __repr__(self):
        return f"<Review id={self.id}, productId={self.productId}, buyerId={self.buyerId}, stars={self.stars}, createdAt={self.createdAt}, updatedAt={self.updatedAt}>"
