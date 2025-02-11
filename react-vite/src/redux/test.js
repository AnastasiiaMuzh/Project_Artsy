return (
    <div className="shopping-cart-container">
      <div className="shopping-cart-header">
        <h1>Your Cart</h1>
        <h3>Artsy Purchase Protection: Shop confidently on Artsy knowing that if something goes wrong with your order, we're <span className="learn-more-link" onClick={() => setShowComingSoon(true)}>here to help</span>.<br />
             Our secure payment system and dedicated support team ensure your purchases are protected from start to finish. 
          <span className="learn-more-link" onClick={() => setShowComingSoon(true)}> Learn more</span> about our protection policy.</h3>
        </div>

        <div className="shopping-cart-main">
            <div className="items-cart">
                {cart.map((item) => (
                <div className="cart-item">
                <img src={item.product?.imageUrl} alt={item.product.name} className="product-image" />
                <div className="name-erq">
                    <h3>{item.product.name}</h3>
                    <div className="controls-group">
                        <select value={item.quantity} onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}>
                            {[...Array(200).keys()].map((num) => (
                                <option key={num + 1} value={num + 1}>{num + 1}</option>
                            ))}
                        </select>
                        <OpenModalButton buttonText="Edit" modalComponent={<CartEditModal item={item} />} />
                        <button onClick={() => handleRemove(item.id)}>Remove</button>
                    </div>
                </div>
                <div className="price-product">
                    <p>${(item.product.price * item.quantity).toFixed(2)}</p>
                    <p className="price-each">(${item.product.price} each)</p>
                </div>
            </div>
                ))}
            </div>

        <div className="checkout-summary-section">
          <h3>How you'll pay</h3>
          <div className="payment-methods">
            {['visa_master_amex', 'paypal', 'googlepay'].map(method => (
              <div key={method} className="payment-option">
                <label htmlFor={method}>
                  <img src={`/images/${method}.png`} alt={method} className="payment-icon" />
                </label>
                <input type="radio" id={method} name="paymentMethod" value={method} onChange={() => setPaymentMethod(method)} />
              </div>
            ))}
          </div>

          <div className="order-summary">
            <p>Item(s) total: ${totalPrice.toFixed(2)}</p>
            <p>Shop discount: $0.00</p>
            <p>Subtotal: ${totalPrice.toFixed(2)}</p>
            <p>Shipping and tax calculated at checkout</p>
          </div>

          <div className="gift-option">
            
            <label htmlFor="gift">Mark order as a gift</label>
            <input type="checkbox" id="gift" checked={isGift} onChange={() => setIsGift(!isGift)} />
          </div>

          <button className="checkout-button" onClick={handleCheckout}>Proceed to checkout</button>
        </div>
      </div>
      </div>
  );
};

export default ShoppingCart; 
