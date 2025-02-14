import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import './ShoppingCart.css';

const StandardCheckoutModal = () => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const sessionUser = useSelector((state) => state.session.session);
  const [shippingAddress, setShippingAddress] = useState('');

  const handleAddressChange = (e) => {
    setShippingAddress(e.target.value);
  };

  const handleConfirm = async () => {
    const orderData = {
      buyerId: sessionUser.id,
      totalPrice: sessionUser.cartTotal, // assuming cart total is stored in session
      shippingAddress,
    };
    await dispatch(createOrder(orderData)); // Assuming you have a createOrder action
    closeModal();
  };

  return (
    <div className="checkout-modal">
      <h2>Confirm Your Order</h2>
      <p><strong>Name:</strong> {sessionUser.firstName} {sessionUser.lastName}</p>
      <p><strong>Email:</strong> {sessionUser.email}</p>
      <label htmlFor="shippingAddress">Shipping Address</label>
      <input
        type="text"
        id="shippingAddress"
        value={shippingAddress}
        onChange={handleAddressChange}
        placeholder="123 Main Street, New York, NY"
      />
      <button onClick={handleConfirm}>Confirm Order</button>
    </div>
  );
};

const GiftCheckoutModal = () => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [giftDetails, setGiftDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    shippingAddress: '',
    message: ''
  });

  const handleChange = (e) => {
    setGiftDetails({
      ...giftDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleConfirm = async () => {
    const orderData = {
      buyerId: null, // Gift orders may not have a logged-in user
      totalPrice: 0, // Replace with actual cart total if needed
      shippingAddress: giftDetails.shippingAddress,
      giftDetails,
    };
    await dispatch(createGiftOrder(orderData)); // Assuming you have a createGiftOrder action
    closeModal();
  };

  return (
    <div className="gift-checkout-modal">
      <h2>Gift Checkout</h2>
      <label htmlFor="firstName">First Name</label>
      <input type="text" name="firstName" value={giftDetails.firstName} onChange={handleChange} />

      <label htmlFor="lastName">Last Name</label>
      <input type="text" name="lastName" value={giftDetails.lastName} onChange={handleChange} />

      <label htmlFor="email">Email</label>
      <input type="email" name="email" value={giftDetails.email} onChange={handleChange} />

      <label htmlFor="shippingAddress">Shipping Address</label>
      <input type="text" name="shippingAddress" value={giftDetails.shippingAddress} onChange={handleChange} placeholder="123 Main Street, New York, NY" />

      <label htmlFor="message">Message</label>
      <textarea name="message" value={giftDetails.message} onChange={handleChange} />

      <button onClick={handleConfirm}>Confirm Gift Order</button>
    </div>
  );
};

export { StandardCheckoutModal, GiftCheckoutModal };
