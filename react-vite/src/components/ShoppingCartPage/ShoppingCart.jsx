import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchCart, 
  removeFromCart, 
  updateCartItem, 
  addToCart 
} from "../../redux/shopping_carts";

const ShoppingCart = () => {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.cart);
    const totalPrice = useSelector((state) => state.cart.totalPrice);
    const itemCount = useSelector((state) => state.cart.itemCount);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const handleRemove = (itemId) => {
        dispatch(removeFromCart(itemId));
    };

    const handleDecrease = (item) => {
        if (item.quantity > 1) {
            dispatch(updateCartItem(item.itemId, 1));
        } else {
            dispatch(removeFromCart(item.itemId));
        }
    };

    const handleIncrease = (item) => {
        dispatch(addToCart(item.productId, 1));
    };

    if (!cart.length) {
        return <div>Cart is empty.</div>;
    }

    return (
        <div className="shopping-cart">
            <h2>Your Cart</h2>
            <p>Products: {itemCount}</p>
            <p>Total price: ${totalPrice.toFixed(2)}</p>
            <div className="cart-items">
                {cart.map(item => (
                    <div key={item.itemId} className="cart-item">
                        <img 
                            src={item.product.imageUrl} 
                            alt={item.product.name} 
                            className="item-image"
                        />
                        <div className="item-details">
                            <h3>{item.product.name}</h3>
                            <p>Price: ${item.product.price.toFixed(2)}</p>
                            <div className="quantity-controls">
                                <button onClick={() => handleDecrease(item)}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => handleIncrease(item)}>+</button>
                            </div>
                            <button onClick={() => handleRemove(item.itemId)}>Remove</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShoppingCart;