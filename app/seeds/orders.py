from app.models import db, Order, environment, SCHEMA
from sqlalchemy.sql import text


def seed_orders():
    one = Order(
        buyerId=1, totalPrice=25.50, status='shipped', shippingAddress="123 Apple Lane, NY"
    )
    two = Order(
        buyerId=2, totalPrice=33.00, status='delivered', shippingAddress="456 Honeycomb Rd, CA"
    )
    three = Order(
        buyerId=3, totalPrice=40.00, status='processing', shippingAddress="789 Coaster St, TX"
    )
    four = Order(
        buyerId=4, totalPrice=62.00, status='shipped', shippingAddress="321 Vase Ave, FL"
    )
    five = Order(
        buyerId=5, totalPrice=12.00, status='delivered', shippingAddress="654 Candle Ct, WA"
    )
    six = Order(
        buyerId=1, totalPrice=36.00, status='processing', shippingAddress="123 Apple Lane, NY"
    )
    seven = Order(
        buyerId=2, totalPrice=30.00, status='shipped', shippingAddress="456 Honeycomb Rd, CA"
    )
    eight = Order(
        buyerId=3, totalPrice=16.00, status='delivered', shippingAddress="789 Coaster St, TX"
    )
    nine = Order(
        buyerId=4, totalPrice=100.00, status='processing', shippingAddress="321 Vase Ave, FL"
    )
    ten = Order(
        buyerId=5, totalPrice=35.00, status='shipped', shippingAddress="654 Candle Ct, WA"
    )


    db.session.add(one)
    db.session.add(two)
    db.session.add(three)
    db.session.add(four)
    db.session.add(five)
    db.session.add(six)
    db.session.add(seven)
    db.session.add(eight)
    db.session.add(nine)
    db.session.add(ten)


    db.session.commit()


def undo_orders():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.orders RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM orders"))


    db.session.commit()
