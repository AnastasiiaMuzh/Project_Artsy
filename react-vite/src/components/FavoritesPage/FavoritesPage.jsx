import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserFavorites, removeFromFavorites } from '../../redux/favorites';
import './FavoritesPage.css';

function FavoritesPage() {
  console.log("FavoritesPage component rendered");
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.favorites.items);
  const isLoading = useSelector(state => state.favorites.isLoading);
  const error = useSelector(state => state.favorites.error);

  useEffect(() => {
    dispatch(fetchUserFavorites());
  }, [dispatch]);

  const handleRemove = (productId) => {
    dispatch(removeFromFavorites(productId));
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="favorites-page">
      <h1>My Favorites</h1>
      {favorites.length === 0 ? (
        <p>No favorites yet!</p>
      ) : (
        <div className="favorites-grid">
          {favorites.map(favorite => (
            <div key={favorite.id} className="favorite-item">
              <img 
                src={favorite.Product.previewImage} 
                alt={favorite.Product.name}
                className="favorite-image"
              />
              <div className="favorite-details">
                <h3>{favorite.Product.name}</h3>
                <p>${favorite.Product.price}</p>
                <button 
                  onClick={() => handleRemove(favorite.productId)}
                  className="remove-button"
                >
                  Remove from Favorites
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage; 