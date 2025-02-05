// import { csrfFetch } from "./csrf";

// actions
const GET_PRODUCTS = "products/GET_PRODUCTS";
const GET_PRODUCTS_DETAILS = "spots/GET_Products_DETAILS";

// action creators
const getProductsAction = (products) => {
    return {
      type: GET_PRODUCTS,
      payload: products,
    };
};

const getProductDetails = (product) => {
    return {
        type: GET_PRODUCTS_DETAILS,
        payload: product
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

export const getDetails = (productId) => async (dispatch) => {
    const response = await csrfFetch(`/api/products/${productId}`);
    const data = await response.json();
    // console.log("API: ", data)
    return dispatch(getProductDetails(data));
}

// spots initial state
const initialState = {
    allProducts: {},
    productDetails: {},
};


// spots reducer
const productsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PRODUCTS:
            return { ...state, allProducts: { ...action.payload } };
        case GET_PRODUCTS_DETAILS: {
            const newAllProducts = { ...state.allProducts, [action.payload.id]: action.payload };
            return {
                ...state,
                ProductDetails: action.payload,
                allProduct: newAllProducts,
                };
            }
    default:
        return state;
    }
};


export default productsReducer;