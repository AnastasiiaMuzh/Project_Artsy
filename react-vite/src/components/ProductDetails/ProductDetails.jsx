import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { getDetails } from '../../redux/products';
// import { getProducts } from '../../redux/products';
import './ProductDetails.css'
import { fetchReviewableProducts, getAllReviews } from '../../redux/reviews';
import { useModal } from '../../context/Modal';
import ReviewsModal from '../Reviews/ReviewsModal'
// import { IoMdStar } from "react-icons/io";
// import { GoDotFill } from "react-icons/go";
import { addToCart } from "../../redux/shopping_carts";


function ProductDetails() {
  const { productId } = useParams();
  const { setModalContent } = useModal()
  // console.log("Product ID from URL: ", productId);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(""); // To track the selected image
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");  // Добавляем состояние для текста уведомлений


  const currentUser = useSelector((state) => state.session.session)
  const product = useSelector((state) => state.products.productDetails);
  const reviews = useSelector((state) => state.reviews.reviewsByProduct[productId])
  const reviewableProducts = useSelector((state) => state.reviews.reviewableProducts)

  const isReviewable = reviewableProducts?.reviewlessProducts?.some(item => item.id === Number(productId))
  const handlePostReviewButton = async (e) => {
    e.preventDefault()
    if (isReviewable) setModalContent(<ReviewsModal productId={productId}/>)
  }

  useEffect(() => {
    setLoading(true);
    Promise.all([
      dispatch(getDetails(productId)),
      dispatch(getAllReviews(productId)),
      dispatch(fetchReviewableProducts())
    ]).finally(() => setLoading(false));
  }, [dispatch, productId])

  // console.log("product: ", product)
  // console.log("product.ProductImages[1].url", product.ProductImages[0].url)

  useEffect(() => {
    if (product.ProductImages && product.ProductImages.length > 0) {
      setSelectedImage(product.ProductImages[0].url); // Set the first image as the selected one
    }
  }, [product]);

  const otherImgs =
    product.ProductImages && product.ProductImages.length > 1
      ? product.ProductImages.slice(1).map((img) => img.url)
      : [];

   // Function to handle thumbnail click
  const handleThumbnailClick = (imgUrl) => {
    setSelectedImage(imgUrl);
  };

  // Основная функция для добавления товара в корзину
  // Функция добавления в корзину
const handleAddToCart = async () => {
  if (!currentUser) {
    setPopupMessage("Please log in to add items to your cart.");
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
    return;
  }

  if (product.sellerId === currentUser.id) {
    setPopupMessage("You cannot add your own product to the cart.");
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
    return;
  }

  try {
    const response = await dispatch(addToCart(product.id));
    
    if (response?.error && response.error === "Product already in cart") {
      setPopupMessage("This product is already in your cart.");
    } else {
      setPopupMessage("Product successfully added to cart!");
    }
    
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);

  } catch (error) {
    console.error("Failed to add to cart:", error);
    setPopupMessage("Something went wrong. Please try again.");
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  }
};


  const reviewCount = (avgStarRating, numReviews) => {
    if (avgStarRating && numReviews == 1) {
        return `${numReviews} review  ${avgStarRating}`
    } else if (avgStarRating && numReviews > 1) {
        return `${numReviews} reviews  ${avgStarRating}`
    } else {
        return <p className="new">No reviews yet!</p>
    }
  }

  const getStarRating = (avgRating) => {
    const maxStars = 5;
    const filledStars = Math.round(avgRating);
    const emptyStars = maxStars - filledStars;

    return '★'.repeat(filledStars) + '☆'.repeat(emptyStars);
  }

  if (loading) return <p>Loading product details...</p>

  if (!product || !product.ProductImages || product.ProductImages.length === 0) {
    return <div>Product not found or no images available</div>;
  }


  return (
    <div>
      <h1>Product Page</h1>

      {showPopup && (
        <div className="popup-notification">
          {popupMessage}
        </div>
      )}

      <div className="product-images-container">
        {/* Thumbnails Column */}
        <div className="thumbnails-container">
          {/* Main image as a thumbnail */}
          <div className="thumbnail" onClick={() => handleThumbnailClick(product.ProductImages[0].url)}>
            <img
              src={product.ProductImages[0].url}
              alt={product.name}
              className="thumbnail-img"
            />
          </div>

          {/* Other thumbnails */}
          {otherImgs.map((imgUrl, index) => (
            <div key={index} className="thumbnail" onClick={() => handleThumbnailClick(imgUrl)}>
              <img
                src={imgUrl}
                alt={`${product.name} additional img`}
                className="thumbnail-img"
              />
            </div>
          ))}
        </div>

      {/* Main Image */}
      <div className="main-image-container">
          <img src={selectedImage} alt={product.name} className="main-image" />
        </div>
      </div>

      <div className='product-info-container'>
        <div className='product-name'>{product.name}</div>
        <div className='product-price'>${product.price}</div>
        {/* <div className='product-category'>{product.category}</div> */}
        <div className='product-sellername'>{product.sellerName}</div>
        <div className='add-to-cart'>
          <button className='add-to-cart-button' onClick={handleAddToCart}>Add to cart</button>
        </div>
        <div className='product-description'>{product.description}</div>
      </div>

      <div className='reviews-container'>
        <h1>{reviewCount(getStarRating(product.avgStarRating), product.numReviews)}</h1>

        {isReviewable && (
          <button onClick={handlePostReviewButton}>Post Your Review!</button>
        )}
        {reviews?.map((review, index) => {
          const createdAt = new Date(review.createdAt).toLocaleDateString("en-US", {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })

          return (
            <div key={index} >
              <div>{getStarRating(review.stars)}</div>
              <div>{review.review}</div>
              <div>{review.User.firstName} {review.User.lastName}</div>
              <div>{createdAt}</div>
              {review.User?.id === currentUser?.id ? <button>Delete</button> : null}
            </div>
          )
        })}
      </div>

    </div>
  )
}

export default ProductDetails
