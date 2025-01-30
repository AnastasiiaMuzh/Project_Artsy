from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Product, User, Favorite

favorite_routes = Blueprint('favorites', __name__)

# Get all favorites for current user
@favorite_routes.route('', methods=['GET'])
@login_required
def get_favorites():
    """
    Returns all favorited products for the current user
    """
    favorites = Favorite.query.filter_by(userId=current_user.id).all()
    products = [Product.query.get(fav.productId) for fav in favorites]
    
    return {'Favorites': [
        {
            'id': fav.id,
            'userId': current_user.id,
            'productId': product.id,
            'Product': {
                'id': product.id,
                'name': product.name,
                'price': str(product.price),
                'previewImage': product.images[0].url if product.images else None
            }
        } for fav, product in zip(favorites, products)
    ]}

# Add product to favorites
@favorite_routes.route('', methods=['POST'])
@login_required
def add_favorite():
    """
    Adds a product to current user's favorites
    """
    data = request.get_json()
    product_id = data.get('productId')
    
    if not product_id:
        return jsonify({'errors': {'productId': 'Product ID is required'}}), 400
        
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404
        
    existing_favorite = Favorite.query.filter_by(
        userId=current_user.id,
        productId=product_id
    ).first()
    
    if existing_favorite:
        return jsonify({'message': 'Product already in favorites'}), 400
        
    new_favorite = Favorite(
        userId=current_user.id,
        productId=product_id
    )
    
    db.session.add(new_favorite)
    db.session.commit()
    
    return jsonify({
        'id': new_favorite.id,
        'userId': current_user.id,
        'productId': product_id
    }), 201

# Remove product from favorites
@favorite_routes.route('/<int:product_id>', methods=['DELETE'])
@login_required
def remove_favorite(product_id):
    """
    Removes a product from current user's favorites
    """
    favorite = Favorite.query.filter_by(
        userId=current_user.id,
        productId=product_id
    ).first()
    
    if not favorite:
        return jsonify({'message': 'Product not in favorites'}), 404
        
    db.session.delete(favorite)
    db.session.commit()
    
    return jsonify({'message': 'Successfully removed from favorites'}) 