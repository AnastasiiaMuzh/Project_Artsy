import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import { FaHeart, FaPlus, FaSearch } from 'react-icons/fa';
import "./Navigation.css";
import { useSelector } from 'react-redux';
import { FaShoppingCart } from 'react-icons/fa';

function Navigation() {
  const [searchQuery, setSearchQuery] = useState("");
  const sessionUser = useSelector((state) => state.session.session);
  const cartItems = useSelector((state) => state.cart.cart);

  const itemCount = cartItems.length;

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  return (
    <nav className="nav-container">
      <ul className="nav-list">
        <li className="nav-item">
          <NavLink to="/" className="nav-link">Artsy</NavLink>
        </li>
        
        <div className="search-container">
          <form onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search function coming soon..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>

        {sessionUser && (
          <>
            <li className="nav-item">
              <NavLink to="/favorites" className="favorites-link">
                <FaHeart className="heart-icon" />
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/products/new" className="create-product-link">
                <FaPlus className="plus-icon" />
                <span>Create Product</span>
              </NavLink>
            </li>
          </>
        )}


        <li className="nav-cart">
            <Link to="/cart" className="cart-link">
              <FaShoppingCart size={23} />
            </Link>
          </li>

        <div className="nav-right">
          <li className="nav-item">
            <ProfileButton />
          </li>

        </div>
      </ul>
    </nav>
  );
}

export default Navigation;
