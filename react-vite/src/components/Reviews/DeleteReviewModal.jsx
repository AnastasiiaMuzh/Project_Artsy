import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal"
import { fetchReviewableProducts, getAllReviews, getCurrUserReviews, removeReview } from "../../redux/reviews";
import { getDetails } from "../../redux/products";
import "../FavoritesPage/DeleteFavoriteModal.css"

const DeleteReviewModal = ({reviewId, productId}) => {
    const {closeModal} = useModal();
    const dispatch = useDispatch()

    const handleDeleteButton = async () => {
        await dispatch(removeReview(reviewId))
        await dispatch(getCurrUserReviews())
        await dispatch(fetchReviewableProducts())
        await dispatch(getAllReviews(productId))
        await dispatch(getDetails(productId))
        closeModal();
    }

    return (
        <div className="delete-favorite-modal">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this review?</p>
            <div className="delete-favorite-buttons">
                <button className='confirm-button' onClick={handleDeleteButton}>Yes (Delete Review)</button>
                <button className='cancel-button' onClick={closeModal}>No (Keep Review)</button>
            </div>
        </div>
    )
}

export default DeleteReviewModal;
