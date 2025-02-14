import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../../context/Modal';
import { checkout } from '../../../redux/shopping_carts';

const CheckoutModal = () => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const currentUser = useSelector((state) => state.session.session);

  // Get the user's full name for display
  const userName = `${currentUser.firstName} ${currentUser.lastName}`;

  // State to manage the shipping address input fields
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    state: '',
  });

  // State to track validation errors
  const [errors, setErrors] = useState({});

  // Function to validate each field
  const validateField = (name, value) => {
    let error = '';

    if (!value.trim()) {
      error = 'This field is required.';
    } else {
      if (name === 'address' && !/^\d+\s[A-Za-z\s]+$/.test(value)) {
        error = 'Enter a valid address (e.g., 123 Main Street).';
      }
      if (name === 'city' && !/^[A-Za-z\s]{3,}$/.test(value)) {
        error = 'City must contain only letters (e.g., New York).';
      }
      if (name === 'state' && !/^[A-Z]{2}$/.test(value)) {
        error = 'State must be a two-letter code (e.g., NY).';
      }
    }

    return error;
  };

  // Handle input field changes and update state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));

    // Validate the input field in real-time
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  // Check if the form is valid
  const isFormValid =
    Object.values(shippingAddress).every((val) => val.trim() !== '') &&
    Object.values(errors).every((err) => err === '');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation check before submitting
    const newErrors = {
      address: validateField('address', shippingAddress.address),
      city: validateField('city', shippingAddress.city),
      state: validateField('state', shippingAddress.state),
    };

    setErrors(newErrors);

    if (!isFormValid) return;

    try {
      // Format the shipping address before sending
      const formattedAddress = `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state}`;
      await dispatch(checkout(formattedAddress)); 
      closeModal();
    } catch (err) {
      console.error('Error placing order:', err);
    }
  };

  return (
    <div className="checkout-modal-container">
      <h2>Go to checkout, {userName}!</h2>

      {/* Display user's information (read-only) */}
      <div className="user-info">
        <p><strong>First Name:</strong> {currentUser.firstName}</p>
        <p><strong>Last Name:</strong> {currentUser.lastName}</p>
        <p><strong>Email:</strong> {currentUser.email}</p>
      </div>

      {/* Shipping address form */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            placeholder="123 Main Street"
            value={shippingAddress.address}
            onChange={handleChange}
            className={errors.address ? 'error-input' : ''}
          />
          {errors.address && <p className="error-message">{errors.address}</p>}
        </div>

        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            name="city"
            placeholder="New York"
            value={shippingAddress.city}
            onChange={handleChange}
            className={errors.city ? 'error-input' : ''}
          />
          {errors.city && <p className="error-message">{errors.city}</p>}
        </div>

        <div className="form-group">
          <label>State</label>
          <input
            type="text"
            name="state"
            placeholder="NY"
            value={shippingAddress.state}
            onChange={handleChange}
            className={errors.state ? 'error-input' : ''}
          />
          {errors.state && <p className="error-message">{errors.state}</p>}
        </div>

        {/* Form action buttons */}
        <div className="checkout-buttons">
          <button type="submit" disabled={!isFormValid}>Place Order</button>
          <button type="button" onClick={closeModal}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutModal;
