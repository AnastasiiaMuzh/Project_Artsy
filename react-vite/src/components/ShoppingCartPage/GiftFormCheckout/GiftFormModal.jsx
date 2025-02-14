import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../../context/Modal';
import { checkout } from '../../../redux/shopping_carts';


const GiftCheckoutModal = () => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
 

  const [giftForm, setGiftForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    shippingAddress: '',
    message: ''
  });

  const handleChange = (e) => {
    setGiftForm({
      ...giftForm,
      [e.target.name]: e.target.value
    });
  };

  const handleConfirm = async () => {
    
    const shippingAddress = giftForm.shippingAddress || '';

    try {
      await dispatch(checkout(shippingAddress));
      closeModal();
    } catch (err) {
      console.error('Error confirming gift order:', err);
    }
  };

  return (
    <div className='gift-modal'>
        <h2>Gift Checkout</h2>

        <label>
            First Name
            <input
            type='text'
            name='firstName'
            value={giftForm.firstName}
            onChange={handleChange}
            />
        </label>

        <label>
            Last Name
            <input
            type='text'
            name='lastName'
            value={giftForm.lastName}
            onChange={handleChange}/>
        </label>

        <label>
            Email
            <input
            type='email'
            name='email'
            value={giftForm.email}
            onChange={handleChange}/>
        </label>

        <label>
            Shipping Address
            <input
            type='text'
            name='shippingAddress'
            value={giftForm.shippingAddress}
            onChange={handleChange}/>
        </label>

        <label>
            Message (optional)
            <textarea
            name='message'
            value={giftForm.message}
            onChange={handleChange}/>
        </label>

        <button onClick={handleConfirm}>Confirm Gift Order</button>
        <button onClick={closeModal}>Cancel</button>

    </div>
  )
};

export default GiftCheckoutModal;