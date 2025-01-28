from app.models import db, Favorite, environment, SCHEMA
from sqlalchemy.sql import text


def seed_favorites():
   one = Favorite(userId=1, productId=3)
   two = Favorite(userId=2, productId=2)
   three = Favorite(userId=3, productId=1)
   four = Favorite(userId=4, productId=4)
   five = Favorite(userId=5, productId=7)
   six = Favorite(userId=1, productId=2)
   seven = Favorite(userId=2, productId=4)
   eight = Favorite(userId=3, productId=9)
   nine = Favorite(userId=4, productId=12)
   ten = Favorite(userId=5, productId=15)
   eleven = Favorite(userId=1, productId=5)
   twelve = Favorite(userId=2, productId=6)
   thirteen = Favorite(userId=3, productId=8)
   fourteen = Favorite(userId=4, productId=10)
   fifteen = Favorite(userId=5, productId=14)
   sixteen = Favorite(userId=1, productId=11)
   seventeen = Favorite(userId=2, productId=13)
   eighteen = Favorite(userId=3, productId=7)
   nineteen = Favorite(userId=4, productId=3)
   twenty = Favorite(userId=5, productId=9)


   db.session.add_all([one, two, three, four, five, six, seven, eight, nine, ten,
                       eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty])
   db.session.commit()






   # Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_favorites():
   if environment == "production":
       db.session.execute(f"TRUNCATE table {SCHEMA}.favorites RESTART IDENTITY CASCADE;")
   else:
       db.session.execute(text("DELETE FROM favorites"))
      
   db.session.commit()


