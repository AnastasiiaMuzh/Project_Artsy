import { useModal } from "../../context/Modal";
import "./DeleteFavoriteModal.css";

function DeleteFavoriteModal({ onConfirm, onCancel }) {
  const { closeModal } = useModal();

  const handleConfirm = () => {
    onConfirm();
    closeModal();
  };

  const handleCancel = () => {
    onCancel();
    closeModal();
  };

  return (
    <div className="delete-favorite-modal">
      <h2>Remove from Favorites?</h2>
      <p>Are you sure you want to remove this item from your favorites?</p>
      <div className="delete-favorite-buttons">
        <button className="cancel-button" onClick={handleCancel}>
          Cancel
        </button>
        <button className="confirm-button" onClick={handleConfirm}>
          Remove
        </button>
      </div>
    </div>
  );
}

export default DeleteFavoriteModal; 