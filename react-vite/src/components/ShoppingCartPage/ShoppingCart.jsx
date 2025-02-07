import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, removeFromCart, updateCartItem, addToCart } from "../../redux/shopping_carts";

const ShoppingCart = () => {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.cart);
    const totalPrice = useSelector((state) => state.cart.totalPrice);
    const itemCount = useSelector((state) => state.cart.itemCount);


    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch])

    if (!cart.length) {
        return <div>
        <h2>Your Cart</h2>
        <p>Your cart is empty.</p>
    </div>
    }
    
    const handleRemove = (itemId) => {
        dispatch(removeFromCart(itemId));
    };

    const handleDecrease = (itemId) => {
        dispatch(updateCartItem(itemId, 1));
    };

    const handleIncrease = (productId) => {
        dispatch(addToCart(productId, 1));
    } ;

    return(
        <div className="cart-container">
        <div className="shopping-cart">
            <h2>Your Cart</h2>
            <p>Products: {itemCount}</p>
            <p>Total price: {totalPrice}</p>
        </div>

        <div className="list-cart">
        <ul>
        {cart.map((item) => (
          <li key={item.itemId}>
            <div>Product ID: {item.productId}</div>
            <div>Quantity: {item.quantity}</div>
            <div>Price: {item.price || 0} (per 1 item)</div>

            <button onClick={() => handleDecrease(item)}>-</button>
            <button onClick={() => handleIncrease(item)}>+</button>
            <button onClick={() => handleRemove(item.itemId)}>Remove</button>
          </li>
        ))}
      </ul>
        </div>
        </div>
    )


}

export default ShoppingCart;