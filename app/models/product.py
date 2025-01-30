from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone

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
    createdAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)

    # relationships here
    shopping_cart_items = db.relationship("ShoppingCartItem", back_populates="products", cascade="all, delete-orphan")
    reviews = db.relationship("Review", back_populates="products", cascade="all, delete-orphan")
    images = db.relationship("ProductImage", back_populates="products", cascade="all, delete-orphan")
    favorites = db.relationship(
        "User",
        secondary = add_prefix_for_prod("favorites"), # FK that connects user and favorites
        back_populates="favorites"
    )
    order_items = db.relationship("OrderItem", back_populates="products", cascade="all, delete-orphan")
    sellers = db.relationship("User", back_populates='products')

    def __repr__(self):
        return f"<Product id={self.id}, name='{self.name}', sellerId={self.sellerId}, price={self.price}, category='{self.category}', createdAt={self.createdAt}, updatedAt={self.updatedAt}>"
