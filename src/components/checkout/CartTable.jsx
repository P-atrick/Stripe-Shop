import React, { useContext, useEffect } from 'react';
import { MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { AppContext } from '../../Context';
import formatPrice from '../utility/FormatPrice';
import persistState from '../utility/PersistState';

const CartTable = () => {
  const [state, setState] = useContext(AppContext);

  const increaseQuantity = (productId) => {
    const newQuantity = state.cart[productId].quantity + 1;

    setState((prevState) => ({
      ...state,
      cart: {
        ...state.cart,
        [productId]: {
          ...state.cart[productId],
          quantity: newQuantity,
          totalPrice: newQuantity * state.cart[productId].unitPrice,
        },
      },
      totalPrice: prevState.totalPrice + state.cart[productId].unitPrice,
    }));
  };

  const decreaseQuantity = (productId) => {
    if (state.cart[productId].quantity === 1) {
      const newTotalPrice = state.totalPrice - state.cart[productId].unitPrice;
      const filteredCart = state.cart;
      delete filteredCart[productId];

      setState(() => ({
        ...state,
        cart: filteredCart,
        totalPrice: newTotalPrice,
      }));
    } else {
      const newQuantity = state.cart[productId].quantity - 1;

      setState((prevState) => ({
        ...state,
        cart: {
          ...state.cart,
          [productId]: {
            ...state.cart[productId],
            quantity: newQuantity,
            totalPrice: newQuantity * state.cart[productId].unitPrice,
          },
        },
        totalPrice: prevState.totalPrice - state.cart[productId].unitPrice,
      }));
    }
  };

  useEffect(() => {
    persistState(state);
  }, [state]);

  return (
    <table className="cartTable">
      <thead>
        <tr>
          <th>Product</th>
          <th>Price</th>
          <th>Quantity</th>
          <th className="cartTableSubtotal">Subtotal</th>
        </tr>
      </thead>

      <tbody>
        {Object.entries(state.cart).map((item) => {
          if (item[1].quantity) {
            return (
              <tr key={item[0]}>
                <td>{ item[1].name }</td>
                <td>
                  £
                  { formatPrice(item[1].unitPrice) }
                </td>
                <td>
                  <MinusSquareOutlined
                    onClick={() => decreaseQuantity(item[0])}
                  />
                  { item[1].quantity }
                  <PlusSquareOutlined
                    onClick={() => increaseQuantity(item[0])}
                  />
                </td>
                <td>
                  £
                  { formatPrice(item[1].totalPrice) }
                </td>
              </tr>
            );
          }
        })}
      </tbody>

      <p>
        Total Price: £
        {formatPrice(state.totalPrice)}
      </p>

    </table>
  );
};

export default CartTable;
