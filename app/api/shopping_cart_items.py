from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user  
#from werkzeug.exceptions import BadRequest, NotFound, Forbidden
from app.models import db, ShoppingCartItem, Product, Order, OrderItem, User
from datetime import datetime

cart_routes = Blueprint('cart', __name__)


#------------------------Task 1) Returns cart items for current user with products details and total cart price. Auth required. GET /api/cart------------------------

@cart_routes.route('/', methods=['GET'])
@login_required
def get_cart():
    """
    Get user's shopping cart with calculated total
    Returns:
        { cart: [], total_price: float }
    """
    
    try:
        # Get all cart items for current user with product details
        cart_items = ShoppingCartItem.query.filter_by(buyerId=current_user.id).all()

        # Calculate total price 
        total_price = sum(item.quantity * item.products.price for item in cart_items)

        # Format response
        return jsonify({
            "success": True,
            "cart": [{
                "id": item.id,
                "productId": item.productId,
                "quantity": item.quantity,
                "product": {
                    "name": item.products.name,
                    "price": float(item.products.price),
                    "imageUrl": next((img.url for img in item.products.images if img.preview), None)
                }
            } for item in cart_items],
            "totalPrice": float(total_price),
            "itemCount": len(cart_items)
        }), 200 

    except Exception:
        return jsonify({"error": "Failed to fetch cart. Please try again later."}), 500


# ------------------------Task 2 -> Add product to cart POST /api/cart/item ------------------------

@cart_routes.route('/item', methods=['POST'])
@login_required
def add_to_cart():
    """
    Add item to cart
    Expects JSON: { "productId": int, "quantity": int }
    """
    try:
        data = request.get_json()

        # Validate required fields
        if not data or 'productId' not in data:
            return jsonify({"error": "Missing required field: productId"}), 400

        product_id = data['productId']
        quantity = data.get('quantity', 1)  # Default to 1 if not provided

        # Validate productId type
        if not isinstance(product_id, int) or product_id <= 0:
            return jsonify({"error": "Invalid product ID format"}), 400

        # Validate quantity
        if not isinstance(quantity, int) or quantity < 1:
            return jsonify({"error": "Quantity must be a positive number"}), 400

        # Check product existence
        product = Product.query.get(product_id)
        if not product:
            return jsonify({"error": f"Product not found"}), 404

        # Prevent self-purchase
        if product.sellerId == current_user.id:
            return jsonify({"error": "Cannot add your own product to cart"}), 403

        # Find or create cart item
        cart_item = ShoppingCartItem.query.filter_by(
            buyerId=current_user.id,
            productId=product_id
        ).first()

        if cart_item:
            cart_item.quantity += quantity
            cart_item.updatedAt = datetime.utcnow()
        else:
            cart_item = ShoppingCartItem(
                buyerId=current_user.id,
                productId=product_id,
                quantity=quantity
            )
            db.session.add(cart_item)

        db.session.commit()

        return jsonify({
            "message": "Item added to cart",
            "itemId": cart_item.id,
            "quantity": cart_item.quantity,
            "productId": product_id
        }), 201

    except Exception:
        # Rollback the session in case of an error to avoid partial commits
        db.session.rollback()
        return jsonify({"error": "Internal server error. Please try again later."}), 500
    

# --------------------- Decrease quantity of cart item PATCH /api/cart/item/:id ------------------------

@cart_routes.route('/item/<int:item_id>', methods=['PATCH'])
@login_required
def decrease_cart_item(item_id):
    """
    Decrease item quantity in cart
    Expects JSON: { "quantity": int }
    - 'quantity' indicates how many units to subtract from the current quantity.
    - If the resulting quantity is zero or less, the item is removed from the cart.
    """
    try:
        data = request.get_json()

        # Validate if 'quantity' is present and is an integer
        if 'quantity' not in data or not isinstance(data['quantity'], int):
            return jsonify({"error": "Missing or invalid quantity"}), 400

        decrease_quantity = data['quantity']

        # Ensure that the quantity to be decreased is at least 1
        if decrease_quantity < 1:
            return jsonify({"error": "Quantity must be at least 1"}), 400

        # Fetch the cart item by its ID
        cart_item = ShoppingCartItem.query.get(item_id)

        # If the cart item doesn't exist, return a 404 Not Found error
        if not cart_item:
            return jsonify({"error": "Cart item not found"}), 404

        # Ensure that the cart item belongs to the currently logged-in user
        if cart_item.buyerId != current_user.id:
            return jsonify({"error": "Not authorized to modify this cart"}), 403

        # Reduce the quantity of the item in the cart
        cart_item.quantity -= decrease_quantity

        # If the quantity is now zero or less, remove the item from the cart
        if cart_item.quantity <= 0:
            db.session.delete(cart_item)
            message = "Cart item removed from cart"
        else:
            message = "Cart item quantity updated"

        db.session.commit()

        return jsonify({
            "message": message,
            "itemId": item_id,
            "newQuantity": cart_item.quantity if cart_item.quantity > 0 else 0
        }), 200

    except Exception:
        # Rollback the session in case of an error to avoid partial commits
        db.session.rollback()
        return jsonify({"error": "Internal server error. Please try again later."}), 500

# ------------------------ Task 4 -> DELETE /api/cart/remove ------------------------

@cart_routes.route('/items/<int:item_id>', methods=['DELETE'])
@login_required
def remove_item(item_id):
    """
    Remove item from cart
    """
    try:
        cart_item = ShoppingCartItem.query.get(item_id)

        if not cart_item:
            return jsonify({"error": "Cart item not found"}), 404

        # Authorization check
        if cart_item.buyerId != current_user.id:
            return jsonify({"error": "Not authorized to modify this cart"}), 403
        

        db.session.delete(cart_item)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Item removed",
            "itemId": item_id,
        }), 200
        #or return jsonify({"message": 'Item removed', 'itemId': item_id}), 200
    
    except Exception:
        # Rollback the session in case of an error to avoid partial commits
        db.session.rollback()
        return jsonify({"error": "Internal server error. Please try again later."}), 500


# ------------------------ Task 5 -> Implement /api/cart/checkout POST for transaction processing  ------------------------

@cart_routes.route('/checkout', methods=['POST'])
@login_required
def checkout():
    """
    Process cart checkout and create an order.
    Expects JSON: {
        "shippingAddress": "string"  # Required shipping address
    }
    Returns: Order details with buyer information
    """
    try:
        user_id = current_user.id
        data = request.get_json()

        # Validate shipping address
        if not data or 'shippingAddress' not in data or not data['shippingAddress'].strip():
            return jsonify({"error": "Shipping address is required"}), 400
        shipping_address = data['shippingAddress']  

        # Get cart items
        cart_items = ShoppingCartItem.query.filter_by(buyerId=user_id).all()
        if not cart_items:
            return jsonify({"error": "Cart is empty"}), 400

        # Calculate total and get user details
        user = User.query.get(user_id)
        total_price = sum(
            Product.query.get(item.productId).price * item.quantity 
            for item in cart_items
        )

        # Create order
        new_order = Order(
            buyerId=user_id,
            totalPrice=total_price,
            status="Processing",
            shippingAddress=shipping_address  
        )
        db.session.add(new_order)
        db.session.flush()  # to get new_order.id before creating order items

        # Create order items and clear cart
        for item in cart_items:
            db.session.add(OrderItem(
                orderId=new_order.id,
                productId=item.productId,
                price=Product.query.get(item.productId).price,
                quantity=item.quantity
            ))
            db.session.delete(item)

        db.session.commit()

        return jsonify({
            "message": "Order created",
            "orderId": new_order.id,
            "total": float(total_price),
            "buyerName": f"{user.firstName} {user.lastName}",
            "shippingAddress": shipping_address,  
            "email": user.email                                
        }), 201

    except Exception:
        # Rollback the session in case of an error to avoid partial commits
        db.session.rollback()
        return jsonify({"error": "Checkout failed. Please try again later."}), 500
    
    


#  Task 1 -> View Cart Items (GET /api/cart). Return products in the current user’s cart. Auth required.
#  Task 2 -> Develop /api/cart/add POST for adding products
#  Task 3 -> PATCH /api/cart/item/:id
#  Task 4 -> Create /api/cart/remove DELETE for removing items
#  Task 5 -> Implement /api/cart/checkout POST for transaction processing
# .first() нужен, чтобы не получать список, а сразу объект или None.