from app.models import db, Order, environment, SCHEMA
from sqlalchemy.sql import text

def seed_orders():
    orders = [
        # Delivered orders
        Order(buyerId=1, status='delivered', totalPrice=180, shippingAddress="123 Demo St, NY"),
        Order(buyerId=2, status='delivered', totalPrice=116, shippingAddress="456 Marnie Ave, CA"),
        Order(buyerId=3, status='delivered', totalPrice=114, shippingAddress="789 Bobbie Rd, TX"),
        Order(buyerId=4, status='delivered', totalPrice=141, shippingAddress="321 Fourth St, FL"),
        Order(buyerId=5, status='delivered', totalPrice=216, shippingAddress="654 Fifth Ave, WA"),
        
        # Additional orders
        Order(buyerId=1, status='processing', totalPrice=15, shippingAddress="123 Demo St, NY"),
        Order(buyerId=2, status='shipped', totalPrice=20, shippingAddress="456 Marnie Ave, CA"),
        Order(buyerId=3, status='processing', totalPrice=30, shippingAddress="789 Bobbie Rd, TX")
    ]

    for order in orders:
        db.session.add(order)
    
    db.session.commit()

def undo_orders():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.orders RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM orders"))

    db.session.commit()
