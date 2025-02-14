from app.models import db, OrderItem, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_order_items():
    order_items = [
        # Order 1 (Demo)
        OrderItem(orderId=1, productId=5, price=12, quantity=1),
        OrderItem(orderId=1, productId=10, price=10, quantity=1),
        OrderItem(orderId=1, productId=15, price=10, quantity=1),
        OrderItem(orderId=1, productId=4, price=30, quantity=1),
        OrderItem(orderId=1, productId=9, price=50, quantity=1),
        OrderItem(orderId=1, productId=14, price=40, quantity=1),
        OrderItem(orderId=1, productId=3, price=20, quantity=1),
        OrderItem(orderId=1, productId=8, price=8, quantity=1),

        # Order 2 (Marnie)
        OrderItem(orderId=2, productId=1, price=5, quantity=1),
        OrderItem(orderId=2, productId=6, price=25, quantity=1),
        OrderItem(orderId=2, productId=11, price=6, quantity=1),
        OrderItem(orderId=2, productId=16, price=18, quantity=1),
        OrderItem(orderId=2, productId=5, price=12, quantity=1),
        OrderItem(orderId=2, productId=10, price=10, quantity=1),
        OrderItem(orderId=2, productId=15, price=10, quantity=1),
        OrderItem(orderId=2, productId=4, price=30, quantity=1),

        # Order 3 (Bobbie)
        OrderItem(orderId=3, productId=2, price=15, quantity=1),
        OrderItem(orderId=3, productId=7, price=18, quantity=1),
        OrderItem(orderId=3, productId=12, price=15, quantity=1),
        OrderItem(orderId=3, productId=1, price=5, quantity=1),
        OrderItem(orderId=3, productId=6, price=25, quantity=1),
        OrderItem(orderId=3, productId=11, price=6, quantity=1),
        OrderItem(orderId=3, productId=16, price=18, quantity=1),
        OrderItem(orderId=3, productId=5, price=12, quantity=1),

        # Order 4 (User 4)
        OrderItem(orderId=4, productId=3, price=20, quantity=1),
        OrderItem(orderId=4, productId=8, price=8, quantity=1),
        OrderItem(orderId=4, productId=13, price=35, quantity=1),
        OrderItem(orderId=4, productId=2, price=15, quantity=1),
        OrderItem(orderId=4, productId=7, price=18, quantity=1),
        OrderItem(orderId=4, productId=12, price=15, quantity=1),
        OrderItem(orderId=4, productId=1, price=5, quantity=1),
        OrderItem(orderId=4, productId=6, price=25, quantity=1),

        # Order 5 (User 5)
        OrderItem(orderId=5, productId=4, price=30, quantity=1),
        OrderItem(orderId=5, productId=9, price=50, quantity=1),
        OrderItem(orderId=5, productId=14, price=40, quantity=1),
        OrderItem(orderId=5, productId=3, price=20, quantity=1),
        OrderItem(orderId=5, productId=8, price=8, quantity=1),
        OrderItem(orderId=5, productId=13, price=35, quantity=1),
        OrderItem(orderId=5, productId=2, price=15, quantity=1),
        OrderItem(orderId=5, productId=7, price=18, quantity=1),

        # Additional orders
        OrderItem(orderId=6, productId=2, price=15, quantity=2),
        OrderItem(orderId=7, productId=3, price=20, quantity=1),
        OrderItem(orderId=8, productId=4, price=30, quantity=1),
    ]

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