import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../../context/Modal';
import { checkout } from '../../../redux/shopping_carts';
import { useNavigate } from 'react-router-dom';
import './CheckoutModal.css';

const CheckoutModal = () => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.session.session);

  const userName = `${currentUser.firstName} ${currentUser.lastName}`;

  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    state: '',
  });

  const [errors, setErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);

  const validateField = (name, value) => {
    let error = '';

    if (!value.trim()) {
      error = 'This field is required.';
    } else {
      if (name === 'address' && !/^\d+\s[A-Za-z\s]+$/.test(value)) {
        error = 'Enter a valid address (e.g., 123 Main Street).';
      }
      if (name === 'city' && !/^[A-Za-z\s]{3,}$/.test(value)) {
        error = 'Invalid city format (e.g., New York).';
      }
      if (name === 'state' && !/^[A-Z]{2}$/.test(value)) {
        error = 'Invalid state format (e.g., NY).';
      }
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const isFormValid =
    Object.values(shippingAddress).every((val) => val.trim() !== '') &&
    Object.values(errors).every((err) => err === '');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      address: validateField('address', shippingAddress.address),
      city: validateField('city', shippingAddress.city),
      state: validateField('state', shippingAddress.state),
    };

    setErrors(newErrors);

    if (!isFormValid) return;

    try {
      const formattedAddress = `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state}`;
      await dispatch(checkout(formattedAddress));

      setOrderPlaced(true);
      localStorage.setItem('orderPlaced', 'true');
      

      setTimeout(() => {
        localStorage.removeItem('orderPlaced'); // Очищаем localStorage
        closeModal();
        navigate('/'); // Перенаправляем на главную
      }, 3000); // 3 секунды на показ сообщения, потом редирект
    } catch (err) {
      console.error('Error placing order:', err);
    }
  };

  return (
    <div className="checkout-modal-container">
      {orderPlaced ? (
        <div className="order-success">
          <h2>Thank you for your order, {userName}!</h2>
          <p>Your order has been successfully placed.</p>
        </div>
      ) : (
        <>
          <h2>Go to checkout, {userName}!</h2>
          <div className="user-info">
            <p><strong>First Name:</strong> {currentUser.firstName}</p>
            <p><strong>Last Name:</strong> {currentUser.lastName}</p>
            <p><strong>Email:</strong> {currentUser.email}</p>
          </div>

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

            <div className="checkout-buttons">
              <button type="submit" disabled={!isFormValid}>Place Order</button>
              <button type="button" onClick={closeModal}>Cancel</button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default CheckoutModal;
