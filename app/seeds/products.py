from app.models import db, Product, environment, SCHEMA
from sqlalchemy.sql import text

def seed_products():
    one = Product(
        name='Best apple of the valley - Sweet and Crisp', sellerId=1, price=5, category='fruit', description='These apples are handpicked from the finest orchards, known for their sweet, crisp taste and perfect for snacking or baking your favorite desserts.'
    )
    two = Product(
        name='Organic Honey - Pure and Natural', sellerId=2, price=15, category='pantry', description="This 100 percent organic honey is harvested from wildflowers and offers a rich, natural sweetness that’s perfect for tea, baking, or drizzling over toast."
    )
    three = Product(
        name='Handmade Wooden Coasters - Set of 4', sellerId=3, price=20, category='home decor', description='A beautiful set of four handcrafted wooden coasters that protect your furniture while adding a touch of elegance to your living space or coffee table.'
    )
    four = Product(
        name='Vintage Ceramic Vase - Classic Design', sellerId=4, price=30, category='home decor', description='This vintage ceramic vase features a timeless design that complements any home decor, perfect for displaying fresh flowers or as a standalone centerpiece.'
    )
    five = Product(
        name='Soy Wax Scented Candle - Lavender Bliss', sellerId=5, price=12, category='candles', description='Relax and unwind with this lavender-scented soy wax candle, offering a clean, long-lasting burn and a soothing fragrance to create a calming atmosphere.'
    )
    six = Product(
        name='Knitted Wool Scarf - Cozy and Warm', sellerId=1, price=25, category='clothing', description='Stay warm and stylish with this hand-knitted wool scarf, made from premium yarn to ensure softness, durability, and comfort during chilly weather.'
    )
    seven = Product(
        name='Artisanal Ceramic Mug - Unique Patterns', sellerId=2, price=18, category='kitchenware', description='Enjoy your favorite beverage in this handmade ceramic mug featuring unique patterns, a perfect addition to your kitchenware collection or as a gift.'
    )
    eight = Product(
        name='Organic Soap Bar - Aloe Vera and Oats', sellerId=3, price=8, category='skincare', description='A soothing and nourishing soap bar made with natural ingredients like aloe vera and oats, ideal for gentle cleansing and moisturizing your skin.'
    )
    nine = Product(
        name='Leather Tote Bag - Durable and Stylish', sellerId=4, price=50, category='accessories', description='This handcrafted leather tote bag is both stylish and practical, featuring a spacious interior and durable design for all your daily essentials.'
    )
    ten = Product(
        name='Recycled Paper Journal - Eco-Friendly', sellerId=5, price=10, category='stationery', description='Keep your thoughts organized with this sustainable journal made from recycled paper, perfect for writing, sketching, or planning your next big idea.'
    )
    eleven = Product(
        name='Natural Lip Balm - Shea Butter Formula', sellerId=1, price=6, category='skincare', description='Keep your lips hydrated and smooth with this natural lip balm, enriched with shea butter and essential oils for long-lasting moisture.'
    )
    twelve = Product(
        name='Handmade Beaded Bracelet - Colorful Charm', sellerId=2, price=15, category='jewelry', description='Add a pop of color to your outfit with this vibrant handmade beaded bracelet, perfect for casual or special occasions and a great gift option.'
    )
    thirteen = Product(
        name='Macrame Wall Hanging - Boho Style', sellerId=3, price=35, category='home decor', description='Transform your space with this elegant macrame wall hanging, a bohemian-inspired piece that adds texture and charm to any room.'
    )
    fourteen = Product(
        name='Custom Engraved Cutting Board', sellerId=4, price=40, category='kitchenware', description='A personalized wooden cutting board made from premium materials, perfect for food prep, serving, or gifting to loved ones with custom engraving.'
    )
    fifteen = Product(
        name='Herbal Tea Blend - Calm and Relaxation', sellerId=5, price=10, category='pantry', description='Enjoy a moment of peace with this calming herbal tea blend, crafted from natural ingredients to help you relax and unwind after a long day.'
    )
    sixteen = Product(
        name='Crochet Plant Hanger - Handmade Design', sellerId=1, price=18, category='home decor', description='Showcase your favorite plants in style with this handmade crochet plant hanger, designed to complement your home decor with a touch of elegance.'
    )

    db.session.add()