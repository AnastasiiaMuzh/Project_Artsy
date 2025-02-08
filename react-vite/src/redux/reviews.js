import { csrfFetch } from "./csrf";

const GET_ALL_REVIEWS = 'reviews/getAllReviews'
const ADD_REVIEW = 'reviews/addReview'
const DELETE_REVIEW = 'reviews/deleteReview'
const EDIT_REVIEW = 'reviews/editReview'
const LOAD_REVIEWABLE_PRODUCTS = 'reviews/getReviewableProducts'
const LOAD_USER_REVIEWS = 'reviews/getUserReviews'

const loadReviews = allReviews => ({
    type: GET_ALL_REVIEWS,
    allReviews
})

const loadReviewableProducts = (reviewableProducts) => ({
    type: LOAD_REVIEWABLE_PRODUCTS,
    reviewableProducts
})

const loadUserReviews = userReviews => ({
    type: LOAD_USER_REVIEWS,
    userReviews
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

export const getCurrUserReviews = () => async dispatch => {
    const response = await csrfFetch('/api/reviews/current')

    if (response.ok) {
        const data = await response.json()
        dispatch(loadUserReviews(data))
        return data
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
        case LOAD_USER_REVIEWS:
            return {
                ...state,
                currentUserReviews: action.userReviews
            }

        default:
            return state;
    }
}

export default reviewReducer;
