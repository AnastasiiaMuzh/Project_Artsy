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
  const cart = useSelector((state) => state.cart.cart);
  const totalPrice = useSelector((state) => state.cart.totalPrice);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGift, setIsGift] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('vasimaster');
  const [localQuantities, setLocalQuantities] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(localStorage.getItem('orderPlaced') === 'true');

  const { setModalContent } = useModal();

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

  useEffect(() => {
    if (orderPlaced) {
      setTimeout(() => {
        localStorage.removeItem('orderPlaced'); // Удаляем статус заказа через 3 секунды
        setOrderPlaced(false);
        navigate('/'); // Перенаправляем на главную страницу
      }, 5000);
    }
  }, [orderPlaced, navigate]);

  const handleQuantityChange = async (itemId, quantity) => {
    setLocalQuantities(prev => ({ ...prev, [itemId]: quantity }));
    try {
      await dispatch(updateCartItem(itemId, quantity));
      setError(null);
    } catch (err) {
      setError("Failed to update quantity");
      console.error("Error updating quantity:", err);
    }
  };

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
      setModalContent(<GiftCheckoutModal setOrderPlaced={setOrderPlaced} />);
    } else {
      setModalContent(<CheckoutModal setOrderPlaced={setOrderPlaced} />);
    }
  };

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
      <div className="shopping-cart-header">
        <h1>Your Cart</h1>
        <h3>Artsy Purchase Protection: Shop confidently on Artsy knowing that if something goes wrong with your order, we're 
          <span className="learn-more-link">here to help</span>.<br />
             Our secure payment system and dedicated support team ensure your purchases are protected from start to finish. 
          <span className="learn-more-link"> Learn more</span> about our protection policy.</h3>
      </div>

      <div className="shopping-cart-main">
        <div className="items-cart">
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.product?.imageUrl} alt={item.product.name} className="product-image" />
              <div className="name-erq">
                <h3>{item.product.name}</h3>
                <div className="controls-group">
                  <select value={localQuantities[item.id] ?? item.quantity} onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}>
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
          <h1>How you'll pay</h1>
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

          <div className="gift-option">
            <input type="checkbox" id="gift" checked={isGift} onChange={() => setIsGift(!isGift)} />
            <label htmlFor="gift">Mark order as a gift</label>
          </div>

          <button className="checkout-button" onClick={handleCheckout}>Proceed to checkout</button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
