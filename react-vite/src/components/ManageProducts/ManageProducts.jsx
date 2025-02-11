import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { IoMdStar } from "react-icons/io";
import { getProducts } from '../../redux/products';
import OpenModalButton from '../OpenModalButton';
import DeleteProductModal from '../DeleteProductModal';
import './ManageProducts.css'

function ManageProducts() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get the products from the Redux store
  const products = useSelector((state) => state.products.allProducts);
  console.log("products", products)
  // Get the signed-in user info (assuming user data is in the Redux store)
  const user = useSelector((state) => state.session.session);
  console.log("user: ", user)
  console.log("user.id: ", user.id)

  const [loading, setLoading] = useState(true);

  // Fetch products on component mount
  useEffect(() => {
    dispatch(getProducts())
      .then(() => setLoading(false));
  }, [dispatch]);

  // Check if the user is logged in
  if (!user) {
    return <div>You need to be logged in to manage your products.</div>;
  }

  // Filter products owned by the signed-in user
  const userProducts = Object.values(products).filter((product) => product.sellerId === user.id);

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (!userProducts || userProducts.length === 0) {
    return <div>You have no products to manage.</div>;
  }

  return (
    <div className='manage-products-page'>
      <h1 className='manage-products-header'>Manage your products</h1>
      {/* <div className='link-create'>
          <Link to="/create-product" className="create-product-link">
            Create a New Product
          </Link>
        </div> */}

        <div className="products-container">
        {userProducts.map((product) => (
          <div key={product.id} className="product-tile-container">
            <Link to={`/products/${product.id}`} className="product-tile-link">
              <div className="product-tile">
                <div className="product-img-container">
                  <img src={product.previewImage} alt={product.name} className="product-img" />
                </div>
                <div className="product-info">
                  <div className='product-tile-name'>{product.name}</div>
                  <div className='price-and-rating'>
                    <div className='product-tile-price'>${product.price}</div>
                    <div className='product-tile-rating'>
                      <div className='star'><IoMdStar /> </div>
                      <div className='rating'>{product.avgRating || 'New'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <div className="product-actions">
              {/* Update button that redirects to the edit page */}
              <button
                className="button-link"
                onClick={() => navigate(`/products/${product.id}/edit`)}
              >
                Update
              </button>

              {/* Delete button that opens a modal */}
              <OpenModalButton
                className="delete-modal"
                buttonText="Delete"
                modalComponent={<DeleteProductModal product={product} />}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ManageProducts
