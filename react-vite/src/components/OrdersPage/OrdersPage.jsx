import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './OrdersPage.css';

function OrdersPage() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = useSelector(state => state.session.session);

  useEffect(() => {
    const loadOrders = async () => {
      // TODO: Add orders fetch logic here
      setIsLoading(false);
    };
    loadOrders();
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div className="orders-page">
      <h1>My Orders</h1>
      <div className="orders-container">
        {/* TODO: Add orders display logic here */}
        <p>Order history coming soon!</p>
      </div>
    </div>
  );
}

export default OrdersPage; 