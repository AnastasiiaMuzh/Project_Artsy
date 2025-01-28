from app.models import db, ProductImage, environment, SCHEMA
from sqlalchemy.sql import text

def seed_product_images():
    one = ProductImage(productId =1, url='https://i0.wp.com/wolffsapplehouse.com/wp-content/uploads/2012/09/honeycrisp.jpeg?ssl=1', preview=True)
    two = ProductImage(productId =1, url='https://www.greenthumbsgarden.com/cdn/shop/products/Honeycrisp1_1400x.jpg?v=1585011292', preview=False)
    three = ProductImage(productId =1, url='https://mnhardy.umn.edu/sites/mnhardy.umn.edu/files/styles/folwell_full/public/2022-08/honeycrisp.jpg?itok=AZdBuW1g', preview=False)
    four = ProductImage(productId =2, url='https://images.pexels.com/photos/1872904/pexels-photo-1872904.jpeg?auto=compress&cs=tinysrgb&w=600', preview=True)
    five = ProductImage(productId =2, url='https://images.pexels.com/photos/2260933/pexels-photo-2260933.jpeg?auto=compress&cs=tinysrgb&w=600', preview=False)
    six = ProductImage(productId =2, url='https://images.pexels.com/photos/714522/pexels-photo-714522.jpeg?auto=compress&cs=tinysrgb&w=600', preview=False)
    seven = ProductImage(productId =3, url='https://images.pexels.com/photos/6167932/pexels-photo-6167932.jpeg?auto=compress&cs=tinysrgb&w=600', preview=True)
    eight = ProductImage(productId =3, url='https://images.pexels.com/photos/9683888/pexels-photo-9683888.jpeg?auto=compress&cs=tinysrgb&w=600', preview=False)
    nine = ProductImage(productId =3, url='https://images.pexels.com/photos/6802901/pexels-photo-6802901.jpeg?auto=compress&cs=tinysrgb&w=600', preview=False)
    ten = ProductImage(productId =4, url='https://images.pexels.com/photos/30329884/pexels-photo-30329884/free-photo-of-elegant-chinese-porcelain-vases-on-display.jpeg?auto=compress&cs=tinysrgb&w=600', preview=True)
    eleven = ProductImage(productId =4, url='https://images.pexels.com/photos/2775837/pexels-photo-2775837.jpeg?auto=compress&cs=tinysrgb&w=600', preview=False)
    twelve = ProductImage(productId =4, url='https://images.pexels.com/photos/1366879/pexels-photo-1366879.jpeg?auto=compress&cs=tinysrgb&w=600', preview=False)
    thirteen = ProductImage(productId =5, url='https://images.pexels.com/photos/368888/pexels-photo-368888.jpeg?auto=compress&cs=tinysrgb&w=600', preview=True)
    fourteen = ProductImage(productId =5, url='https://images.pexels.com/photos/18672896/pexels-photo-18672896/free-photo-of-batch-of-notebooks-in-wooden-box.jpeg?auto=compress&cs=tinysrgb&w=600', preview=False)
    fifteen = ProductImage(productId =5, url='https://images.pexels.com/photos/6373293/pexels-photo-6373293.jpeg?auto=compress&cs=tinysrgb&w=600', preview=False)
    sixteen = ProductImage(productId =6, url='https://images.pexels.com/photos/3654777/pexels-photo-3654777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', preview=True)
    seventeen = ProductImage(productId =6, url='https://images.pexels.com/photos/5709931/pexels-photo-5709931.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', preview=False)
    eighteen = ProductImage(productId =6, url='https://images.pexels.com/photos/9770427/pexels-photo-9770427.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', preview=False)
    nineteen = ProductImage(productId =7, url='https://images.pexels.com/photos/1461806/pexels-photo-1461806.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', preview=True)
    twenty = ProductImage(productId =7, url='https://images.pexels.com/photos/28864231/pexels-photo-28864231/free-photo-of-vintage-ceramic-mugs-hanging-in-rustic-setting.jpeg?auto=compress&cs=tinysrgb&w=600', preview=False)
    twenty_one = ProductImage(productId =7, url='https://images.pexels.com/photos/19479558/pexels-photo-19479558/free-photo-of-ceramic-cup-on-a-desk.jpeg?auto=compress&cs=tinysrgb&w=600', preview=True)
    twenty_two = ProductImage(productId =8, url='https://images.pexels.com/photos/4210342/pexels-photo-4210342.jpeg?auto=compress&cs=tinysrgb&w=600', preview=False)
    twenty_three = ProductImage(productId =8, url='https://images.pexels.com/photos/6621323/pexels-photo-6621323.jpeg?auto=compress&cs=tinysrgb&w=600', preview=False)
    twenty_four = ProductImage(productId =8, url='https://images.pexels.com/photos/7814804/pexels-photo-7814804.jpeg?auto=compress&cs=tinysrgb&w=600', preview=True)
    twenty_five = ProductImage(productId =9, url='https://images.pexels.com/photos/26316185/pexels-photo-26316185/free-photo-of-woman-hands-holding-bag.jpeg?auto=compress&cs=tinysrgb&w=600', preview=False)
    twenty_six = ProductImage(productId =9, url='https://images.pexels.com/photos/167703/pexels-photo-167703.jpeg?auto=compress&cs=tinysrgb&w=600', preview=True)
    twenty_seven = ProductImage(productId =9, url='https://images.pexels.com/photos/6649414/pexels-photo-6649414.jpeg?auto=compress&cs=tinysrgb&w=600', preview=False)
    twenty_eight = ProductImage(productId =10, url='https://images.pexels.com/photos/368888/pexels-photo-368888.jpeg?auto=compress&cs=tinysrgb&w=600', preview=False)
    twenty_nine = ProductImage(productId =10, url='https://images.pexels.com/photos/18672896/pexels-photo-18672896/free-photo-of-batch-of-notebooks-in-wooden-box.jpeg?auto=compress&cs=tinysrgb&w=600', preview=True)
    thirty = ProductImage(productId =10, url='https://images.pexels.com/photos/6373293/pexels-photo-6373293.jpeg?auto=compress&cs=tinysrgb&w=600', preview=False)
    thirty_one = ProductImage(productId =11, url='https://images.pexels.com/photos/6187571/pexels-photo-6187571.jpeg?auto=compress&cs=tinysrgb&w=600', preview=True)
    thirty_two = ProductImage(productId =11, url='https://images.pexels.com/photos/8272661/pexels-photo-8272661.jpeg?auto=compress&cs=tinysrgb&w=600', preview=False)
    thirty_three = ProductImage(productId =11, url='https://images.pexels.com/photos/3394198/pexels-photo-3394198.jpeg?auto=compress&cs=tinysrgb&w=600', preview=False)
    thirty_four = ProductImage(productId =12, url='https://images.pexels.com/photos/11635474/pexels-photo-11635474.jpeg?auto=compress&cs=tinysrgb&w=600', preview=True)
    thirty_five = ProductImage(productId =12, url='https://images.pexels.com/photos/11157528/pexels-photo-11157528.jpeg?auto=compress&cs=tinysrgb&w=600', preview=False)
    thirty_six = ProductImage(productId =12, url='https://images.pexels.com/photos/10562316/pexels-photo-10562316.jpeg?auto=compress&cs=tinysrgb&w=600', preview=False)
    thirty_seven = ProductImage(productId =13, url='https://images.pexels.com/photos/18915435/pexels-photo-18915435/free-photo-of-dreamcatcher-mirror-hanging-on-wooden-wall.jpeg?auto=compress&cs=tinysrgb&w=600', preview=True)
    thirty_eight = ProductImage(productId =13, url='https://images.pexels.com/photos/15443347/pexels-photo-15443347/free-photo-of-crescent-on-wall-over-table.jpeg?auto=compress&cs=tinysrgb&w=600', preview=False)
    thirty_nine = ProductImage(productId =13, url='https://images.pexels.com/photos/5467456/pexels-photo-5467456.jpeg?auto=compress&cs=tinysrgb&w=600', preview=False)
    forty = ProductImage(productId =14, url='https://images.pexels.com/photos/4197827/pexels-photo-4197827.jpeg?auto=compress&cs=tinysrgb&w=600', preview=True)
    forty_one = ProductImage(productId =14, url='https://images.pexels.com/photos/4397792/pexels-photo-4397792.jpeg?auto=compress&cs=tinysrgb&w=600', preview=False)
    forty_two = ProductImage(productId =14, url='https://images.pexels.com/photos/17949898/pexels-photo-17949898/free-photo-of-a-steak-on-a-wooden-cutting-board.jpeg?auto=compress&cs=tinysrgb&w=600', preview=False)
    forty_three = ProductImage(productId =15, url='https://images.pexels.com/photos/227908/pexels-photo-227908.jpeg?auto=compress&cs=tinysrgb&w=600', preview=True)
    forty_four = ProductImage(productId =15, url='https://images.pexels.com/photos/230477/pexels-photo-230477.jpeg?auto=compress&cs=tinysrgb&w=600', preview=False)
    forty_five = ProductImage(productId =15, url='https://images.pexels.com/photos/905485/pexels-photo-905485.jpeg?auto=compress&cs=tinysrgb&w=600', preview=False)
    forty_six = ProductImage(productId =16, url='https://images.pexels.com/photos/7649508/pexels-photo-7649508.jpeg?auto=compress&cs=tinysrgb&w=600', preview=True)
    forty_seven = ProductImage(productId =16, url='https://images.pexels.com/photos/11013261/pexels-photo-11013261.jpeg?auto=compress&cs=tinysrgb&w=600', preview=False)
    forty_eight = ProductImage(productId =16, url='https://images.pexels.com/photos/9413661/pexels-photo-9413661.jpeg?auto=compress&cs=tinysrgb&w=600', preview=False)

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
    db.session.add(eleven)
    db.session.add(twelve)
    db.session.add(thirteen)
    db.session.add(fourteen)
    db.session.add(fifteen)
    db.session.add(sixteen)
    db.session.add(seventeen)
    db.session.add(eighteen)
    db.session.add(nineteen)
    db.session.add(twenty)
    db.session.add(twenty_one)
    db.session.add(twenty_two)
    db.session.add(twenty_three)
    db.session.add(twenty_four)
    db.session.add(twenty_five)
    db.session.add(twenty_six)
    db.session.add(twenty_seven)
    db.session.add(twenty_eight)
    db.session.add(twenty_nine)
    db.session.add(thirty)
    db.session.add(thirty_one)
    db.session.add(thirty_two)
    db.session.add(thirty_three)
    db.session.add(thirty_four)
    db.session.add(thirty_five)
    db.session.add(thirty_six)
    db.session.add(thirty_seven)
    db.session.add(thirty_eight)
    db.session.add(thirty_nine)
    db.session.add(forty)
    db.session.add(forty_one)
    db.session.add(forty_two)
    db.session.add(forty_three)
    db.session.add(forty_four)
    db.session.add(forty_five)
    db.session.add(forty_six)
    db.session.add(forty_seven)
    db.session.add(forty_eight)
    db.session.commit()

    # Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_product_images():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.product_images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM product_images"))
        
    db.session.commit()