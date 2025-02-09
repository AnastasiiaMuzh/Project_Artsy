import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal"
import { getAllReviews, removeReview } from "../../redux/reviews";
import { getDetails } from "../../redux/products";

const DeleteReviewModal = ({reviewId, productId}) => {
    const {closeModal} = useModal();
    const dispatch = useDispatch()

    const handleDeleteButton = async () => {
        await dispatch(removeReview(reviewId))
        await dispatch(getAllReviews(productId))
        await dispatch(getDetails(productId))
        closeModal();
    }

    return (
        <div>
            <div>Confirm Delete</div>
            <p>Are you sure you want to delete this review?</p>
            <div>
                <button onClick={handleDeleteButton}>Yes (Delete Review)</button>
                <button onClick={closeModal}>No (Keep Review)</button>
            </div>
        </div>
    )
}

export default DeleteReviewModal;
