import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal"
import { getAllReviews, updateReview } from "../../redux/reviews";
import { getDetails } from "../../redux/products";
import { useState } from "react";

const UpdateReviewModal = ({reviewId, productId, currentReview, currentStars}) => {
    const {closeModal} = useModal();
    const dispatch = useDispatch();

    const [ review, setReview ] = useState(currentReview || "");
    const [ starRating, setStarRating ] = useState(currentStars || 0);
    const [ hoverRating, setHoverRating ] = useState(0)

    const handleUpdateButton = async () => {
        await dispatch(updateReview({id: reviewId, review, stars: starRating}))
        await dispatch(getAllReviews(productId))
        await dispatch(getDetails(productId))
        closeModal();
    }

    const disableButton = () => review.length < 10 || !starRating;
    const handleStarClick = (rating) => setStarRating(rating)
    const handleStarHover = (rating) => setHoverRating(rating)
    const handleStarMouseOut = () => setHoverRating(0)

    return (
        <div>
            <div>Update Review</div>
            <label>
                Review:
                <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                />
            </label>
            <label>
                Star Rating:
                <div>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={`star ${
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
            <div>
                <button disabled={disableButton()} onClick={handleUpdateButton}>Submit Changes</button>
                <button onClick={closeModal}>Cancel</button>
            </div>
        </div>
    )
}

export default UpdateReviewModal;
