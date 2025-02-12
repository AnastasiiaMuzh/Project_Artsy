import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IoMdStar } from "react-icons/io";
import { FaHeart, FaRegHeart } from 'react-icons/fa';  // Import both filled and outline hearts
// import { Tooltip } from 'react-tooltip'
import { getProducts } from '../../redux/products'
import { addToFavorites, removeFromFavorites, fetchUserFavorites } from '../../redux/favorites'
import "./HomePage.css";

const HomePage = () => {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.products.allProducts);
    const favorites = useSelector((state) => state.favorites.items);
    const sessionUser = useSelector((state) => state.session.session);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("all"); // Track the selected category

    useEffect(() => {
        const loadInitialData = async () => {
            await dispatch(getProducts());
            if (sessionUser) {
                await dispatch(fetchUserFavorites());
            }
            setLoading(false);
        };
        
        loadInitialData();
    }, [dispatch, sessionUser]);

  // Handle category click and filter products
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

    // Filter products based on selected category
    const filteredProducts = selectedCategory === "all" 
    ? Object.values(products)  // Convert products object to an array
    : Object.values(products).filter(product => product.category.toLowerCase() === selectedCategory.toLowerCase());

    // Get a list of unique categories
    const uniqueCategories = [
      'all', // Include the "all" category
      ...new Set(Object.values(products).map(product => product.category.toLowerCase())) // Get unique categories
    ];

    const handleFavoriteClick = async (e, productId) => {
        e.preventDefault(); // Prevent navigation to product details
        if (!sessionUser) return; // if user is not logged in, return

        const isFavorited = favorites.some(fav => fav.productId === productId);
        
        if (isFavorited) {
            await dispatch(removeFromFavorites(productId));
        } else {
            await dispatch(addToFavorites(productId));
        }
    };

  if (loading) {
      return <div>Loading products...</div>;
  }

  if (!filteredProducts || filteredProducts.length === 0) {
    return <div>No products available in this category</div>;
  }


  if (!products || products.length === 0) {
    return <div>No products available</div>;
  }

//   console.log("products: ", products)
//   console.log("products[1]: ", products[1])

  return (
    <div className='home-page'>
      {/* <h1>Products!</h1>
      <h2>Insert Ana&apos;s idea for a banner here?</h2> */}
      <div className='banner-category'>
            <div className='home-banner'>
                <h3>Gift ideas for Valentine&apos;s Day!</h3>
                <button>Shop now</button>
            </div>
            <div className='categories'>
                <p>Search Products by Category:</p>
                <ul>
                    {/* Loop through the unique categories */}
                    {uniqueCategories.map((category) => (
                        <li key={category}>
                            <Link
                                to="#"
                                className={`category-link ${selectedCategory === category ? "selected" : ""}`}
                                onClick={() => handleCategoryClick(category)} 
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)} {/* Capitalize first letter */}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

      <div className="products-container">
        {Object.values(filteredProducts).map((product) => (
          <Link to={`/products/${product.id}`} key={product.id} className="product-tile-link">
            <div className="product-tile">
              <div className="product-img-container">
                <img src={product.previewImage} alt={product.name} className="product-img" />
                {sessionUser && (
                                    <button
                                        className="favorite-button"
                                        onClick={(e) => handleFavoriteClick(e, product.id)}
                                    >
                                        {favorites.some(fav => fav.productId === product.id) 
                                            ? <FaHeart className="heart-icon filled" />
                                            : <FaRegHeart className="heart-icon" />
                                        }
                                    </button>
                                )}
              </div>
              <div className="product-info">
                    <div className='product-tile-name'>{product.name}</div>
                    <div className='price-and-rating'>
                        <div className='product-tile-price'>${product.price}</div>
                        <div className='product-tile-rating'>
                          <div className="product-star">
                            {product.avgRating && product.avgRating > 0 
                              ? <IoMdStar /> 
                              : ""
                            }
                          </div>
                          <div className="product-rating">
                            {product.avgRating && product.avgRating > 0 
                              ? product.avgRating 
                              : "New!"}
                          </div>
                        </div>
                    </div>
              </div>
            </div>

            {/* <Tooltip id={`tooltip-${product.id}`} place="top" effect="solid" className="tooltip-name">
              {product.name}
            </Tooltip>  */}

          </Link>
        ))} 
       </div>

    </div>
  );
};

export default HomePage;