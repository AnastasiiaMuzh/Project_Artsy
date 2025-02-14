from app.models import db, Order, Product, environment, SCHEMA
from sqlalchemy.sql import text

def calculate_total_price(start_id, end_id):
    """Calculate total price for a range of products"""
    products = Product.query.filter(Product.id >= start_id, Product.id < end_id).all()
    return sum(p.price for p in products)

def seed_orders():
    # Get specific products for additional orders
    product1 = Product.query.get(1)
    product2 = Product.query.get(2)
    product3 = Product.query.get(3)

    orders = [
        # Orders for users who left reviews (delivered)
        Order(
            buyerId=1,  # Demo user
            totalPrice=calculate_total_price(1, 9),  # Sum of products 1-8
            status='delivered',
            shippingAddress="123 Demo St, NY"
        ),
        Order(
            buyerId=2,  # Marnie
            totalPrice=calculate_total_price(9, 17),  # Sum of products 9-16
            status='delivered',
            shippingAddress="456 Marnie Ave, CA"
        ),
        Order(
            buyerId=3,  # Bobbie
            totalPrice=calculate_total_price(17, 25),  # Sum of products 17-24
            status='delivered',
            shippingAddress="789 Bobbie Rd, TX"
        ),
        Order(
            buyerId=4,  # User 4
            totalPrice=calculate_total_price(25, 33),  # Sum of products 25-32
            status='delivered',
            shippingAddress="321 Fourth St, FL"
        ),
        Order(
            buyerId=5,  # User 5
            totalPrice=calculate_total_price(33, 41),  # Sum of products 33-40
            status='delivered',
            shippingAddress="654 Fifth Ave, WA"
        ),
        # Additional orders with different statuses
        Order(
            buyerId=1,
            totalPrice=product1.price * 2,  # Two of product 1
            status='processing',
            shippingAddress="123 Demo St, NY"
        ),
        Order(
            buyerId=2,
            totalPrice=product2.price,  # One of product 2
            status='shipped',
            shippingAddress="456 Marnie Ave, CA"
        ),
        Order(
            buyerId=3,
            totalPrice=product3.price,  # One of product 3
            status='processing',
            shippingAddress="789 Bobbie Rd, TX"
        )
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
