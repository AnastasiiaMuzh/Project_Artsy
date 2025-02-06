// Constants
const LOAD_FAVORITES = "favorites/LOAD_FAVORITES";
const ADD_FAVORITE = "favorites/ADD_FAVORITE";
const REMOVE_FAVORITE = "favorites/REMOVE_FAVORITE";

// Action Creators
const loadFavorites = (favorites) => ({
  type: LOAD_FAVORITES,
  favorites
});

const addFavorite = (favorite) => ({
  type: ADD_FAVORITE,
  favorite
});

const removeFavorite = (productId) => ({
  type: REMOVE_FAVORITE,
  productId
});

// Thunk Action Creators
// Fetch all favorites for current user
export const fetchUserFavorites = () => async (dispatch) => {
  const response = await csrfFetch('/api/favorites');
  
  if (response.ok) {
    const data = await response.json();
    dispatch(loadFavorites(data.Favorites));
    return data;
  }
};

export const addToFavorites = (productId) => async (dispatch) => {
  const response = await csrfFetch('/api/favorites', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ productId })
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(addFavorite(data));
    return data;
  }
};

// Remove a favorite from the user's favorites
export const removeFromFavorites = (productId) => async (dispatch) => {
  const response = await csrfFetch(`/api/favorites/${productId}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    dispatch(removeFavorite(productId));
    return response;
  }
};

// Initial State
const initialState = {
  items: []
};

// Reducer
const favoritesReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_FAVORITES:
      return {
        ...state,
        items: action.favorites
      };
    case ADD_FAVORITE:
      return {
        ...state,
        items: [...state.items, action.favorite]
      };
    case REMOVE_FAVORITE:
      return {
        ...state,
        items: state.items.filter(item => item.productId !== action.productId)
      };
    default:
      return state;
  }
};

export default favoritesReducer; 