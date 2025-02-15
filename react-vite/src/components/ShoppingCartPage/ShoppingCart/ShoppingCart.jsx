import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, removeFromCart, updateCartItem } from "../../../redux/shopping_carts";
import OpenModalButton from '../../OpenModalButton'
import CartEditModal from "../CartEditModal/./CartEditModal";
import GiftCheckoutModal from "../GiftFormCheckout/GiftFormModal";
import CheckoutModal from "../CheckoutModal/./CheckoutModal";
import { useModal } from '../../../context/Modal';
import { useNavigate } from 'react-router-dom';
import './ShoppingCart.css';



const ShoppingCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Select cart data from Redux store
  const cart = useSelector((state) => state.cart.cart);
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  // State management
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGift, setIsGift] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('vasimaster');
  const [orderPlaced, setOrderPlaced] = useState(localStorage.getItem('orderPlaced') === 'true');

  const { setModalContent } = useModal();

  /*Fetch the cart data when the component load*/
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

  
  /**  Handle order completion logic.
   * - Displays a confirmation message for 5 seconds
   * - Clears the order status from local storage
   * - Redirects the user to the homepage */
  useEffect(() => {
    if (orderPlaced) {
      setTimeout(() => {
        localStorage.removeItem('orderPlaced'); // Remove order status from storage
        setOrderPlaced(false);
        navigate('/');  // Redirect to home
      }, 5000);
    }
  }, [orderPlaced, navigate]);

  
  /* Handles product quantity changes in the cart.
   - Ensures valid numbers before dispatching the update action*/
  const handleQuantityChange = async (itemId, quantity) => {
    try {
      await dispatch(updateCartItem(itemId, quantity));  // Update item quantity in the backend
      setError(null);
    } catch (err) {
      setError("Failed to update quantity");
      console.error("Error updating quantity:", err);
    }
  };

  
   /* Handles item removal from the cart.*/
  const handleRemove = async (itemId) => {
    try {
      await dispatch(removeFromCart(itemId));
      setError(null);
    } catch (err) {
      setError("Failed to delete item");
      console.error("Error deleting product:", err);
    }
  };

  
   /** Handles checkout modal selection.
   * - Opens the gift checkout modal if `isGift` is checked
   * - Otherwise, opens the regular checkout modal*/
  const handleCheckout = () => {
    if (isGift) {
      setModalContent(<GiftCheckoutModal setOrderPlaced={setOrderPlaced} />);
    } else {
      setModalContent(<CheckoutModal setOrderPlaced={setOrderPlaced} />);
    }
  };

  /** Render loading, error, or order confirmation screens*/
  if (loading) return <div>Loading Cart...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  if (orderPlaced) {
    return (
      <div className="order-confirmation">
        <h2>Thank you for your order!</h2>
        <p>Your order has been successfully placed.</p>
        <button onClick={() => navigate('/')}>Continue Shopping</button>
      </div>
    );
  }

  if (!cart || cart.length === 0) return (
    <div>
      <h1>Your cart is empty</h1>
    </div>
  );

  return (
    <div className="shopping-cart-container">
      {/* Header Section - Title and Purchase Protection Info */}
      <div className="shopping-cart-header">
        <h1>Your Cart</h1>
        <h3>Artsy Purchase Protection: Shop confidently on Artsy knowing that if something goes wrong with your order, we're 
          <span className="learn-more-link">here to help</span>.<br />
             Our secure payment system and dedicated support team ensure your purchases are protected from start to finish. 
          <span className="learn-more-link"> Learn more</span> about our protection policy.</h3>
      </div>

      {/* Main Cart Section - Contains Items List and Checkout Summary */}
      <div className="shopping-cart-main">
        
        {/* Items List - Displays all products in the cart */}
        <div className="items-cart">
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              {/* Product Image */}
              <img src={item.product?.imageUrl} alt={item.product.name} className="product-image" />
              
              {/* Product Name and Controls */}
              <div className="name-erq">
                <h3>{item.product.name}</h3>
                
                {/* Quantity Selector, Edit, and Remove Buttons */}
                <div className="controls-group">
                  {/* Dropdown to select product quantity */}
                  <select
                    value={item.quantity} // Use Redux state instead of local state
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      handleQuantityChange(item.id, isNaN(value) ? item.quantity : value);
                    }}
                  >
                    {[...Array(200).keys()].map((num) => (
                      <option key={num + 1} value={num + 1}>{num + 1}</option>
                    ))}
                  </select>

                  {/* Button to open modal for editing product details */}
                  <OpenModalButton buttonText="Edit" modalComponent={<CartEditModal item={item} />} />

                  {/* Button to remove product from cart */}
                  <button onClick={() => handleRemove(item.id)}>Remove</button>
                </div>
              </div>

              {/* Price Section - Displays total price and per-item price */}
              <div className="price-product">
                <p>${(item.product.price * item.quantity).toFixed(2)}</p>
                <p className="price-each">(${item.product.price} each)</p>
              </div>
            </div>
          ))}
        </div>

        {/* Checkout Summary Section - Payment Methods and Order Summary */}
        <div className="checkout-summary-section">
          <h1>How you'll pay</h1>
          
          {/* Payment Methods - Allows user to choose a payment option */}
          <div className="payment-methods">
            {['vasimaster', 'paypal', 'googlepay'].map(method => (
              <div key={method} className="payment-option">
                <input type="radio" id={method} name="paymentMethod" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                <label htmlFor={method}>
                  <img src={`/images/${method}.png`} alt={method} className="payment-icon" />
                </label>
              </div>
            ))}
          </div>

          {/* Order Summary - Displays subtotal, discounts, and tax info */}
          <div className="order-summary">
            <p>
              <span className="left-part">Item(s) total:</span>
              <span className="right-part"> ${totalPrice.toFixed(2)}</span>
            </p>
            <p className="discount">
              <span className="left-part">Shop discount:</span>
              <span className="right-part"> $0.00</span>
            </p>
            <p className="total">
              <span className="left-part">Subtotal: </span>
              <span className="right-part">${totalPrice.toFixed(2)}</span>
            </p>
            <p className="tax">Shipping and tax calculated at checkout</p>
          </div>

          {/* Gift Option - Allows user to mark order as a gift */}
          <div className="gift-option">
            <input type="checkbox" id="gift" checked={isGift} onChange={() => setIsGift(!isGift)} />
            <label htmlFor="gift">Mark order as a gift</label>
          </div>

          {/* Checkout Button - Proceeds to checkout process */}
          <button className="checkout-button" onClick={handleCheckout}>Proceed to checkout</button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;

