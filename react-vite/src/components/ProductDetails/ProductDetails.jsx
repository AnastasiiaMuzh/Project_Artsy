import React from 'react'

function ProductDetails() {

  const { productId } = useParams();
  const dispatch = useDispatch();

  const product = useSelector((state) => state.products.productDetails);

  return (
    <div>
      <h1>Product Details</h1>
      
      <div className='img-container'>
        {/* small images to click through on left in column*/}
        {/* large preview image */}
      </div>

      <div className='product-info-container'>
        {/* price */}
        {/* name  */}
        {/* category? */}
        {/* sellername */}
        {/* add to cart button */}
        {/* item details: description */}
      </div>

    <div className='reviews-container'></div>

    </div>
  )
}

export default ProductDetails
