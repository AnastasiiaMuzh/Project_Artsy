import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, removeFromCart, updateCartItem, addToCart } from "../../redux/shopping_carts";
import OpenModalButton from '../OpenModalButton'
import CartEditModal from './CartEditModal'
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover, FaPaypal, FaGooglePay } from 'react-icons/fa';
import './ShoppingCart.css';

const ShoppingCart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const itemCount = useSelector((state) => state.cart.itemCount);
  const sessionUser = useSelector((state) => state.session.session);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGift, setIsGift] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showComingSoon, setShowComingSoon] = useState(false);

  useEffect(() => {
    const loadCart = async () => {
        try {
            setLoading(true);
            await dispatch(fetchCart());
            setError(null);
        } catch (err) {
            setError("Failed to load cart");
            console.error("Error loading cart:", err);
        } finally {
            setLoading(false);
        }
    };

    loadCart();
}, [dispatch]);

const handleQuantityChange = async (itemId, quantity) => {
    try{
        await dispatch(updateCartItem(itemId, quantity));
        setError(null)
    } catch (err) {
        setError("Failed to update quantity");
        console.error("Error updating quantity:", err);
    }
}

const handleRemove = async (itemId) => {
    try {
        await dispatch(removeFromCart(itemId));
        setError(null);
    } catch (err) {
        setError("Failed to delete item");
        console.error("Error deleting product:", err);
    }
};

const handleCheckout = () => {
    if (isGift) {
      OpenModalButton({ buttonText: "Gift Checkout", modalComponent: <GiftCheckoutModal /> });
    } else {
      OpenModalButton({ buttonText: "Standard Checkout", modalComponent: <StandardCheckoutModal /> });
    }
  };

if (loading) return <div>Loading Cart...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!cart || cart.length === 0) return (
    <div>
      <h2>Your Cart</h2>
      <p>Your cart is empty</p>
    </div>
  );

  return (
    <div className="shopping-cart-container">
      <div className="shopping-cart-header">
        <h1>Your Cart</h1>
        <h3>Artsy Purchase Protection: Shop confidently on Artsy knowing that if something goes wrong with your order, we're <span className="learn-more-link" onClick={() => setShowComingSoon(true)}>here to help</span>.<br />
             Our secure payment system and dedicated support team ensure your purchases are protected from start to finish. 
          <span className="learn-more-link" onClick={() => setShowComingSoon(true)}> Learn more</span> about our protection policy.</h3>
        </div>

        <div className="shopping-cart-main">
            <div className="items-cart">
                {cart.map((item) => (
                <div className="cart-item">
                <img src={item.product?.imageUrl} alt={item.product.name} className="product-image" />
                <div className="name-erq">
                    <h3>{item.product.name}</h3>
                    <div className="controls-group">
                        <select value={item.quantity} onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}>
                            {[...Array(200).keys()].map((num) => (
                                <option key={num + 1} value={num + 1}>{num + 1}</option>
                            ))}
                        </select>
                        <OpenModalButton buttonText="Edit" modalComponent={<CartEditModal item={item} />} />
                        <button onClick={() => handleRemove(item.id)}>Remove</button>
                    </div>
                </div>
                <div className="price-product">
                    <p>${(item.product.price * item.quantity).toFixed(2)}</p>
                    <p className="price-each">(${item.product.price} each)</p>
                </div>
            </div>
                ))}
            </div>

        <div className="checkout-summary-section">
          <h3>How you'll pay</h3>
          <div className="payment-methods">
            {['visa_master_amex', 'paypal', 'googlepay'].map(method => (
              <div key={method} className="payment-option">
                <label htmlFor={method}>
                  <img src={`/images/${method}.png`} alt={method} className="payment-icon" />
                </label>
                <input type="radio" id={method} name="paymentMethod" value={method} onChange={() => setPaymentMethod(method)} />
              </div>
            ))}
          </div>

          <div className="order-summary">
            <p>Item(s) total: ${totalPrice.toFixed(2)}</p>
            <p className="discount">Shop discount: $0.00</p>
            <p>Subtotal: ${totalPrice.toFixed(2)}</p>
            <p className="tax">Shipping and tax calculated at checkout</p>
          </div>

          <div className="gift-option">
            
            <label htmlFor="gift">Mark order as a gift</label>
            <input type="checkbox" id="gift" checked={isGift} onChange={() => setIsGift(!isGift)} />
          </div>

          <button className="checkout-button" onClick={handleCheckout}>Proceed to checkout</button>
        </div>
      </div>
      </div>
  );
};

export default ShoppingCart; 
