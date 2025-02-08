
import "./DeleteProductModal.css"
import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import { deleteProduct } from '../../redux/products';

function DeleteProductModal({ product }) {

  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    await dispatch(deleteProduct(product.id)); // Deletes the spot
    closeModal(); // Close the modal after deletion
  };

  const handleCancel = async () => {
    closeModal();
  }

  return (
    <div className='modal-container'>
      <h1 className="delete-product-header">Confirm Delete</h1>
      
      <div className='h4-container'>
        <h4>Are you sure you want to remove this product from your store?</h4>
      </div>

      
      <div className="action-buttons">
        <button onClick={handleDelete} className='yes'>Yes (Delete Product)</button>
        <button onClick={handleCancel} className='no'>No (Keep Product)</button>
      </div>
    </div>
  )
}

export default DeleteProductModal;
