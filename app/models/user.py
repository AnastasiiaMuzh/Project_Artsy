from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime, timezone


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(255), nullable=False)
    lastName = db.Column(db.String(255), nullable=False)
    username = db.Column(db.String(40), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    createdAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)

    # relationships below
    reviews = db.relationship("Review", back_populates="users", cascade="all, delete-orphan")
    shopping_cart_items = db.relationship("ShoppingCartItem", back_populates="users", cascade="all, delete-orphan")
    orders = db.relationship("Order", back_populates="users", cascade="all, delete-orphan")
    favorites = db.relationship(
        "Product",
        secondary = add_prefix_for_prod("favorites"),
        back_populates="favorites"
    )
    products = db.relationship("Product", back_populates="sellers", cascade='all, delete-orphan')

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'firstName': self.firstName,
            'lastName': self.lastName
        }

    def __repr__(self):
        return f"<User id={self.id}, username='{self.username}', email='{self.email}', createdAt={self.createdAt}, updatedAt={self.updatedAt}>"
