import { csrfFetch } from "./csrf";

// ---------- ACTION TYPES ---------- 
const GET_CART      = 'cart/GET_CART';
const ADD_ITEM      = 'cart/ADD_ITEM';
const UPDATE_ITEM   = 'cart/UPDATE_ITEM';
const REMOVE_ITEM   = 'cart/REMOVE_ITEM';
const CHECKOUT_CART = 'cart/CHECKOUT_CART';


// ---------- ACTION CREATORS ---------- 
const getCartAction = (cartData) => ({
    type: GET_CART,
    cart: cartData,
  });
  
const addItemAction = (item) => ({
    type: ADD_ITEM,
    item,
  });
  
const updateItemAction = (item) => ({
    type: UPDATE_ITEM,
    item,
  });
  
const removeItemAction = (itemId) => ({
    type: REMOVE_ITEM,
    itemId,
  });
  
const checkoutCartAction = () => ({
    type: CHECKOUT_CART,
  });
  

// ---------- THANKS ---------- 
    // Get cart
    export const fetchCart = () => async (dispatch) => {
      const res = await csrfFetch('/api/cart/');
      if (res.ok) {
          const data = await res.json();
          dispatch(getCartAction(data));
      }
  };
  

    // Add to cart items
export const addToCart = (productId, quantity = 1) => async (dispatch) => {
    const res = await csrfFetch('/api/cart/item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    });
    if (res.ok) {
      const data = await res.json();
      dispatch(addItemAction(data));
    }
  };

    // Update quantity product
export const updateCartItem = (itemId, quantity) => async (dispatch) => {
    const res = await csrfFetch(`/api/cart/item/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    if (res.ok) {
      const data = await res.json();
      dispatch(updateItemAction({
        itemId: data.itemId,
        quantity: data.quantity  
      }));
      dispatch(fetchCart()); 
    }
  };


    // Remove items from the cart
export const removeFromCart = (itemId) => async (dispatch) => {
    const res = await csrfFetch(`/api/cart/items/${itemId}`, {
        method: 'DELETE',
    });
    if (res.ok) {
        dispatch(removeItemAction(itemId));
        dispatch(fetchCart());  
    }
};

    // Checkout order
export const checkout = (shippingAddress) => async (dispatch) => {
    const res = await csrfFetch('/api/cart/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shippingAddress }),
    });
    if (res.ok) {
        dispatch(checkoutCartAction())
    }
}

// ---------- REDUCER ---------- 
const initialState = { cart: [], totalPrice: 0, itemCount: 0 };

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CART:
      return {
        ...state,
        cart: action.cart.cart,
        totalPrice: action.cart.totalPrice,
        itemCount: action.cart.itemCount
      };

    case ADD_ITEM:
      return {
        ...state,
        cart: [action.item, ...state.cart],
        itemCount: state.itemCount + 1,
      };

    case REMOVE_ITEM:
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.itemId),
        itemCount: state.itemCount - 1,
      };

    case UPDATE_ITEM:
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.item.itemId ? { ...item, quantity: action.item.quantity } : item
        ),
      };

    case CHECKOUT_CART:
      return initialState;

    default:
      return state;
  }
};



export default cartReducer;