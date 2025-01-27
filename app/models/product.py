from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Product(db.Model):
    __tablename__ = 'products'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    sellerId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    price = db.Column(db.Numeric(10,2), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(100), nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.now(), nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.now(), nullable=False)

    # relationships here
    shopping_cart_items = db.relationship("ShoppingCartItem", back_populates="products", cascade="all, delete-orphan")
    reviews = db.relationship("Review", back_populates="products", cascade="all, delete-orphan")
    images = db.relationship("ProductImage", back_populates="products", cascade="all, delete-orphan")
    favorites = db.relationship(
        "User",
        secondary="favorites",
        back_populates="products"
    )
    order_items = db.relationship("OrderItem", back_populates="products", cascade="all, delete-orphan")
