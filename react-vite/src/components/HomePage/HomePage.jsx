import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
// import { Tooltip } from 'react-tooltip'
import { getProducts } from '../../redux/products'
import "./HomePage.css";

const HomePage = () => {
    const dispatch = useDispatch();

  // Get products from Redux store
  const products = useSelector((state) => state.products.allProducts);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getProducts())
    .then(() => setLoading(false));
  }, [dispatch]);

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (!products || products.length === 0) {
    return <div>No products available</div>;
  }

//   console.log("products: ", products)
//   console.log("products[1]: ", products[1])

  return (
    <div>
      <h1>Products! Insert Ana&apos;s idea for a banner here?</h1>

      <div className="product-container">
        {Object.values(products).map((product) => (
          <Link to={`/products/${product.id}`} key={product.id} className="product-tile-link">
            <div className="product-tile">
              <div className="product-img-container">
                <img src={product.previewImage} alt={product.name} className="product-img" />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.avgRating}</p>
                <p>${product.price}</p>
              </div>
            </div>

            {/* <Tooltip id={`tooltip-${product.id}`} place="top" effect="solid" className="tooltip-name">
              {product.name}
            </Tooltip> */}

          </Link>
        ))} 
       </div>

    </div>
  );
};

export default HomePage;