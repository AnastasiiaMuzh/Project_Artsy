import { useState } from "react";
import { useDispatch } from "react-redux"
import { useModal } from "../../context/Modal";
import { getDetails } from "../../redux/products";
import './CreateReviewModal.css'
import { addReview } from "../../redux/reviews";

const CreateReviewModal = ({productId, triggerRefresh}) => {
    const dispatch = useDispatch();
    const [textArea, setTextArea] = useState('');
    const [starRating, setStarRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [imageUrl, setImageUrl] = useState('')
    const [errors, setErrors] = useState({});
    const {closeModal} = useModal();

    const handleValidation = () => {
        const validationErrors = {};
        const urlRegex = /(png|jpg|jpeg)/i;

        if (review.length < 10) validationErrors.review = 'Review must be at least 10 characters long.'
        if (imageUrl.trim() && !urlRegex.test(imageUrl)) {
            validationErrors.imageUrl = 'Image URL must end in .png, .jpg, .jpeg'
        }
        return validationErrors;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = handleValidation();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const reviewData = {
            productId,
            review: textArea,
            stars: starRating,
            imageUrl: imageUrl.trim() ? imageUrl : null // ensures null is sent if empty
        };

        try {
            await dispatch(addReview(reviewData))
            triggerRefresh()
            closeModal();
        } catch (error) {
            console.error('Error submitting review:', error);
            if (error.json) {
                const data = await error.json()
                if (data?.errors) setErrors(data.errors)
            }
        }
    }

    const disableButton = () => textArea.length < 10 || !starRating;
    const handleStarClick = (rating) => setStarRating(rating)
    const handleStarHover = (rating) => setHoverRating(rating)
    const handleStarMouseOut = () => setHoverRating(0)

    return (
        <div>
            <div>Leave a Review!</div>
            <form onSubmit={handleSubmit}>
                {errors.textArea && <p>{errors.textArea}</p>}
                <textarea
                    value={textArea}
                    placeholder="Leave a review to help these sellers grow their business."
                    onChange={(e) => setTextArea(e.target.value)}
                />
                {errors.imageUrl && <p className="error-message">{errors.imageUrl}</p>}
                <input
                    type="text"
                    placeholder="Image URL (optional)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                />

                {imageUrl && !errors.imageUrl && (
                    <div className="image-preview">
                        <img src={imageUrl} alt="Review Preview" />
                    </div>
                )}
                <div>
                    {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`review-star ${
                                        (hoverRating || starRating) >= star ? 'highlighted' : ''
                                    }`}
                                    onClick={() =>  handleStarClick(star)}
                                    onMouseOver={() => handleStarHover(star)}
                                    onMouseOut={() => handleStarMouseOut}
                                >
                                    ★
                                </span>
                            ))}
                            {/* <span>Stars</span> */}
                </div>

                <button type='submit' disabled={disableButton()}>Submit Your Review</button>
            </form>
        </div>
    )
}

export default CreateReviewModal;
