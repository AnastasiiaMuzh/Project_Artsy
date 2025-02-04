import { csrfFetch } from "./csrf";

export const GET_ALL_REVIEWS = 'reviews/getAllReviews'
export const ADD_REVIEW = 'reviews/addReview'
export const DELETE_REVIEW = 'reviews/deleteReview'
export const EDIT_REVIEW = 'reviews/editReview'

export const loadReviews = allReviews => ({
    type: GET_ALL_REVIEWS,
    allReviews
})

export const getAllReviews = () => async dispatch => {
    const response = await csrfFetch(/api/reviews)

    if (response.ok) {
        const data = await response.json();
        dispatch(loadReviews(data.Reviews))
        return data
    }
}

// export const getAllReviews = (spotId) => async (dispatch) => {
//     const response = await csrfFetch(`/api/reviews/${spotId}`);

//     if (response.ok) {
//         const data = await response.json();
//         dispatch(loadReviews(data.Reviews));
//         return data;
//     }
// };

const initialState = {
    reviewsByProduct: {},
}

const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_REVIEWS:
            const reviewInfo = {};
            action.allReviews.forEach(review => {
                const {productId} = review
                if (!reviewInfo[productId]) {
                    reviewInfo = []
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
        default:
            return state;
    }
}

export default reviewReducer;
