from app.models import db, ReviewImage, environment, SCHEMA
from sqlalchemy.sql import text




# Adds a demo user, you can add other users here if you want
def seed_review_images():
   image1 = ReviewImage(
       reviewId=7, url="https://images.pexels.com/photos/18868635/pexels-photo-18868635/free-photo-of-hand-painted-cup.jpeg?auto=compress&cs=tinysrgb&w=600")
   image2 = ReviewImage(
       reviewId=12, url="https://images.pexels.com/photos/8760637/pexels-photo-8760637.jpeg?auto=compress&cs=tinysrgb&w=600")
   image3 = ReviewImage(
       reviewId=6, url="https://images.pexels.com/photos/1436134/pexels-photo-1436134.jpeg?auto=compress&cs=tinysrgb&w=600")


   db.session.add(image1)
   db.session.add(image2)
   db.session.add(image3)
   db.session.commit()




# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_review_images():
   if environment == "production":
       db.session.execute(f"TRUNCATE table {SCHEMA}.review_images RESTART IDENTITY CASCADE;")
   else:
       db.session.execute(text("DELETE FROM review_images"))
      
   db.session.commit()
