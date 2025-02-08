import { csrfFetch } from "./csrf";

export const GET_ALL_REVIEWS = 'reviews/getAllReviews'
export const ADD_REVIEW = 'reviews/addReview'
export const DELETE_REVIEW = 'reviews/deleteReview'
export const EDIT_REVIEW = 'reviews/editReview'
export const LOAD_REVIEWABLE_PRODUCTS = 'reviews/getReviewableProducts'

export const loadReviews = allReviews => ({
    type: GET_ALL_REVIEWS,
    allReviews
})

export const loadReviewableProducts = (reviewableProducts) => ({
    type: LOAD_REVIEWABLE_PRODUCTS,
    reviewableProducts
})

export const getAllReviews = (productId) => async dispatch => {
    const response = await csrfFetch(`/api/reviews/${productId}`)

    if (response.ok) {
        const data = await response.json();
        dispatch(loadReviews(data.Reviews))
        return data
    }
}

export const fetchReviewableProducts = () => async dispatch => {
    const response = await csrfFetch('/api/reviews/products')

    if (response.ok) {
        const data = await response.json();
        dispatch(loadReviewableProducts(data))
        return data;
    }
}

const initialState = {
    reviewsByProduct: {},
    reviewableProduct: []
}

const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_REVIEWS:
            const reviewInfo = {};
            action.allReviews.forEach(review => {
                const {productId} = review
                if (!reviewInfo[productId]) {
                    reviewInfo[productId] = []
                }
                reviewInfo[productId].push(review)
            });
            return {
                ...state,
                reviewsByProduct: {
                    ...state.reviewsByProduct,
                    ...reviewInfo
                }
            }
        case LOAD_REVIEWABLE_PRODUCTS:
            return {
                ...state,
                reviewableProducts: action.reviewableProducts
            }
        default:
            return state;
    }
}

export default reviewReducer;
