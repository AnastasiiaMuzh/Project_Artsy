import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { getAllReviews } from "../../redux/reviews";

const ManageReviews = () => {
    const dispatch = useDispatch();

    const currUserId = useSelector(state => state.session.user?.id)
    const reviewObj = useSelector(state => state.reviewsByProduct)

    useEffect(() => {
        dispatch(getAllReviews());
    }, [dispatch])

    return (
        <div>

        </div>
    )
}

export default ManageReviews
