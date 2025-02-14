from app.models import db, OrderItem, Product, environment, SCHEMA
from sqlalchemy.sql import text




# Adds a demo user, you can add other users here if you want
def seed_order_items():
    # Get all products and their prices
    products = Product.query.all()
    products_dict = {p.id: p.price for p in products}
    
    # Create order items for all products that have reviews
    order_items = []
    
    # Demo user's delivered orders (Order 1)
    for product_id in range(1, 9):  # Products 1-8
        product_price = products_dict[product_id]
        order_items.append(OrderItem(
            orderId=1,
            productId=product_id,
            price=product_price,
            quantity=1
        ))
    
    # Marnie's delivered orders (Order 2)
    for product_id in range(9, 17):  # Products 9-16
        product_price = products_dict[product_id]
        order_items.append(OrderItem(
            orderId=2,
            productId=product_id,
            price=product_price,
            quantity=1
        ))
    
    # Bobbie's delivered orders (Order 3)
    for product_id in range(17, 25):  # Products 17-24
        product_price = products_dict[product_id]
        order_items.append(OrderItem(
            orderId=3,
            productId=product_id,
            price=product_price,
            quantity=1
        ))
    
    # User 4's delivered orders (Order 4)
    for product_id in range(25, 33):  # Products 25-32
        product_price = products_dict[product_id]
        order_items.append(OrderItem(
            orderId=4,
            productId=product_id,
            price=product_price,
            quantity=1
        ))
    
    # User 5's delivered orders (Order 5)
    for product_id in range(33, 41):  # Products 33-40
        product_price = products_dict[product_id]
        order_items.append(OrderItem(
            orderId=5,
            productId=product_id,
            price=product_price,
            quantity=1
        ))
    
    # Additional order items for non-delivered orders
    order_items.extend([
        OrderItem(
            orderId=6,  # Demo's processing order
            productId=1,
            price=products_dict[1],
            quantity=2
        ),
        OrderItem(
            orderId=7,  # Marnie's shipped order
            productId=2,
            price=products_dict[2],
            quantity=1
        ),
        OrderItem(
            orderId=8,  # Bobbie's processing order
            productId=3,
            price=products_dict[3],
            quantity=1
        )
    ])

    for item in order_items:
        db.session.add(item)

    db.session.commit()




# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_order_items():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.order_items RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM order_items"))
      
    db.session.commit()