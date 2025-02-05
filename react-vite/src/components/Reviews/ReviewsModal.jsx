import { useState } from "react";
import { useDispatch } from "react-redux"
import { useModal } from "../../context/Modal";

const ReviewsModal = ({productId}) => {
    const dispatch = useDispatch();
    const [textArea, setTextArea] = useState('');
    const [starRating, setStarRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [errors, setErrors] = useState({});
    const {closeModal} = useModal();

    const handleValidation = () => {
        const validationErrors = {};
        if (textArea.length < 10) validationErrors.textArea = 'Review must be at least 10 characters long.'
        return validationErrors;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = handleValidation();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            // need postAReview redux store
            await dispatch(postAReview({productId, review: textArea, stars: starRating}));
            // need getProductDetails redux store
            await dispatch(getProductDetails(productId));
            closeModal();
        } catch (error) {
            console.error('Error submitting review:', error);
            if (error.json) {
                const data = await error.json()
                if (data?.errors) setErrors(data.errors)
            }
        }
    }

    const disableButton = textArea.length < 10 || starRating === 0;

    return (
        <div>
            <div>Review your purchases</div>
            <form onSubmit={handleSubmit}>
                {errors.textArea && <p>{errors.textArea}</p>}
                <textarea
                    value={textArea}
                    placeholder="Leave a review to help these sellers grow their business."
                    onChange={(e) => setTextArea(e.target.value)}
                />
                <div>
                    {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`star ${
                                        (hoverRating || starRating) >= star ? 'highlighted' : ''
                                    }`}
                                    onClick={() => setStarRating(star)}
                                    onMouseOver={() => setHoverRating(star)}
                                    onMouseOut={() => setHoverRating(0)}
                                >
                                    ★
                                </span>
                            ))}
                            <span>Stars</span>
                </div>
                <button type='submit' disabled={disableButton}>Submit Your Review</button>
            </form>
        </div>
    )
}

export default ReviewsModal;
