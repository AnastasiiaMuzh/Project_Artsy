from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone


class OrderItem(db.Model):
    __tablename__ = 'order_items'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    orderId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("orders.id")), nullable=False)
    productId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("products.id")), nullable=False)
    price = db.Column(db.Numeric(10,2), nullable=False)
    quantity = db.Column(db.Integer)
    createdAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)

    # relationships below
    orders = db.relationship("Order", back_populates="order_items")
    products = db.relationship("Product", back_populates="order_items")

    def __repr__(self):
        return f"<OrderItem id={self.id}, orderId={self.orderId}, productId={self.productId}, price={self.price}, quantity={self.quantity}, createdAt={self.createdAt}, updatedAt={self.updatedAt}>"
