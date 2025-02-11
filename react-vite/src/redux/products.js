import { csrfFetch } from "./csrf";

// actions
const GET_PRODUCTS = "products/GET_PRODUCTS";
const GET_PRODUCT_DETAILS = "products/GET_PRODUCT_DETAILS";
const CREATE_PRODUCT = "spots/CREATE_PRODUCT";
const UPDATE_PRODUCT = "spots/UPDATE_PRODUCT"
const DELETE_PRODUCT = "spots/DELETE_PRODUCT";

// action creators
const getProductsAction = (products) => {
    return {
      type: GET_PRODUCTS,
      payload: products,
    };
};

const getProductDetails = (product) => {
    return {
        type: GET_PRODUCT_DETAILS,
        payload: product,
    };
};

const createProductAction = (product) => {
    return {
        type: CREATE_PRODUCT,
        payload: product
    };
};

const updateProductAction = (updatedProduct) => {
    return {
        type: UPDATE_PRODUCT,
        payload: updatedProduct,
    };
};

const deleteProductAction = (productId) => {
    return {
        type: DELETE_PRODUCT,
        payload: productId,
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

export const createProduct = (newProductData, imageUrl) => async (dispatch) => {
    const response = await csrfFetch("/api/products/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json", 
        },
        body: JSON.stringify(newProductData),
    });

    console.log("response: ", response)

    if (response.ok) {
        const newProduct = await response.json();
        console.log("newPorduct before dispatch", newProduct)
        dispatch(createProductAction(newProduct));

        // Handle images associated with the product
        for (const [index, url] of imageUrl.entries()) {
            const imgDetails = {
                url,
                preview: index === 0, // Mark the first image as the preview
            };

            await csrfFetch(`/api/products/${newProduct.id}/productImages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(imgDetails),
            });
        }
        console.log("newPorduct after dispatch: ", newProduct)
        return newProduct; // Return the newly created product
    } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw errorData;
    }
};

export const updateProduct = (productId, updatedData, imageUrls = [], previewImageUrl = null) => async (dispatch) => {
    const response = await csrfFetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
    });

    if (response.ok) {
        const updatedProduct = await response.json();

        // If there are images to update
        if (imageUrls.length > 0) {
            const imageUpdateResponse = await csrfFetch(`/api/products/${productId}/images`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    imageUrls,          // List of new image URLs
                    previewImageUrl,    // URL of the preview image
                }),
            });

            if (imageUpdateResponse.ok) {
                const updatedImages = await imageUpdateResponse.json();
                console.log("Updated images: ", updatedImages);
            } else {
                const imageError = await imageUpdateResponse.json();
                console.error("Error updating images:", imageError);
                throw imageError;
            }

        dispatch(updateProductAction(updatedProduct));
        return updatedProduct;
    } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw errorData;
    }
    }
};

export const deleteProduct = (productId) => async (dispatch) => {
    const response = await csrfFetch(`/api/products/${productId}`, {
        method: "DELETE",
    });

    if (response.ok) {
        dispatch(deleteProductAction(productId));
    } else {
        const error = await response.json();
        console.error("Error:", error);
        throw error;
    }
};

// products initial state
const initialState = {
    allProducts: {},
    productDetails: {},
};


// products reducer
const productsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PRODUCTS:
            return { ...state, allProducts: { ...action.payload } 
        };

        case GET_PRODUCT_DETAILS: {
            const newAllProducts = { ...state.allProducts, [action.payload.id]: action.payload };
            return {
                ...state,
                productDetails: action.payload,
                allProducts: newAllProducts,
            };
        }

        case CREATE_PRODUCT: {
            const newAllProducts = { ...state.allProducts, [action.payload.id]: action.payload };
            return {
                ...state,
                allProducts: newAllProducts,
                productDetails: action.payload,
            };
        }
        
        case UPDATE_PRODUCT: {
            return {
                ...state,
                allProducts: {
                    ...state.allProducts,
                    [action.payload.id]: action.payload,
                },
            productDetails: action.payload
            };
        }

        case DELETE_PRODUCT: {
            const remainingProducts = { ...state.allProducts };
            delete remainingProducts[action.payload];
            return {
                ...state,
                allProducts: remainingProducts,
                productDetails: state.productDetails.id === action.payload ? {} : state.productDetails,
            };
        }

    default:
        return state;
    }
};


export default productsReducer;