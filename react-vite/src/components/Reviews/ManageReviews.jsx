import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useModal } from "../../context/Modal";
import { getCurrUserReviews } from "../../redux/reviews";

const ManageReviews = () => {
    const dispatch = useDispatch();
    const { setModalContent } = useModal();
    const [loading, setLoading] = useState(true);

    const currentUser = useSelector(state => state.session.session)
    const reviews = useSelector(state => state.reviews.currentUserReviews?.Reviews)

    useEffect(() => {
        dispatch(getCurrUserReviews());
    }, [dispatch])

    return (
        <div>
            <h1>Manage Reviews</h1>
            {reviews?.map((review, index) => {
                const createdAt = new Date(review.createdAt).toLocaleDateString("en-US", {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                })

                return (
                    <div key={index}>
                        <div>{review.Products.name}</div>
                        <div>{createdAt}</div>
                        <div>{review.review}</div>
                        <button>Update</button>
                        <button>Delete</button>
                    </div>
                )
            })}
        </div>
    )
}

export default ManageReviews
