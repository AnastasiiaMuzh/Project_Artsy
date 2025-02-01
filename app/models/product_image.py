from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone


class ProductImage(db.Model):
    __tablename__ = 'product_images'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    productId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("products.id")), nullable=False)
    url = db.Column(db.Text, nullable=False)
    preview = db.Column(db.Boolean, nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)

    # relationship below
    products = db.relationship("Product", back_populates="images")

    def __repr__(self):
        return f"<ProductImage id={self.id}, productId={self.productId}, url='{self.url}', preview={self.preview}, createdAt={self.createdAt}, updatedAt={self.updatedAt}>"
