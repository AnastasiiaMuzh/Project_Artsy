from flask import Blueprint, request, jsonify
from app.models import User, db, Product, ProductImage, Review
from flask_login import current_user, login_required
from datetime import datetime


product_routes = Blueprint('products', __name__)

# helper function for calculating the average rating
def calculate_avg_rating(product_id):
    # Search all reviews for the product
    reviews = db.session.query(Review).filter_by(productId=product_id).all()
    
    if reviews:
        # Calculate the sum of all ratings (stars) and divide by the total number of reviews
        total_rating = sum(review.stars for review in reviews)
        avg_rating = total_rating / len(reviews)
        return round(avg_rating, 1)  # Round to 1 decimal place 
    return 0  # Return 0 if no reviews exist

# helper function that returns the preview image url 
def get_preview_image_url(product_id):
    # Get the first image with the 'preview' flag set to True
    preview_image = db.session.query(ProductImage).filter_by(productId=product_id, preview=True).first()
    if preview_image:
        return preview_image.url  # Return the URL of the preview image
    return None  # If no preview image is found, return None

# helper function to format dates
def format_datetime(date):
    if date:
        return date.strftime("%Y-%m-%d %H:%M:%S")
    return None

# GET /api/products
# returns all the products
@product_routes.route('/', methods=['GET'])
def get_all_products():

    # Extract query parameters from the request (for pagination and filtering)
    page = request.args.get('page', 1, type=int)
    size = request.args.get('size', 20, type=int)
    min_price = request.args.get('minPrice', 0, type=float)
    max_price = request.args.get('maxPrice', float('inf'), type=float)
    category = request.args.get('category', '', type=str)

    # query products based on min_price and max_price
    products_query = Product.query.filter(Product.price >= min_price, Product.price <= max_price)

    # If a category exists, filter products by category using case-insensitive search
    if category:
        products_query = products_query.filter(Product.category.ilike(f'%{category}%'))

    # Paginate the results based on the provided page and size
    products = products_query.paginate(page=page, per_page=size, error_out=False)

    # list of information to return 
    product_list = [{
        'id': product.id,
        'name': product.name,
        'price': float(round(product.price, 2)),
        'sellerId': product.sellerId,
        'category': product.category,
        'description': product.description,
        'createdAt': format_datetime(product.createdAt),
        'updatedAt': format_datetime(product.updatedAt),
        'avgRating': calculate_avg_rating(product.id),
        'previewImage': get_preview_image_url(product.id)  
    } for product in products.items]

    # Return the paginated list of products as a JSON response
    return jsonify({
        'Products': product_list,
        'page': page,
        'size': size,
    })



# GET /api/products/:id
# Returns the details of a specific product by its id
@product_routes.route('/<int:id>', methods=['GET'])
def get_product(id):

    # Query the Product model to find the product by its ID
    product = Product.query.get(id)

    # If the product does not exist, return a 404 error
    if not product:
        return jsonify({"message": "Product couldn't be found"}), 404
    
    # Get the number of reviews for the product
    num_reviews = Review.query.filter_by(productId=id).count()

    # Calculate the average star rating using the helper function
    avg_rating = calculate_avg_rating(id)

    # Retrieve all product images for the product
    product_images = ProductImage.query.filter_by(productId=id).all()

    # Build the product images list
    product_images_list = [{
        'id': image.id,
        'url': image.url,
        'preview': image.preview
    } for image in product_images]

    #product details to return 
    product_data = {
        'id': product.id,
        'name': product.name,
        'sellerId': product.sellerId,
        'description': product.description,
        'price': float(round(product.price, 2)),
        'category': product.category,
        'createdAt': format_datetime(product.createdAt),
        'updatedAt': format_datetime(product.updatedAt),
        'numReviews': num_reviews,
        'avgStarRating': avg_rating,
        'ProductImages': product_images_list
    }

    # Return the product data as a JSON response
    return jsonify(product_data)



# GET /api/products/current
# Returns all products owned or sold by the currently logged-in user.
@product_routes.route('/current', methods=['GET'])
@login_required
def get_current_user_products():

    # Get the ID of the logged-in user
    current_user_id = current_user.id 

    # Filter products by seller_id to match the current user's id
    products = Product.query.filter_by(sellerId=current_user_id).all()

    # list of info to return 
    product_list = [{
        'id': product.id,
        'name': product.name,
        'sellerId': product.sellerId,
        'price': float(product.price),
        'category': product.category,
        'description': product.description,
        'createdAt': format_datetime(product.createdAt),
        'updatedAt': format_datetime(product.updatedAt),
        'avgRating': calculate_avg_rating(product.id),
        'previewImage': get_preview_image_url(product.id)
    } for product in products]

    # Return a JSON response with the list
    return jsonify({'Products': product_list})


# POST /api/products
# Creates a new product. Requires a JSON body with product details
@product_routes.route('/', methods=['POST'])
@login_required
def create_product():
    
    # Get id of current user
    current_user_id = current_user.id

    # Parse the data from the incoming request
    data = request.get_json()

    # Validate the incoming data
        # Check that the product name is not empty and is not longer than 50 characters
    if not data.get('name') or len(data['name']) > 50:
        return jsonify({"message": "Name is required and must be less than 50 characters"}), 400
        # Description is required
    if not data.get('description'):
        return jsonify({"message": "Description is required"}), 400
        # Price must be a positive number
    if not data.get('price') or data['price'] <= 0:
        return jsonify({"message": "Price must be a positive number"}), 400
        # Category is required
    if not data.get('category'):
        return jsonify({"message": "Category is required"}), 400

    # Create a new Product instance with the validated data
    new_product = Product(
        name=data['name'],
        description=data['description'],
        price=data['price'],
        category=data['category'],
        sellerId=current_user_id  # Set the current logged-in user as the seller
    )

    # Add the new product to the session and commit to save it to the database
    db.session.add(new_product)
    db.session.commit()
    
    # Return the new product
    return jsonify({
        'id': new_product.id,
        'sellerId': new_product.sellerId,
        'name': new_product.name,
        'description': new_product.description,
        'price': float(round(new_product.price, 2)),
        'category': new_product.category,
        'createdAt': format_datetime(new_product.createdAt),
        'updatedAt': format_datetime(new_product.updatedAt),
    }), 201


# PUT /api/products/:id
#Updates an existing product with the given id
@product_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_product(id):

    # Get id of current user
    current_user_id = current_user.id

    # Retrieve the product to be updated by its id
    product = Product.query.get(id)

    # If the product doesn't exist, return a 404 error with a message
    if not product:
        return jsonify({"message": "Product couldn't be found"}), 404

    # If the logged-in user is not the seller of this product, return a 403 Forbidden error
    if product.sellerId != current_user_id:
        return jsonify({"message": "Forbidden"}), 403

    # Parse the incoming request body
    data = request.get_json()

    # Validate the input fields
        # Check that the product name is not empty and is not longer than 50 characters
    if not data.get('name') or len(data['name']) > 50:
        return jsonify({"message": "Name must be less than 50 characters"}), 400
        # Description is required
    if not data.get('description'):
        return jsonify({"message": "Description is required"}), 400
        # Price must be a positive number
    price = data.get('price')
    if not price or not isinstance(price, int) or price <= 0:
        return jsonify({"message": "Price must be a positive number"}), 400
        # Category is required
    if not data.get('category'):
        return jsonify({"message": "Category is required"}), 400

    # Update the product's fields with the validated data
    product.name = data['name']
    product.description = data['description']
    product.price = float(data['price'])
    product.category = data['category']

    # Commit the changes to the database
    db.session.commit()

    # Return the updated product
    return jsonify({
        'id': product.id,
        'sellerId': product.sellerId,
        'name': product.name,
        'description': product.description,
        'price': float(round(product.price, 2)),
        'category': product.category,
        'createdAt': format_datetime(product.createdAt),
        'updatedAt': format_datetime(product.updatedAt)
    })


# DELETE /api/products/:id
# Deletes the product with the specified ID if it exists and the current logged-in user is the seller
@product_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_product(id):

    # Get the id of the currently logged-in user
    current_user_id = current_user.id 

    # get the product from the database 
    product = Product.query.get(id)

    # If the product doesn't exist, return a 404 error
    if not product:
        return jsonify({"message": "Product couldn't be found"}), 404

    # If the logged-in user is not the seller of the product, return a 403 Forbidden error
    if product.sellerId != current_user_id:
        return jsonify({"message": "Forbidden"}), 403

    # If the current user is the seller, delete the product from the database
    db.session.delete(product)
    db.session.commit()

    # Return a success message
    return jsonify({"message": "Successfully deleted"})



## Product Images ## 

# add a product image 
@product_routes.route('<int:productId>/productImages', methods=['POST'])
@login_required
def add_product_image(productId):

    current_user_id = current_user.id
    product = Product.query.get(productId)
    if not product:
       return jsonify({"message": "Product couldn't be found"}), 404
    
    if product.sellerId != current_user_id:
       return jsonify({"message": "Forbidden"}), 403

    # Get the image URL and preview flag from the request
    data = request.get_json()

    image_url = data.get('url')
    preview = data.get('preview', False)


    if not image_url:
        return jsonify({"message": "Image URL is required"}), 400


    # Check if there are already 10 images attached to the product (limit)
    if len(product.images) >= 10:
        return jsonify({"message": "Maximum number of images for this product reached"}), 403


    # Create and add the product image
    new_image = ProductImage(url=image_url, preview=preview, productId=product.id)
    db.session.add(new_image)
    db.session.commit()


    return jsonify({
        'id': new_image.id,
        'url': new_image.url,
        'preview': new_image.preview
    }), 201

# Update a product image
# PUT /api/products/:id/images
@product_routes.route('/<int:id>/images', methods=['PUT'])
@login_required
def update_product_images(id):
    current_user_id = current_user.id

    # Get the product by its id
    product = Product.query.get(id)

    # If the product doesn't exist, return an error
    if not product:
        return jsonify({"message": "Product couldn't be found"}), 404

    # If the logged-in user is not the seller of the product, return a 403 Forbidden error
    if product.sellerId != current_user_id:
        return jsonify({"message": "Forbidden"}), 403

    # Get the data (new images) from the request
    data = request.get_json()
    imageUrls = data.get('imageUrls', [])  # An array of image URLs to add to the product
    previewImageUrl = data.get('previewImageUrl', None)  # The URL of the new preview image

    # Remove old images or keep them based on your logic (optional)
    # For example, clear all images and only add the new ones
    product.images.clear()

    # Add new images to the product
    for image_url in imageUrls:
        # make first image the preview image
        preview = image_url == previewImageUrl if previewImageUrl else False
        new_image = ProductImage(url=image_url, preview=preview, productId=product.id)
        db.session.add(new_image)

    # Commit the changes to the database
    db.session.commit()

    # Return the updated list of images along with their preview status
    updated_images = [{'id': img.id, 'url': img.url, 'preview': img.preview} for img in product.images]

    return jsonify({
        'productId': product.id,
        'images': updated_images
    }), 200


# Delete a product image 
@product_routes.route('/<int:product_id>/<int:image_id>', methods=['DELETE'])
@login_required
def delete_product_image(product_id, image_id):
    # Get the ID of the logged-in user
    current_user_id = current_user.id 


    # Find the product by ID
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"message": "Product couldn't be found"}), 404


    # Check if the current user is the seller of the product
    if product.sellerId != current_user_id:
        return jsonify({"message": "Forbidden"}), 403


    # Find the product image by its id
    product_image = ProductImage.query.filter_by(productId=product_id, id=image_id).first()
    if not product_image:
        return jsonify({"message": "Product Image couldn't be found"}), 404


    # Delete the product image
    db.session.delete(product_image)
    db.session.commit()


    return jsonify({"message": "Successfully deleted"}), 200
