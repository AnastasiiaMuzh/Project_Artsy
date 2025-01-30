from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone


class Order(db.Model):
    __tablename__ = 'orders'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    buyerId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    totalPrice = db.Column(db.Numeric(10,2), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    shippingAddress = db.Column(db.Text, nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)

    # relationships below
    order_items = db.relationship("OrderItem", back_populates="orders", cascade="all, delete-orphan")
    users = db.relationship("User", back_populates="orders")

    def __repr__(self):
        return f"<Order id={self.id}, buyerId={self.buyerId}, totalPrice={self.totalPrice}, status='{self.status}', shippingAddress='{self.shippingAddress}', createdAt={self.createdAt}, updatedAt={self.updatedAt}>"
