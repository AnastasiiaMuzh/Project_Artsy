from flask.cli import AppGroup
from .users import seed_users, undo_users
from .products import seed_products, undo_products
from .product_images import seed_product_images, undo_product_images
from .favorites import seed_favorites, undo_favorites
from .orders import seed_orders, undo_orders
from .review_images import seed_review_images, undo_review_images
from .order_items import seed_order_items, undo_order_items
from .shopping_cart_items import seed_shopping_cart_items, undo_shopping_cart_items
from .reviews import seed_reviews, undo_reviews

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')

# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo
        # command, which will  truncate all tables prefixed with
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_order_items()
        undo_orders()
        undo_reviews()
        undo_review_images()
        undo_shopping_cart_items()
        undo_favorites()
        undo_product_images()
        undo_products()
        undo_users()

    # Seed in correct order
    seed_users()
    seed_products()  # Products must be seeded first
    seed_product_images()
    seed_orders()    # Then orders
    seed_order_items()  # Then order items
    seed_reviews()   # Then reviews (which depend on orders)
    seed_review_images()
    seed_favorites()
    seed_shopping_cart_items()

    # Add other seed functions here

# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    # Undo in reverse order
    undo_shopping_cart_items()
    undo_favorites()
    undo_review_images()
    undo_reviews()
    undo_order_items()
    undo_orders()
    undo_product_images()
    undo_products()
    undo_users()

    # Add other undo functions here
