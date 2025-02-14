import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateCartItem, removeFromCart } from '../../../redux/shopping_carts';
import { useModal } from '../../../context/Modal';
import './CartEditModal.css';

const CheckoutModal = () => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const [shippingAddress, setShippingAddress] = useState('');

  const handleConfirm = async () => {
    try {
        await dispatch(checkout(shippingAddress));
        closeModal();
    } catch (err) {
        console.error('Error placing order:', err)
    }
  };


  return (
    <div className='checkout-modal-container'>
        <h2>Go to checkout</h2>

        <label>
        Shipping Address
        <input
          type="text"
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
        />
      </label>

      <button onClick={handleConfirm}>Place Order</button>
      <button onClick={closeModal}>Cancel</button>

    </div>
  )







};

export default CheckoutModal;;