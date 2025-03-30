import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../../context/Modal';
import { checkout } from '../../../redux/shopping_carts';
import { useNavigate } from 'react-router-dom';
import './CheckoutModal.css';

const CheckoutModal = ({ fields, title, showUserInfo = false, setOrderPlaced }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.session.session);

  const userName = `${currentUser.firstName} ${currentUser.lastName}`;
  const [errors, setErrors] = useState({});
  const [orderPlacedLocal, setOrderPlacedLocal] = useState(false); //My local state for order

  // const [shippingAddress, setShippingAddress] = useState({
  //   address: '',
  //   city: '',
  //   state: '',
  //   zipCode: '',
  // });

  // dinamic object for all field
  const initialFormState = fields.reduce((acc, field) => {
    acc[field.name] = '';
    return acc;
  },{});
  const [formData, setFormData] = useState(initialFormState);


  const validateField = (name, value) => {
    let error = '';

    if (!value.trim() && name !== 'message') {
      error = 'This field is required.';
    } else {
      if (name === 'firstName' && !/^[A-Za-zА-Яа-я'-]{2,50}$/.test(value)) {
        error = 'Please enter a valid first name.';
      }
      if (name === 'lastName' && !/^[A-Za-zА-Яа-я'-]{2,50}$/.test(value)) {
        error = 'Please enter a valid last name .';
      }
      if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = 'Enter a valid email.';
      }
      if (name === 'address' && !/\d+ [A-Za-z]+/.test(value)) {
        error = 'Enter a valid address (e.g., 123 Main Street).';
      }
      if (name === 'city' && value.length < 3) {
        error = 'City must be at least 3 characters.';
      }
      if (name === 'state' && value.length !== 2) {
        error = 'State must be 2 characters (e.g., NY).';
      }
      if (name === 'zipCode' && !/^\d{5}(-\d{4})?$/.test(value)) {
        error = 'Enter a valid zip code (e.g., 10001 or 10001-1234).';
      }
    }
    return error;
  };

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  // Проверка валидности формы
  const isFormValid =
  Object.entries(formData)
    .filter(([key]) => key !== 'message') // Исключаем необязательные поля
    .every(([_, val]) => val.trim() !== '') && // Проверяем, что все поля заполнены
  Object.values(errors).every((err) => err === ''); // Проверяем, что нет ошибок

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!isFormValid) return;

    try {
      const address = `${formData.address}, ${formData.city}, ${formData.state}, ${formData.zipCode}`;
      await dispatch(checkout(address)); // Отправка данных
      setOrderPlacedLocal(true);
      setOrderPlaced(true); // Обновляем состояние в ShoppingCart
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
      {orderPlacedLocal ? (
        <div className="order-success">
          <h2>Thank you for your order, {userName}!</h2>
          <p>Your order has been successfully placed.</p>
        </div>
      ) : (
        <>
          <h2>{title}</h2>
          {showUserInfo && ( 
          <div className="user-info">
            <p><strong>First Name:</strong> {currentUser.firstName}</p>
            <p><strong>Last Name:</strong> {currentUser.lastName}</p>
            <p><strong>Email:</strong> {currentUser.email}</p>
          </div>
          )}

          <form onSubmit={handleSubmit}>
            {fields.map((field) => (
            <div className="form-group" key={field.name}>
              <label>{field.label}</label>
              {field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                  />
                ) : (
                  <input
                    type={field.type || 'text'}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className={errors[field.name] ? 'error-input' : ''}
                    placeholder={field.placeholder}
                  />
                )}
                {errors[field.name] && <p className="error-message">{errors[field.name]}</p>}
              </div>
            ))}

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

