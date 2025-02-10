import { csrfFetch } from "./csrf";

const GET_ALL_REVIEWS = 'reviews/getAllReviews'
const ADD_REVIEW = 'reviews/addReview'
const DELETE_REVIEW = 'reviews/deleteReview'
const EDIT_REVIEW = 'reviews/editReview'
const LOAD_REVIEWABLE_PRODUCTS = 'reviews/getReviewableProducts'
const LOAD_USER_REVIEWS = 'reviews/getUserReviews'

// action creators
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

const addOneReview = (review) => ({
    type: ADD_REVIEW,
    review
})

const deleteReview = (reviewId) => ({
    type: DELETE_REVIEW,
    reviewId
})

const editReview = (review) => ({
    type: EDIT_REVIEW,
    review
})

//thunk
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

export const addReview = (newReview) => async dispatch => {
    const { productId, buyerId, review, stars} = newReview
    const response = await csrfFetch(`/api/reviews/products/${productId}`, {
        method: 'POST',
        body: JSON.stringify({review, stars})
    })

    if (response.ok) {
        const data = await response.json();
        dispatch(addOneReview(data))
        return data;
    }
}

export const removeReview = (reviewId) => async dispatch => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    })

    if (response.ok) {
        dispatch(deleteReview(reviewId));
        return reviewId;
    }
}

export const updateReview = (updatedReview) => async dispatch => {
    const response = await csrfFetch(`/api/reviews/${updatedReview.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
            'review': updatedReview.review,
            'stars': updatedReview.stars
        })
    })

    if (response.ok) {
        const data = await response.json();
        dispatch(editReview(data));
        return data
    }
}

const initialState = {
    reviewsByProduct: {},
    reviewableProducts: [],
    singleProduct: null
}

const calculateNewAverage = (currAverage, totalReviews, newStarRating) => {
    const newTotal = totalReviews + 1;
    const updatedStarRating = currAverage * totalReviews + newStarRating;
    return updatedStarRating / newTotal;
}

const updateSingleProductReview = (singleProduct, updatedReview) => {
    if (!singleProduct || singleProduct.id !== updatedReview.productId) return singleProduct;

    return {
        ...singleProduct,
        Reviews: singleProduct.Reviews.map(review => review.id === updatedReview.id ? updatedReview : review)
    }
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
        case ADD_REVIEW:
            // if (!state.singleProduct) return state;
            const {productId} = action.review
            const updatedProduct = state.singleProduct
            ? {
                ...state.singleProduct,
                numReviews: state.singleProduct.numReviews + 1,
                avgStarRating: calculateNewAverage(state.singleProduct.avgStarRating, state.singleProduct.numReviews, action.review.stars)
            }
            :null;
            return {
                ...state,
                reviewsByProduct: {
                    ...state.reviewsByProduct,
                    [action.review.productId]: [...(state.reviewsByProduct[productId] || []), action.review]
                },
                singleProduct: updatedProduct
            }
        case DELETE_REVIEW:
            if (!state.singleProduct) return state;
            const remainingReviews = state.singleProduct.Reviews.filter(
                (review) => review.id !== action.reviewId
            )

            const totalStars = remainingReviews.reduce((sum, review) => sum + review.stars, 0);
            const updatedAvgStarRating = remainingReviews.length > 0 ? totalStars / remainingReviews.length : null;

            const updatedSingleProduct = {
                ...state.singleProduct,
                Reviews: remainingReviews,
                numReviews: remainingReviews.length,
                avgStarRating: updatedAvgStarRating,
            }

            return {...state, singleProduct: updatedSingleProduct}
        case EDIT_REVIEW:
            const { id } = action.review
            return {
                ...state,
                reviewsByProduct: {
                    ...state.reviewsByProduct,
                    [action.review.productId]: state.reviewsByProduct[action.review.productId]?.map(review => review.id === id ? action.review : review) || []
                },
                singleProduct: updateSingleProductReview(state.singleProduct, action.review)
            }
        default:
            return state;
    }
}

export default reviewReducer;
