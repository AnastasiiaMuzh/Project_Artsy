import { useState, useEffect } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { fetchUserFavorites } from "../../redux/favorites";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const { closeModal } = useModal();

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Client-side validation
  useEffect(() => {
    const newErrors = {};

    if (email && !validateEmail(email)) {
      newErrors.email = "Please provide a valid email address";
    }

    setValidationErrors(newErrors);
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Check for validation errors before submitting
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      // Handle nested errors object
      if (serverResponse.errors) {
        setErrors(serverResponse.errors);
      } 
      // Handle flat error object
      else if (typeof serverResponse === 'object') {
        setErrors(serverResponse);
      }
      // Handle string error
      else {
        setErrors({ general: serverResponse });
      }
    } else {
      await dispatch(fetchUserFavorites());
      closeModal();
    }
  };

  const handleDemoLogin = async (e) => {
    e.preventDefault();
    const serverResponse = await dispatch(
      thunkLogin({
        email: "john.smith@io.com",
        password: "password1"
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      await dispatch(fetchUserFavorites());
      closeModal();
    }
  };

  return (
    <div className='login-modal-container'>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit} className="login-form">
        {errors.general && (
          <div className="login-error-banner">
            {errors.general}
          </div>
        )}

        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email || validationErrors.email ? 'error' : ''}
            required
          />
          {errors.email && <p className="login-error-message">{errors.email}</p>}
          {validationErrors.email && <p className="login-error-message">{validationErrors.email}</p>}
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? 'error' : ''}
            required
          />
          {errors.password && <p className="login-error-message">{errors.password}</p>}
        </label>

        <button type="submit">Log In</button>
        <button type="button" onClick={handleDemoLogin} className="demo-login">
          Demo User
        </button>
      </form>
    </div>
  );
}

export default LoginFormModal;
