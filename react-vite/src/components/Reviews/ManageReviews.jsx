import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useModal } from "../../context/Modal";
import { fetchReviewableProducts, getCurrUserReviews } from "../../redux/reviews";
import ReviewableProductModal from "./ReviewableProductModal";
import DeleteReviewModal from "./DeleteReviewModal";
import UpdateReviewModal from "./UpdateReviewModal";
import './ManageReview.css'
import { useNavigate } from "react-router-dom";

const ManageReviews = () => {
    const dispatch = useDispatch();
    const { setModalContent } = useModal();
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const navigate = useNavigate()

    // const currentUser = useSelector(state => state.session.session)
    const reviews = useSelector(state => state.reviews.currentUserReviews?.Reviews)
    console.log('look here', reviews)
    const reviewableProducts = useSelector((state) => state.reviews.reviewableProducts)

    const triggerRefresh = () => {
        setRefreshTrigger(prev => prev + 1)
    }

    useEffect(() => {
        setLoading(true);
        Promise.all([
            dispatch(getCurrUserReviews()),
            dispatch(fetchReviewableProducts())
        ]).finally(() => setLoading(false))
    }, [dispatch, refreshTrigger])

    const handleReviewableProductButton = async (e) => {
        e.preventDefault();
        setModalContent(<ReviewableProductModal/>)
    }



    if (loading) return <p>Loading reviews...</p>

    return (
        <div className="product-page">
            <div className="manage-reviews-header">
                <h1 className="manage-reviews-page">Manage Reviews</h1>
                {reviewableProducts?.message ? <h2>You have left reviews on all your orders! </h2> : null }
                {!reviewableProducts?.message && reviewableProducts?.reviewlessProducts?.length > 0 && (
                    <button className='leave-review-button' onClick={handleReviewableProductButton}>Leave a review for recent purchases!</button>
                )}
            </div>
            <div className="reviews-container">
                {reviews?.map((review, index) => {
                    const createdAt = new Date(review.createdAt).toLocaleDateString("en-US", {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                    })

                    return (
                        <div key={index} className="review">
                            <div onClick={() => navigate(`/products/${review.productId}`)} className="review-product-name">{review.Products.name}</div>
                            <div className="review-date">{createdAt}</div>
                            <div className="review-text">{review.review}</div>
                            {review?.ReviewImages[0]?.url ?
                                <img src={review?.ReviewImages[0]?.url} alt={review.review} className='manage-review-image'/>
                                : null
                            }
                            <div className="review-buttons">
                                <button className='update-button' onClick={() => setModalContent(<UpdateReviewModal reviewId={review.id} productId={review.productId} currentReview={review.review} currentStars={review.stars} triggerRefresh={triggerRefresh}/>)}>Update</button>
                                <button className='delete-button' onClick={() => setModalContent(<DeleteReviewModal reviewId={review.id} productId={review.productId}/>)}>Delete</button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ManageReviews
