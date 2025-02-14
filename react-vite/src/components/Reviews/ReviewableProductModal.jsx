import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviewableProducts } from "../../redux/reviews";
import { getProducts } from "../../redux/products";
import './ReviewableProductModal.css'


function ReviewableProductModal() {
    const dispatch = useDispatch();
    // const [loading, setLoading] = useState(true);
    // const [starRating, setStarRating] = useState(0);
    // const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [starRating, setStarRating] = useState({});
    const [hoverRating, setHoverRating] = useState({})

    const product = useSelector((state) => state.products.allProducts);
    const reviewableProducts = useSelector((state) => state.reviews.reviewableProducts)

    useEffect(() => {
        dispatch(fetchReviewableProducts())
        dispatch(getProducts())
    }, [dispatch])

    const handleStarClick = (rating, review = selectedProduct) => {
        setStarRating((prev) => ({...prev, [review.id]: rating}));
        if (review) {
            setSelectedProduct(review)
            setShowReviewModal(true)
        }
    }

    return (
        <div className="wrapper">

        <div className="reviewable-products">
            {!showReviewModal && (
                <>
                    <h2 className="review-your-purchases">Review your purchases</h2>
                    <div className="reviewable-products-description">Leave a review to help these sellers grow their business.</div>
                    {reviewableProducts?.reviewlessProducts.map((review, index) => {
                        const createdAt = new Date(review.createdAt).toLocaleDateString("en-US", {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        })

                        return (
                            <div key={index}>
                                <div className="reviewable-products-header">
                                    <img className='reviewable-products-image' src={product[review.id]?.previewImage} alt={product[review.id]?.name} />
                                    <div>
                                        <div className="reviewable-products-product-name">{review.productName}</div>
                                        <div className="review-date">Purchased on {createdAt}</div>
                                        <div>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                        <span
                                                            key={star}
                                                            className={`review-star ${
                                                                (hoverRating[review.id] !== undefined ? hoverRating[review.id] : starRating[review.id]) >= star ? 'highlighted' : ''
                                                            }`}
                                                            onClick={() =>  handleStarClick(star, review)}
                                                            onMouseOver={() => setHoverRating((prev) => ({...prev, [review.id]: star}))}
                                                            onMouseOut={() => setHoverRating((prev) => ({...prev, [review.id]: undefined}))}
                                                        >
                                                            ★
                                                        </span>
                                                    ))}
                                        </div>
                                    </div>

                                </div>
                            </div>

                        )
                    })}

                </>
            )}

            {showReviewModal && selectedProduct && (
                <div>
                    <h2 className="review-your-purchases">Write a Review</h2>
                    <div className="reviewable-products-product-name-2">{selectedProduct.productName}</div>
                    <div className="review-date-2">Purchased on {new Date(selectedProduct.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric',})}</div>
                    <img src={product[selectedProduct.id]?.previewImage} alt={product[selectedProduct.id]?.productName} className='reviewable-products-image-2' />
                    <div>
                            {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            className={`review-star ${
                                                (hoverRating[selectedProduct.id] !== undefined ? hoverRating[selectedProduct.id] : starRating[selectedProduct.id]) >= star ? 'highlighted' : ''
                                            }`}
                                            // onClick={() => setStarRating(star)}
                                            onClick={() => setStarRating((prev) => ({ ...prev, [selectedProduct.id]: star }))}
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
                    <button className='reviews-confirm-button' onClick={() => setShowReviewModal(false)}>Submit</button>
                    <button className='reviews-cancel-button' onClick={() => setShowReviewModal(false)}>Cancel</button>
                </div>
            )}
        </div>
        </div>
    )
}

export default ReviewableProductModal;
