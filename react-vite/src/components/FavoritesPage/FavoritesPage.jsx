import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserFavorites, removeFromFavorites } from '../../redux/favorites';
import './FavoritesPage.css';

// Create FavoritesPage function
function FavoritesPage() {
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.favorites.items);
  const [isLoading, setIsLoading] = useState(true);
  const error = useSelector(state => state.favorites.error);

  useEffect(() => {
    const loadFavorites = async () => {
      await dispatch(fetchUserFavorites());
      setIsLoading(false);
    };
    loadFavorites();
  }, [dispatch]);

  // Show loading state
  if (isLoading) {
    return <div>Loading favorites...</div>;
  }

  // Validate that all favorites have complete product data
  const hasCompleteData = favorites.every(favorite => 
    favorite.Product && favorite.Product.previewImage
  );

  if (!hasCompleteData) {
    // If data is incomplete, reload favorites
    dispatch(fetchUserFavorites());
    return <div>Loading complete favorite data...</div>;
  }

  if (!favorites.length) {
    return <div>No favorites yet!</div>;
  }

  // Handle remove from favorites
  const handleRemove = (productId) => {
    dispatch(removeFromFavorites(productId));
  };

  // Render error message
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="favorites-page">
      {/* Favorites Header */}
      <h1>My Favorites</h1>
      {favorites.length === 0 ? (
        <p>No favorites yet!</p>
      ) : (
        // Create grids for each of the favorited items
        <div className="favorites-grid">
          {favorites.map(favorite => (
            <div key={favorite.id} className="favorite-item">
              <Link to={`/products/${favorite.productId}`} className="favorite-link">
                <img 
                  src={favorite.Product.previewImage} 
                  alt={favorite.Product.name}
                  className="favorite-image"
                />
                <div className="favorite-details">
                  <h3>{favorite.Product.name}</h3>
                  <p>${favorite.Product.price}</p>
                </div>
              </Link>
              <button 
                onClick={() => handleRemove(favorite.productId)}
                className="remove-button"
              >
                Remove from Favorites
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage; 