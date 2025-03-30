import { useEffect, useState } from "react";
import { useDispatch } from "react-redux"
import { useModal } from "../../context/Modal";
import { getDetails } from "../../redux/products";
import './CreateReviewModal.css'
import { addReview, getAllReviews } from "../../redux/reviews";

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

        if (starRating === 0) validationErrors.starRating = 'Please select a star rating';
        if (textArea.length < 10) validationErrors.textArea = 'Review must be at least 10 characters long.'
        if (imageUrl.trim() && !urlRegex.test(imageUrl)) {
            validationErrors.imageUrl = 'Image URL must end in .png, .jpg, .jpeg'
        }
        return validationErrors;
    }

    useEffect(() => {
        setErrors(handleValidation());
    }, [starRating, textArea, imageUrl])

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
            await dispatch(getAllReviews(productId))
            await dispatch(getDetails(productId))
            closeModal();
            triggerRefresh()
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
        <div className="create-review-modal">
            <form onSubmit={handleSubmit}>
            <h2>Leave a Review!</h2>

            {errors.starRating && <p className="error-message">{errors.starRating}</p>}
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
                {errors.textArea && <p className="error-message">{errors.textArea}</p>}
            <label>
                Review:
                <textarea
                    value={textArea}
                    placeholder="Leave a review to help these sellers grow their business."
                    onChange={(e) => setTextArea(e.target.value)}
                    />
            </label>

                {errors.imageUrl && <p className="error-message">{errors.imageUrl}</p>}
            <label>
                Review Image:
                <input
                    type="text"
                    placeholder="Image URL (Optional)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    />
            </label>
                {imageUrl && !errors.imageUrl && (
                    <img src={imageUrl} alt="Review Preview" className="review-image-preview"/>
                )}

            <div>
                <button className='confirm-button' type='submit' disabled={disableButton()}>Submit Your Review</button>
            </div>
            </form>
        </div>
    )
}

export default CreateReviewModal;
