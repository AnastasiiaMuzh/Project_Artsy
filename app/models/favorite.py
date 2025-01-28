from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime


class Favorite(db.Model):
    __tablename__ = 'favorites'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    productId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("products.id")), nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.datetime.now(datetime.timezone.utc), nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.datetime.now(datetime.timezone.utc), nullable=False)

    # relationships below
    # users = db.relationship("User", back_populates="favorites")
    # products = db.relationship("Product", back_populates="favorites")
