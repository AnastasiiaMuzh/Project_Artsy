import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import { useNavigate } from "react-router-dom";
import "./SignupFormModal.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords must match";
    }

    if (password && password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setValidationErrors(newErrors);
  }, [email, password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (password !== confirmPassword) {
      setErrors({
        confirmPassword: "Confirm Password field must be the same as the Password field"
      });
      return;
    }

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        username,
        firstName,
        lastName,
        password,
      })
    );

    // console.log("Server Response:", serverResponse); // Debug log

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
      closeModal();
      navigate("/");
    }
  };

  return (
    <div className="signup-modal">
      <div className="signup-header">
        <h1>Sign Up</h1>
      </div>
      
      <form className="signup-form" onSubmit={handleSubmit}>
        {errors.general && (
          <div className="error-banner">
            {errors.general}
          </div>
        )}

        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className={errors.email ? 'error' : ''}
            required
          />
          {errors.email && <p className="signup-error-message">{errors.email}</p>}
          {validationErrors.email && <p className="signup-error-message">{validationErrors.email}</p>}
        </label>

        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className={errors.username ? 'error' : ''}
            required
          />
          {errors.username && <p className="signup-error-message">{errors.username}</p>}
        </label>

        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            required
          />
        </label>

        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          {errors.password && <p className="signup-error-message">{errors.password}</p>}
          {validationErrors.password && <p className="signup-error-message">{validationErrors.password}</p>}
        </label>

        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />
          {errors.confirmPassword && <p className="signup-error-message">{errors.confirmPassword}</p>}
          {validationErrors.confirmPassword && (
            <p className="signup-error-message">{validationErrors.confirmPassword}</p>
          )}
        </label>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
