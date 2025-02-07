import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import { useSelector } from 'react-redux';
import { FaShoppingCart } from 'react-icons/fa';

function Navigation() {
  const [searchQuery, setSearchQuery] = useState("");
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
            <input
              type="text"
              className="search-input"
              placeholder="Search function coming soon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

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
