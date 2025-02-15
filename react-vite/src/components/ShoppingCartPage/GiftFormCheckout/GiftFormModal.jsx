import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../../context/Modal';
import { checkout } from '../../../redux/shopping_carts';
import './GiftCheckoutModal.css';

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
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = '';
    if (!value.trim() && name !== 'message') {
      error = 'This field is required.';
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGiftForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const isFormValid =
    Object.entries(giftForm)
      .filter(([key]) => key !== 'message')
      .every(([_, val]) => val.trim() !== '') &&
    Object.values(errors).every((err) => err === '');

  const handleConfirm = async () => {
    if (!isFormValid) return;

    try {
      await dispatch(checkout(giftForm.shippingAddress));
      closeModal();
    } catch (err) {
      console.error('Error confirming gift order:', err);
    }
  };

  return (
    <div className='gift-modal'>
      <h2>Gift Checkout</h2>
      <div className='gift-form'>
        {['firstName', 'lastName', 'email', 'shippingAddress'].map((field) => (
          <div className='form-group' key={field}>
            <label>{field.replace(/([A-Z])/g, ' $1').trim()}</label>
            <input
              type={field === 'email' ? 'email' : 'text'}
              name={field}
              value={giftForm[field]}
              onChange={handleChange}
              className={errors[field] ? 'error-input' : ''}
            />
            {errors[field] && <p className='error-message'>{errors[field]}</p>}
          </div>
        ))}
        <div className='form-group'>
          <label>Message (optional)</label>
          <textarea name='message' value={giftForm.message} onChange={handleChange} />
        </div>
      </div>
      <div className='checkout-buttons'>
        <button onClick={handleConfirm} disabled={!isFormValid}>Confirm Gift Order</button>
        <button onClick={closeModal}>Cancel</button>
      </div>
    </div>
  );
};

export default GiftCheckoutModal;
