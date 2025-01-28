from app.models import db, OrderItem, environment, SCHEMA
from sqlalchemy.sql import text




# Adds a demo user, you can add other users here if you want
def seed_order_items():
   order1 = OrderItem(
       orderId=1, productId=1, price=5, quantity=5)
   order2 = OrderItem(
       orderId=2, productId=2, price=15, quantity=1)
   order3 = OrderItem(
       orderId=2, productId=1, price=18, quantity=1)
   order4 = OrderItem(
       orderId=3, productId=1, price=20, quantity=2)
   order5 = OrderItem(
       orderId=4, productId=1, price=12, quantity=1)
   order6 = OrderItem(
       orderId=4, productId=1, price=18, quantity=2)
   order7 = OrderItem(
       orderId=4, productId=2, price=10, quantity=2)
   order8 = OrderItem(
       orderId=5, productId=1, price=12, quantity=1)
   order9 = OrderItem(
       orderId=6, productId=1, price=15, quantity=2)
   order10 = OrderItem(
       orderId=6, productId=1, price=6, quantity=1)
   order11 = OrderItem(
       orderId=7, productId=1, price=30, quantity=1)
   order12 = OrderItem(
       orderId=8, productId=2, price=8, quantity=2)
   order13 = OrderItem(
       orderId=9, productId=1, price=50, quantity=1)
   order14 = OrderItem(
       orderId=9, productId=1, price=25, quantity=2)
   order15 = OrderItem(
       orderId=10, productId=1, price=35, quantity=1)


   db.session.add(order1)
   db.session.add(order2)
   db.session.add(order3)
   db.session.add(order4)
   db.session.add(order5)
   db.session.add(order6)
   db.session.add(order7)
   db.session.add(order8)
   db.session.add(order9)
   db.session.add(order10)
   db.session.add(order11)
   db.session.add(order12)
   db.session.add(order13)
   db.session.add(order14)
   db.session.add(order15)
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