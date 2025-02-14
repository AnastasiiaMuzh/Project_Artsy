import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal"
import { getAllReviews, updateReview } from "../../redux/reviews";
import { getDetails } from "../../redux/products";
import { useState } from "react";
import './UpdateReviewModal.css'

const UpdateReviewModal = ({reviewId, productId, currentReview, currentStars, currentImageUrl, triggerRefresh}) => {
    const {closeModal} = useModal();
    const dispatch = useDispatch();

    const [ review, setReview ] = useState(currentReview || "");
    const [ starRating, setStarRating ] = useState(currentStars || 0);
    const [ hoverRating, setHoverRating ] = useState(0)
    const [ imageUrl, setImageUrl ] = useState(currentImageUrl || "")
    const [errors, setErrors ] = useState({})

    const handleValidation = () => {
        const validationErrors = {};
        const urlRegex = /(png|jpg|jpeg)/i;

        if (review.length < 10) validationErrors.review = 'Review must be at least 10 characters long.'
        if (imageUrl.trim() && !urlRegex.test(imageUrl)) {
            validationErrors.imageUrl = 'Image URL must end in .png, .jpg, .jpeg'
        }
        return validationErrors;
    }

    const handleUpdateButton = async () => {
        const validationErrors = handleValidation();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        await dispatch(updateReview({id: reviewId, review, stars: starRating, imageUrl: imageUrl.trim() || null}))
        await dispatch(getAllReviews(productId))
        await dispatch(getDetails(productId))
        closeModal();
        triggerRefresh()
    }

    const disableButton = () => review.length < 10 || !starRating;
    const handleStarClick = (rating) => setStarRating(rating)
    const handleStarHover = (rating) => setHoverRating(rating)
    const handleStarMouseOut = () => setHoverRating(0)

    return (
        <div className="update-review-modal">
            <h2>Update Review</h2>
                <label>
                    <span className="your-review-rating">Your review rating</span>
                    <div>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`review-star ${
                                    (hoverRating || starRating) >= star ? 'highlighted' : ''
                                }`}
                                onClick={() =>  handleStarClick(star)}
                                onMouseOver={() => handleStarHover(star)}
                                onMouseOut={handleStarMouseOut}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </label>
            <label>
                Review:
                <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                />
            </label>
            {errors.imageUrl && <p className="error-message">{errors.imageUrl}</p>}
            <label>
                Review Image:
                <input type="text" placeholder="Image URL (Optional)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            </label>

            {/* Show Image Preview */}
            {imageUrl && !errors.imageUrl && (
                // <div className="image-preview">
                    <img src={imageUrl} alt="Review Preview" className="image-preview"/>
                // </div>
            )}

            <div>
                <button className='confirm-button' disabled={disableButton()} onClick={handleUpdateButton}>Submit Changes</button>
                <button className='cancel-button' onClick={closeModal}>Cancel</button>
            </div>
        </div>
    )
}

export default UpdateReviewModal;
