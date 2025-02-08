import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, removeFromCart, updateCartItem, addToCart } from "../../redux/shopping_carts";

const ShoppingCart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const itemCount = useSelector((state) => state.cart.itemCount);
  const sessionUser = useSelector((state) => state.session.session);
  console.log('Current session user:', sessionUser);  // Убедись, что пользователь залогинен
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log('Cart from Redux:', cart);
  console.log('Current session user:', sessionUser);

  // Загрузка корзины при монтировании компонента
  useEffect(() => {
    const loadCart = async () => {
        try {
            setLoading(true);
            await dispatch(fetchCart());
            setError(null);
        } catch (err) {
            setError("Failed to load cart");
            console.error("Error loading cart:", err);
        } finally {
            setLoading(false);
        }
    };

    loadCart();
}, [dispatch]);

// Обработчик уменьшения количества
const handleDecrease = async (itemId) => {
    try {
        await dispatch(updateCartItem(itemId, 1)); // уменьшаем на 1
        setError(null);
    } catch (err) {
        setError("Failed to update quantity");
        console.error("Error updating quantity:", err);
    }
};

// Обработчик увеличения количества
const handleIncrease = async (productId) => {
    try {
        await dispatch(addToCart(productId, 1)); // добавляем 1
        setError(null);
    } catch (err) {
        setError("Failed to add product");
        console.error("Error adding product:", err);
    }
};

// Обработчик удаления товара
const handleRemove = async (itemId) => {
    try {
        await dispatch(removeFromCart(itemId));
        setError(null);
    } catch (err) {
        setError("Failed to delete item");
        console.error("Error deleting product:", err);
    }
};

if (loading) {
    return <div>Loading Cart...</div>;
}

if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
}

if (!cart || cart.length === 0) {
    return (
        <div>
            <h2>Your Cart</h2>
            <p>Your cart is empty</p>
        </div>
    );
}

return (
    <div>
        <h2>Your Cart</h2>
        
        <div className="order-process">
            <p>Products {itemCount}</p>
            <p>Total: ${totalPrice?.toFixed(2)}</p>
        </div>

        <div className="items-cart">
            {cart.map((item) => (
                <div key={item.itemId || item.id}>
                    <div>
                        {/* Product image */}
                        {item.product?.imageUrl ? (
                            <img 
                                src={item.product.imageUrl} 
                                alt={item.product.name}
                                style={{ width: '150px', height: '100px', objectFit: 'cover' }}
                            />
                        ) : (
                            <div style={{ width: '150px', height: '100px', backgroundColor: '#f0f0f0' }}>
                                No photo
                            </div>
                        )}
                    </div>

                    <div>
                        <h3>{item.product.name}</h3>
                        <p> (${item.product.price} each)</p>
                    </div>

                    <div>
                        <button onClick={() => handleDecrease(item.itemId || item.id)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleIncrease(item.productId)}>+</button>
                    </div>

                    <div>
                        <p>${(item.product.price * item.quantity).toFixed(2)}</p>
                        <button onClick={() => handleRemove(item.itemId || item.id)}>
                            Edit
                        </button>
                    </div>

                    <div>
                        <p>${(item.product.price * item.quantity).toFixed(2)}</p>
                        <button onClick={() => handleRemove(item.itemId || item.id)}>
                            Remove
                        </button>
                    </div>
                </div>
            ))}
        </div>

        <button>
            Оформить заказ
        </button>
    </div>
);
};

export default ShoppingCart;