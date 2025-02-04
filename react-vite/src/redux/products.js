// import { csrfFetch } from "./csrf";

// actions
const GET_PRODUCTS = "products/GET_PRODUCTS";

// action creators
const getProductsAction = (products) => {
    return {
      type: GET_PRODUCTS,
      payload: products,
    };
};

// thunks
export const getProducts = () => async (dispatch) => {
    const response = await csrfFetch("/api/products");
    
    if (response.ok) {
        const data = await response.json();
        const normalizedProducts = data.Products.reduce((acc, product) => {
            acc[product.id] = product;
            return acc;
        }, {});
        dispatch(getProductsAction(normalizedProducts));
    }
};

// spots initial state
const initialState = {
    allProducts: {}
};


// spots reducer
const productsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PRODUCTS:
            return { ...state, allProducts: { ...action.payload } };
    default:
        return state;
    }
};


export default productsReducer;