import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateCartItem, removeFromCart } from '../../../redux/shopping_carts';
import { useModal } from '../../../context/Modal';
import './CartEditModal.css';

const CartEditModal = ({ item }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [quantity, setQuantity] = useState(item.quantity);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // Check for available images
  const images = item.product.images || [];  // Using images from API
  const currentImage = images[currentImgIndex];  // Since images are already an array of URLs

  // Switch to the next image
  const handleNextImage = () => {
    if (images.length > 0) {
      setCurrentImgIndex((prevIndex) => (prevIndex + 1) % images.length);
    }
  };

  // Switch to the previous image
  const handlePrevImage = () => {
    if (images.length > 0) {
      setCurrentImgIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    }
  };

  // Change the quantity of the product
  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value));
  };

  // Save changes and update the cart
  const handleSave = async () => {
    await dispatch(updateCartItem(item.id, quantity));
    closeModal(); // Close the modal after saving
  };

  // Remove the product from the cart
  const handleDelete = async () => {
    await dispatch(removeFromCart(item.id));
    closeModal(); // Close the modal after deletion
  };

  return (
    <div className="cart-edit-modal">
      <h2>Edit item </h2>
      {/* <span className="product-price-modal">${item.product.price.toFixed(2)} each</span> */}
      <button className="close-modal-x" onClick={closeModal}>
        &times;
      </button>
      <div className="modal-content">
        <div className="image-carousel">
          {images.length > 0 ? (
            <>
              <button onClick={handlePrevImage}>&lt;</button>
              <img src={currentImage} alt={item.product.name} className="product-image-modal" />
              <button onClick={handleNextImage}>&gt;</button>
            </>
          ) : (
            <p>No images available</p>
          )}
        </div>

        <div className="product-details-modal">
          <h3>
            <span className="product-name-modal">{item.product.name}</span>
            {/* <span className="product-price-modal">${item.product.price.toFixed(2)} each</span> */}
          </h3>
          <p>{item.product.description || 'No description available.'}</p>
        </div>

        {/* <div className='price-modal'><p>${item.product.price.toFixed(2)} each</p></div> */}

        <div className="button-price-group">
        {/* <p>${item.product.price.toFixed(2)} each</p> */}
          <select
            value={quantity}
            onChange={handleQuantityChange}
          >
            {[...Array(200).keys()].map((num) => (
              <option key={num + 1} value={num + 1}>
                {num + 1}
              </option>
            ))}
          </select>
          <button onClick={handleSave} className="save-button-modal">
            Save
          </button>
          <button onClick={handleDelete} className="delete-button-modal">
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartEditModal;