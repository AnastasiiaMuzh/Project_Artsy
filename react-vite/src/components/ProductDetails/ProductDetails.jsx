import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { getDetails } from '../../redux/products';
// import { getProducts } from '../../redux/products';
import './ProductDetails.css'
// import { IoMdStar } from "react-icons/io";
// import { GoDotFill } from "react-icons/go";


function ProductDetails() {

  const { productId } = useParams();
  // console.log("Product ID from URL: ", productId);
  const dispatch = useDispatch();

 
  const [selectedImage, setSelectedImage] = useState(""); // To track the selected image

  const product = useSelector((state) => state.products.productDetails);

  useEffect(() => {
    dispatch(getDetails(productId));
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

  if (!product || !product.ProductImages || product.ProductImages.length === 0) {
    return <div>Product not found or no images available</div>;
  }

  return (
    <div>
      <h1>Product Page</h1>
      
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
        <div className='product-price'>{product.price}</div>
        {/* <div className='product-category'>{product.category}</div> */}
        <div className='product-sellername'>{product.sellerName}</div>
        <div className='add-to-cart'>
          <button className='add-to-cart-button' onClick={() => alert("Fix this so it adds to shopping cart")}>Add to cart</button>
        </div>
        <div className='product-description'>{product.description}</div>
      </div>

      <div className='reviews-container'>
        <h1>Reviews!</h1>
      </div>

    </div>
  )
}

export default ProductDetails
