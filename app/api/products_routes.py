from flask import Blueprint, request, jsonify
from app.models import User, db, Product, ProductImage, Review
from flask_login import current_user


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
    products = products_query.paginate(page, size, False)

    # list of information to return 
    product_list = [{
        'id': product.id,
        'name': product.name,
        'price': product.price,
        'sellerId': product.sellerId,
        'category': product.category,
        'description': product.description,
        'createdAt': product.created_at,
        'updatedAt': product.updated_at,
        'avgRating': calculate_avg_rating(product.id),
        'previewImage': get_preview_image_url(product.id)  
    } for product in products.items]

    # Return the paginated list of products as a JSON response
    return jsonify({
        'Products': product_list,
        'page': page,
        'size': size,
        'totalPages': products.pages
    })



# GET /api/products/:id
# Returns the details of a specific product by its id
@product_routes.route('/:id', methods=['GET'])
def get_product(id):

    # Query the Product model to find the product by its ID
    product = Product.query.get(id)

    # If the product does not exist, return a 404 error
    if not product:
        return jsonify({"message": "Product couldn't be found"}), 404
    
    # Get the number of reviews for the product
    num_reviews = Review.query.filter_by(product_id=id).count()

    # Calculate the average star rating using the helper function
    avg_rating = calculate_avg_rating(id)

    # Retrieve all product images for the product
    product_images = ProductImage.query.filter_by(product_id=id).all()

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
        'price': product.price,
        'category': product.category,
        'createdAt': product.created_at,
        'updatedAt': product.updated_at,
        'numReviews': num_reviews,
        'avgStarRating': avg_rating,
        'ProductImages': product_images_list
    }

    # Return the product data as a JSON response
    return jsonify(product_data)



# GET /api/products/current
# Returns all products owned or sold by the currently logged-in user.
@product_routes.route('/current', methods=['GET'])
def get_current_user_products():

    # Get the ID of the logged-in user
    current_user_id = current_user.id 

    # Filter products by seller_id to match the current user's id
    products = Product.query.filter_by(seller_id=current_user_id).all()

    # list of info to return 
    product_list = [{
        'id': product.id,
        'name': product.name,
        'sellerId': product.sellerId,
        'price': product.price,
        'category': product.category,
        'description': product.description,
        'createdAt': product.created_at,
        'updatedAt': product.updated_at,
        'avgRating': calculate_avg_rating(product.id),
        'previewImage': get_preview_image_url(product.id)
    } for product in products]

    # Return a JSON response with the list
    return jsonify({'Products': product_list})


# POST /api/products
# Creates a new product. Requires a JSON body with product details
@product_routes.route('/', methods=['POST'])
def create_product():
    
    # Get id of current user
    current_user_id = current_user.id

    # Parse the data from the incoming request
    data = request.get_json()

    # Validate the incoming data
        # Check that the product name is not empty and is not longer than 50 characters
    if not data.get('name') or len(data['name']) > 50:
        return jsonify({"message": "Name must be less than 50 characters"}), 400
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
        seller_id=current_user_id  # Set the current logged-in user as the seller
    )

    # Add the new product to the session and commit to save it to the database
    db.session.add(new_product)
    db.session.commit()
    
    # Return the new product
    return jsonify({
        'id': new_product.id,
        'sellerId': new_product.seller_id,
        'name': new_product.name,
        'description': new_product.description,
        'price': new_product.price,
        'category': new_product.category,
        'createdAt': new_product.created_at,
        'updatedAt': new_product.updated_at,
    }), 201


# PUT /api/products/:id
#Updates an existing product with the given id
@product_routes.route('/:id', methods=['PUT'])
def update_product(id):

    # Get id of current user
    current_user_id = current_user.id

    # Retrieve the product to be updated by its id
    product = Product.query.get(id)

    # If the product doesn't exist, return a 404 error with a message
    if not product:
        return jsonify({"message": "Product couldn't be found"}), 404

    # If the logged-in user is not the seller of this product, return a 403 Forbidden error
    if product.seller_id != current_user_id:
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
    if not data.get('price') or data['price'] <= 0:
        return jsonify({"message": "Price must be a positive number"}), 400
        # Category is required
    if not data.get('category'):
        return jsonify({"message": "Category is required"}), 400

    # Update the product's fields with the validated data
    product.name = data['name']
    product.description = data['description']
    product.price = data['price']
    product.category = data['category']

    # Commit the changes to the database
    db.session.commit()

    # Return the updated product
    return jsonify({
        'id': product.id,
        'sellerId': product.seller_id,
        'name': product.name,
        'description': product.description,
        'price': product.price,
        'category': product.category,
        'createdAt': product.created_at,
        'updatedAt': product.updated_at
    })


# DELETE /api/products/:id
# Deletes the product with the specified ID if it exists and the current logged-in user is the seller
@product_routes.route('/<int:id>', methods=['DELETE'])
def delete_product(id):

    # Get the id of the currently logged-in user
    current_user_id = User.query.get(id)

    # get the product from the database 
    product = Product.query.get(id)

    # If the product doesn't exist, return a 404 error
    if not product:
        return jsonify({"message": "Product couldn't be found"}), 404

    # If the logged-in user is not the seller of the product, return a 403 Forbidden error
    if product.seller_id != current_user_id:
        return jsonify({"message": "Forbidden"}), 403

    # If the current user is the seller, delete the product from the database
    db.session.delete(product)
    db.session.commit()

    # Return a success message
    return jsonify({"message": "Successfully deleted"})



## Product Images ## Add to new routes page named product_images_routes

# add a product image 
@product_routes.route('', methods=['POST'])
def add_product_image():
    pass



# Delete a product image 
@product_routes.route('', methods=['DELETE'])
def delete_product_image():
    pass