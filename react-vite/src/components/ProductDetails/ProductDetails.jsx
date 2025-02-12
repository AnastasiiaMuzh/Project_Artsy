import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { getDetails } from '../../redux/products';
// import { getProducts } from '../../redux/products';
import './ProductDetails.css'
import { fetchReviewableProducts, getAllReviews, removeReview } from '../../redux/reviews';
import { useModal } from '../../context/Modal';
import { CreateReviewModal, DeleteReviewModal, UpdateReviewModal } from '../Reviews';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { addToFavorites, removeFromFavorites, fetchUserFavorites } from '../../redux/favorites';
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
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const currentUser = useSelector((state) => state.session.session)
  const product = useSelector((state) => state.products.productDetails);
  const reviews = useSelector((state) => state.reviews.reviewsByProduct[productId])
  const reviewableProducts = useSelector((state) => state.reviews.reviewableProducts)
  const favorites = useSelector((state) => state.favorites.items);
  // console.log('look here', reviews?.ReviewImages)
  // const sellerId = product.sellerId
  // product.sellerName.split(' ')[0] + ' ' + product.sellerName.split(' ')[1]?.charAt(0) + '.'
  // console.log("seller name: ", product.User.firstName)

  const isReviewable = reviewableProducts?.reviewlessProducts?.some(item => item.id === Number(productId))
  const handlePostReviewButton = async (e) => {
    e.preventDefault()
    if (isReviewable) setModalContent(<CreateReviewModal productId={productId} triggerRefresh={triggerRefresh}/>)
  }

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  useEffect(() => {
    setLoading(true);
    Promise.all([
      dispatch(getDetails(productId)),
      dispatch(getAllReviews(productId)),
      dispatch(fetchReviewableProducts()),
      currentUser ? dispatch(fetchUserFavorites()) : Promise.resolve()
    ]).finally(() => setLoading(false));
  }, [dispatch, productId, currentUser, refreshTrigger]);

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
    setTimeout(() => setShowPopup(false), 2000);
    return;
  }

  if (product.sellerId === currentUser.id) {
    setPopupMessage("You cannot add your own product to the cart.");
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
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
    setTimeout(() => setShowPopup(false), 2000);

  } catch (error) {
    console.error("Failed to add to cart:", error);
    setPopupMessage("Something went wrong. Please try again.");
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
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

  // Add favorite handler
  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const isFavorited = favorites.some(fav => fav.productId === Number(productId));

    if (isFavorited) {
        await dispatch(removeFromFavorites(productId));
        await dispatch(fetchUserFavorites());
    } else {
        await dispatch(addToFavorites(productId));
        await dispatch(fetchUserFavorites());
    }
  };

  if (loading) return <p>Loading product details...</p>

  if (!product || !product.ProductImages || product.ProductImages.length === 0) {
    return <div>Product not found or no images available</div>;
  }


  return (
    <div className='product-page'>
      {/* <h1>Product Page</h1> */}
      <div className='product-section'>

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
          {currentUser && (
            <button
              className="favorite-button"
              onClick={handleFavoriteClick}
            >
              {favorites.some(fav => fav.productId === Number(productId))
                ? <FaHeart className="heart-icon filled" />
                : <FaRegHeart className="heart-icon" />
              }
            </button>
          )}
        </div>
      </div>

      <div className='product-info-container'>
        <div className='product-name'>{product.name}</div>


        <div className='price-and-add-button'>
          <div className='product-price'>${product.price}</div>
          <div className='add-to-cart'>
            <button className='add-to-cart-button' onClick={handleAddToCart}>Add to cart</button>
          </div>

        </div>

        {/* <div className='product-category'>Found in {product.category.charAt(0).toUpperCase() + product.category.slice(1)}</div> */}

        {/* <div className='product-sellername'>Sold by {}</div> */}
        <div className='product-description'>{product.description}</div>
      </div>

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
              {review?.ReviewImages[0]?.url ?
                <img src={review?.ReviewImages[0]?.url} alt={review.review} className='product-img'/>
                : null
              }
              {/* <div>{review?.ReviewImages[0]?.url}</div> */}
              <div>{review.review}</div>
              <div>{review.User.firstName} {review.User.lastName}</div>
              <div>{createdAt}</div>
              {review.User?.id === currentUser?.id ? <button onClick={() => setModalContent(<UpdateReviewModal reviewId={review.id} productId={productId} currentReview={review.review} currentStars={review.stars}/>)}>Update</button> : null}
              {review.User?.id === currentUser?.id ? <button onClick={() => setModalContent(<DeleteReviewModal reviewId={review.id} productId={productId}/>)}>Delete</button> : null}
            </div>
          )
        })}
      </div>

    </div>
  )
}

export default ProductDetails
