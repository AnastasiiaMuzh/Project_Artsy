import { useState } from "react";
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
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
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
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p>{errors.email}</p>}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p>{errors.password}</p>}
        <button type="submit">Log In</button>
        <button type="button" onClick={handleDemoLogin} className="demo-login">
          Demo User
        </button>
      </form>
    </div>
  );
}

export default LoginFormModal;
