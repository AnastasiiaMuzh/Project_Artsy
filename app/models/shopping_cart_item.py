from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone


class ShoppingCartItem(db.Model):
    __tablename__ = 'shopping_cart_items'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    buyerId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    productId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("products.id")), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)

    # relationships below
    users = db.relationship("User", back_populates="shopping_cart_items")
    products = db.relationship("Product", back_populates="shopping_cart_items")

    def __repr__(self):
        return f"<ShoppingCartItem id={self.id}, buyerId={self.buyerId}, productId={self.productId}, quantity={self.quantity}, createdAt={self.createdAt}, updatedAt={self.updatedAt}>"
