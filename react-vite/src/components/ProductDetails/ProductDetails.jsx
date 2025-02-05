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
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  const product = useSelector((state) => state.products.productDetails);

  useEffect(() => {
    dispatch(getDetails(productId))
    .then(() => setLoading(false));
  }, [dispatch, productId])

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (!product || Object.keys(product).length === 0) {
    return <div>Product not found</div>;
  }

  console.log("product: ", product)


  return (
    <div>
      <h1>Product Page</h1>
      
      <div className='img-container'>
        <img src={product.previewImage} alt={product.name} />
      </div>

      <div className='product-info-container'>
        <div className='product-name'>{product.name}</div>
        <div className='product-price'>{product.price}</div>
        <div className='product-category'>{product.category}</div>
        <div className='product-sellername'>{product.sellerName}</div>
        <div className='add-to-cart'>
          <button className='add-to-cart-button' onClick={() => alert("Fix this so it adds to shopping cart")}>Add to cart</button>
        </div>
        <div className='product-description'>{product.description}</div>
      </div>

      <div className='reviews-container'></div>

    </div>
  )
}

export default ProductDetails
