import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useModal } from "../../context/Modal";
import { fetchReviewableProducts, getCurrUserReviews } from "../../redux/reviews";
import ReviewableProductModal from "./ReviewableProductModal";

const ManageReviews = () => {
    const dispatch = useDispatch();
    const { setModalContent } = useModal();
    const [loading, setLoading] = useState(true);

    const currentUser = useSelector(state => state.session.session)
    const reviews = useSelector(state => state.reviews.currentUserReviews?.Reviews)
    const reviewableProducts = useSelector((state) => state.reviews.reviewableProducts)

    useEffect(() => {
        setLoading(true);
        Promise.all([
            dispatch(getCurrUserReviews()),
            dispatch(fetchReviewableProducts())
        ]).finally(() => setLoading(false))
    }, [dispatch])

    const handleReviewableProductButton = async (e) => {
        e.preventDefault();
        setModalContent(<ReviewableProductModal/>)
    }

    if (loading) return <p>Loading reviews...</p>

    return (
        <div>
            <h1>Manage Reviews</h1>
            {reviewableProducts?.message ? <h2>You have left reviews on all your orders! </h2> : null }
            {!reviewableProducts?.message && reviewableProducts?.reviewlessProducts?.length > 0 && (
                <button onClick={handleReviewableProductButton}>Leave a review for recent purchases!</button>
            )}
            {reviews?.map((review, index) => {
                const createdAt = new Date(review.createdAt).toLocaleDateString("en-US", {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                })

                return (
                    <div key={index}>
                        <div>{review.Products.name}</div>
                        <div>{createdAt}</div>
                        <div>{review.review}</div>
                        <button>Update</button>
                        <button>Delete</button>
                    </div>
                )
            })}
        </div>
    )
}

export default ManageReviews
