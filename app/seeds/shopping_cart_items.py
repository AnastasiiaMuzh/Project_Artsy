from app.models import db, ShoppingCartItem, environment, SCHEMA
from sqlalchemy.sql import text

def seed_shopping_cart_items():
    one = ShoppingCartItem(buyerId=1, productId=2, quantity=1)

    db.session.add(one)
    db.session.commit()

def undo_shopping_cart_items():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.shopping_cart_items RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM shopping_cart_items"))


    db.session.commit()