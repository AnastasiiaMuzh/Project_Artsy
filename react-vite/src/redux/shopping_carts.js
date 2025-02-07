import { csrfFetch } from "./csrf";

/** ---------- ACTION TYPES ---------- **/
const GET_CART      = 'cart/GET_CART';
const ADD_ITEM      = 'cart/ADD_ITEM';
const UPDATE_ITEM   = 'cart/UPDATE_ITEM';
const REMOVE_ITEM   = 'cart/REMOVE_ITEM';
const CHECKOUT_CART = 'cart/CHECKOUT_CART';


/** ---------- ACTION CREATORS ---------- **/ 
const getCartAction = (cartData) => ({
    type: GET_CART,
    cart: cartData,
  });
  
const addItemAction = (item) => ({
    type: ADD_ITEM,
    item,
  });
  
const updateItemAction = (item) => ({
    type: UPDATE_ITEM,
    item,
  });
  
const removeItemAction = (itemId) => ({
    type: REMOVE_ITEM,
    itemId,
  });
  
const checkoutCartAction = () => ({
    type: CHECKOUT_CART,
  });
  

/** ---------- THUNKS ---------- **/ 
    // Get cart
export const fetchCart = () => async (dispatch) => {
    const res = await csrfFetch('/api/cart');
    if (res.ok) {
      const data = await res.json();
      const newCart = data.cart.map(item => ({
        ...item,
        itemId: item.id, // rename id -> itemId
      }))
      data.cart = newCart
      // console.log('Fetched Cart Data:', data);  // Проверка данных
      dispatch(getCartAction(data));
    }
  }

    // Add to cart items
export const addToCart = (productId, quantity = 1) => async (dispatch) => {
    const res = await csrfFetch('/api/cart/item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    });
    if (res.ok) {
      const data = await res.json();
      dispatch(addItemAction(data));
    }
  };

    // Update quantity product
export const updateCartItem = (itemId, quantity) => async (dispatch) => {
    const res = await csrfFetch(`/api/cart/item/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    if (res.ok) {
      const data = await res.json();
      dispatch(updateItemAction(data));
    }
  };

    // Remove items from the cart
export const removeFromCart = (itemId) => async (dispatch) => {
    const res = await csrfFetch(`/api/cart/items/${itemId}`, {
        method: 'DELETE',
    });
    if (res.ok) {
        dispatch(removeItemAction(itemId));
    }
};

    // Checkout order
export const checkout = (shippingAddress) => async (dispatch) => {
    const res = await csrfFetch('/api/cart/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shippingAddress }),
    });
    if (res.ok) {
        dispatch(checkoutCartAction())
    }
}

/** ---------- INITIAL STATE ---------- **/
const initialState = { cart: [], totalPrice: 0, itemCount: 0 };

// ---------- REDUCER ---------- 
const cartReducer = (state = initialState, action) => {
  switch (action.type) {

    /** Получили всю корзину (cart + totalPrice) */
    case GET_CART: {
      const { cart, totalPrice } = action.payload;
      return {
        ...state,
        cart,
        totalPrice,
      };
    }

    /**
     * Добавили/обновили одну позицию "item".
     * Если на бэкенде логика уже объединяет, 
     * всё равно проверим, нет ли дубля по productId (на всякий случай).
     */
    case ADD_ITEM: {
      const newItem = action.payload;
      // Проверим, есть ли уже такой productId
      const existingIndex = state.cart.findIndex(
        (item) => item.productId === newItem.productId
      );

      // Копия корзины
      const newCart = [...state.cart];

      if (existingIndex !== -1) {
        // Товар есть. Объединяем (увеличиваем quantity).
        // ВАЖНО: берем "quantity" из бэкенда (newItem.quantity),
        // или складываем? Зависит от того, что присылает сервер.
        // Предположим, бэкенд уже вернул итоговое quantity.
        // Тогда просто перезапишем старый товар новым:
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newItem.quantity
        };
      } else {
        // Товара нет, добавляем
        newCart.push(newItem);
      }

      // totalPrice. У вас бэкенд может присылать общую сумму отдельно,
      // но в данном ответе "POST /api/cart/item" может не быть поля total_price.
      // Если нужно, после добавления можно сделать fetchCart, чтобы обновить сумму.
      // Или, если бэкенд возвращает новую сумму, вы бы вставили её сюда.
      // Для простоты пока не трогаем totalPrice.

      return {
        ...state,
        cart: newCart,
      };
    }

    /**
     * Обновили одну позицию (после PATCH)
     */
    case UPDATE_ITEM: {
      const updatedItem = action.payload;
      const newCart = state.cart.map((item) => {
        if (item.itemId === updatedItem.itemId) {
          return {
            ...item,
            quantity: updatedItem.quantity,
            // Если есть изменения цены и т.п., тоже применяем
          };
        }
        return item;
      });

      return {
        ...state,
        cart: newCart,
      };
    }

    /**
     * Удалили позицию
     */
    case REMOVE_ITEM: {
      const itemId = action.payload;
      const newCart = state.cart.filter((item) => item.itemId !== itemId);

      return {
        ...state,
        cart: newCart,
      };
    }

    /**
     * Оформление заказа: чистим локальную корзину
     */
    case CHECKOUT_CART: {
      return initialState;
    }

    default:
      return state;
  }
};


export default cartReducer;