from app.models import db, Review, environment, SCHEMA
from sqlalchemy.sql import text




# Adds a demo user, you can add other users here if you want
def seed_reviews():
   review1 = Review(
       productId=1, buyerId=2, review="The apple was fresh and delicious.", stars=4)
   review2 = Review(
       productId=2, buyerId=3, review="Amazing honey! Perfect sweetness.", stars=5)
   review3 = Review(
       productId=3, buyerId=4, review="These coasters are so elegant.", stars=5)
   review4 = Review(
       productId=4, buyerId=5, review="The vase looks great in my living room.", stars=4)
   review5 = Review(
       productId=5, buyerId=1, review="The candle smells amazing and burns evenly.", stars=5)
   review6 = Review(
       productId=6, buyerId=2, review="The scarf is very cozy and warm.", stars=5)
   review7 = Review(
       productId=7, buyerId=3, review="Beautiful mug, but slightly smaller than expected.", stars=4)
   review8 = Review(
       productId=8, buyerId=4, review="Gentle on my skin, great soap bar.", stars=5)
   review9 = Review(
       productId=9, buyerId=5, review="The tote bag is stylish and very durable.", stars=5)
   review10 = Review(
       productId=10, buyerId=1, review="Love the journal! Perfect for sketching.", stars=5)
   review11 = Review(
       productId=11, buyerId=2, review="The lip balm works well but has a faint scent.", stars=5)
   review12 = Review(
       productId=12, buyerId=3, review="Such a cute bracelet! I love the colors.", stars=5)
   review13 = Review(
       productId=13, buyerId=4, review="Stunning wall hanging, exactly as pictured.", stars=5)
   review14 = Review(
       productId=14, buyerId=5, review="Great quality cutting board, engraving is perfect.", stars=5)
   review15 = Review(
       productId=15, buyerId=1, review="The tea is soothing and tastes amazing.", stars=5)
   review16 = Review(
       productId=16, buyerId=2, review="Very stylish plant hanger, fits perfectly.", stars=5)
   review17 = Review(
       productId=1, buyerId=3, review="Good apple, but a little pricey.", stars=3)
   review18 = Review(
       productId=2, buyerId=4, review="Best honey I’ve ever tried!", stars=5)
   review19 = Review(
       productId=3, buyerId=5, review="Coasters are nice, but one was slightly chipped.", stars=4)
   review20 = Review(
       productId=4, buyerId=1, review="The vase is beautiful, highly recommend!", stars=5)
   review21 = Review(
       productId=5, buyerId=2, review="The candle has a pleasant scent, but the burn time is short.", stars=3)
   review22 = Review(
       productId=6, buyerId=3, review="The scarf is soft, but the color was slightly different.", stars=4)
   review23 = Review(
       productId=7, buyerId=4, review="The mug is nice, but the handle feels a bit flimsy.", stars=3)
   review24 = Review(
       productId=8, buyerId=5, review="The soap smells good, but it dissolves too quickly.", stars=3)
   review25 = Review(
       productId=9, buyerId=1, review="The bag is well-made, but it’s smaller than expected.", stars=4)
   review26 = Review(
       productId=10, buyerId=2, review="The journal is okay, but the paper quality could be better.", stars=3)
   review27 = Review(
       productId=11, buyerId=3, review="The lip balm is decent, but it doesn’t last very long.", stars=3)
   review28 = Review(
       productId=12, buyerId=4, review="The bracelet is colorful, but it feels a bit fragile.", stars=4)
   review29 = Review(
       productId=13, buyerId=5, review="The wall hanging looks good, but it was overpriced.", stars=3)
   review30 = Review(
       productId=14, buyerId=1, review="The cutting board is nice, but the engraving wasn’t deep.", stars=4)
   review31 = Review(
       productId=15, buyerId=2, review="The tea is calming, but it lacked flavor for my taste.", stars=3)
   review32 = Review(
       productId=16, buyerId=3, review="The plant hanger is pretty, but it doesn’t hold heavier pots.", stars=3)
   review33 = Review(
       productId=1, buyerId=4, review="The apple was fine, but not as fresh as expected.", stars=3)
   review34 = Review(
       productId=2, buyerId=5, review="The honey is sweet, but it crystallized faster than I thought.", stars=3)
   review35 = Review(
       productId=3, buyerId=1, review="The coasters are functional, but the design wasn’t elegant.", stars=3)
   review36 = Review(
       productId=4, buyerId=2, review="The vase is okay, but it had a small scratch on it.", stars=3)
   review37 = Review(
       productId=5, buyerId=3, review="The candle smelled good, but it arrived slightly melted.", stars=3)
   review38 = Review(
       productId=6, buyerId=4, review="The scarf is warm, but the stitching started to come undone.", stars=3)
   review39 = Review(
       productId=7, buyerId=5, review="The mug is pretty, but it doesn’t keep drinks warm for long.", stars=3)
   review40 = Review(
       productId=8, buyerId=1, review="The soap is nice, but it irritated my sensitive skin.", stars=2)
  


   db.session.add(review1)
   db.session.add(review2)
   db.session.add(review3)
   db.session.add(review4)
   db.session.add(review5)
   db.session.add(review6)
   db.session.add(review7)
   db.session.add(review8)
   db.session.add(review9)
   db.session.add(review10)
   db.session.add(review11)
   db.session.add(review12)
   db.session.add(review13)
   db.session.add(review14)
   db.session.add(review15)
   db.session.add(review16)
   db.session.add(review17)
   db.session.add(review18)
   db.session.add(review19)
   db.session.add(review20)
   db.session.add(review21)
   db.session.add(review22)
   db.session.add(review23)
   db.session.add(review24)
   db.session.add(review25)
   db.session.add(review26)
   db.session.add(review27)
   db.session.add(review28)
   db.session.add(review29)
   db.session.add(review30)
   db.session.add(review31)
   db.session.add(review32)
   db.session.add(review33)
   db.session.add(review34)
   db.session.add(review35)
   db.session.add(review36)
   db.session.add(review37)
   db.session.add(review38)
   db.session.add(review39)
   db.session.add(review40)


   db.session.commit()




# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_reviews():
   if environment == "production":
       db.session.execute(f"TRUNCATE table {SCHEMA}.reviews RESTART IDENTITY CASCADE;")
   else:
       db.session.execute(text("DELETE FROM reviews"))
      
   db.session.commit()