import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUserCircle } from 'react-icons/fa';
import { thunkLogout } from "../../redux/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./ProfileButton.css";

function ProfileButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((store) => store.session.session);
  const ulRef = useRef();
  const buttonRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    if (e.target === buttonRef.current || buttonRef.current.contains(e.target)) {
      setShowMenu(!showMenu);
    }
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout()).then(() => {
      closeMenu();
      navigate('/', { replace: true }); // Navigate to home page and replace current history entry
    });
  };

  return (
    <div className="profile-button-container">
      <button
        onClick={toggleMenu}
        className="profile-button"
        ref={buttonRef}
      >
        <FaUserCircle />
      </button>
      {showMenu && (
        <ul className="profile-dropdown" ref={ulRef}>
          {user ? (
            <>
              <div className="user-info">
                <li>Hello, {user.firstName}</li>
                <li>{user.email}</li>
              </div>
              <li>
                <NavLink to="/products/current" onClick={closeMenu} className="nav-link">
                  Manage Products
                </NavLink>
              </li>
              <li>
                <NavLink to="/reviews/current" onClick={closeMenu} className="nav-link">
                  Manage Reviews
                </NavLink>
              </li>
              <li>
                <button onClick={logout} className="logout-button">Log Out</button>
              </li>
            </>
          ) : (
            <>
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </>
          )}
        </ul>
      )}
    </div>
  );
}

export default ProfileButton;
