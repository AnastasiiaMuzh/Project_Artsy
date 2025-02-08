import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviewableProducts } from "../../redux/reviews";
import { getProducts } from "../../redux/products";
import './ReviewableProductModal.css'


function ReviewableProductModal() {
    const dispatch = useDispatch();
    // const [loading, setLoading] = useState(true);
    const [starRating, setStarRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewText, setReviewText] = useState('');

    const product = useSelector((state) => state.products.allProducts);
    const reviewableProducts = useSelector((state) => state.reviews.reviewableProducts)
    console.log('look here', product)

    useEffect(() => {
        dispatch(fetchReviewableProducts())
        dispatch(getProducts())
    }, [dispatch])

    const handleStarClick = (rating, review = selectedProduct) => {
        setStarRating(rating);
        if (review) {
            setSelectedProduct(review)
            setShowReviewModal(true)
        }
    }
    // const handleStarClick = (rating) => setStarRating(rating)
    // const handleStarHover = (rating) => setHoverRating(rating)
    // const handleStarMouseOut = () => setHoverRating(0)

    return (
        <div>
            {!showReviewModal && (
                <>
                    <h1>Review your purchases</h1>
                    <div>Leave a review to help these sellers grow their business.</div>
                    {reviewableProducts?.reviewlessProducts.map((review, index) => {
                        const createdAt = new Date(review.createdAt).toLocaleDateString("en-US", {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        })

                        return (
                            <div key={index}>
                                <div>{review.productName}</div>
                                <div>Purchased on {createdAt}</div>
                                <img src={product[review.id]?.previewImage} alt={product[review.id]?.name} className="product-img" />
                                <div>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                                <span
                                                    key={star}
                                                    className={`star ${
                                                        (hoverRating || starRating) >= star ? 'highlighted' : ''
                                                    }`}
                                                    onClick={() =>  handleStarClick(star, review)}
                                                    onMouseOver={() => setHoverRating(star)}
                                                    onMouseOut={() => setHoverRating(0)}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                </div>
                            </div>

                        )
                    })}

                </>
            )}

            {showReviewModal && selectedProduct && (
                <div>
                    <h2>Write a Review</h2>
                    <div>{selectedProduct.productName}</div>
                    <div>Purchased on {new Date(selectedProduct.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric',})}</div>
                    <img src={product[selectedProduct.id]?.previewImage} alt={product[selectedProduct.id]?.productName} className="product-img" />
                    <div>
                            {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            className={`star ${
                                                (hoverRating || starRating) >= star ? 'highlighted' : ''
                                            }`}
                                            onClick={() => setStarRating(star)}
                                        >
                                            ★
                                        </span>
                                    ))}
                    </div>
                    <textarea
                        placeholder="Write your review here"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                    />
                    <button onClick={() => setShowReviewModal(false)}>Cancel</button>
                    <button
                        onClick={() => {
                            console.log("Submit Review", { starRating, reviewText });
                            setShowReviewModal(false); // Closes modal after submission
                        }}
                    >
                        Submit
                    </button>
                </div>
            )}
        </div>
    )
}

export default ReviewableProductModal;
