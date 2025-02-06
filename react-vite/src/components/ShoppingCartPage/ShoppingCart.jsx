import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, fetchCart, removeFromCart, updateCartItem } from "../../redux/shopping_carts";

const ShoppingCart = () => {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.cart);
    const totalPrice = useSelector((state) => state.cart.totalPrice);
    const itemCount = useSelector((state) => state.cart.itemCount);


    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch])

    if (!cart.length) {
        return <div> Cart is empty.</div>;
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
        <div className="shopping-cart">
            <h2>Your Cart</h2>
            <p>Products: {itemCount}</p>
            <p>Total price: {totalPrice}</p>
        </div>
    )


}

export default ShoppingCart;