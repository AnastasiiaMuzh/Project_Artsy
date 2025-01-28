from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():
    john = User(
        username='johnsmith', firstName='John', lastName='Smith', email='john.smith@io.com', password='password1')
    jane = User(
        username='janedoe', firstName='Jane', lastName='Doe', email='jane.doe@io.com', password='password2')
    alice = User(
        username='alicej', firstName='Alice', lastName='Johnson', email='alice.johnson@io.com', password='password3')
    bob = User(
        username='bobbrown', firstName='Bob', lastName='Brown', email='bob.brown@io.com', password='password4')
    charlie= User(
        username='charlied', firstName='Charlie', lastName='Davis', email='charlie.davis@io.com', password='password5')

    db.session.add(john)
    db.session.add(jane)
    db.session.add(alice)
    db.session.add(bob)
    db.session.add(charlie)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))
        
    db.session.commit()
