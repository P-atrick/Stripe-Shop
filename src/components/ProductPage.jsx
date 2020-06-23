import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'antd';
import { AppContext } from '../Context';
import productsData from '../Data/productsData';
import formatPrice from './utility/FormatPrice';
import persistState from './utility/PersistState';

const ProductPage = () => {
  const { productId } = useParams();
  const product = productsData[productId - 1];
  const [state, setState] = useContext(AppContext);

  const addToCartNew = (id, productName, productPrice) => {
    setState((prevState) => ({
      ...state,
      cart: {
        ...state.cart,
        [id]: {
          name: productName,
          quantity: 1,
          unitPrice: productPrice,
          totalPrice: productPrice,
        },
      },
      totalPrice: prevState.totalPrice + productPrice,
    }));
  };

  const addToCartExisting = (id) => {
    const newQuantity = state.cart[id].quantity + 1;

    setState((prevState) => ({
      ...state,
      cart: {
        ...state.cart,
        [id]: {
          ...state.cart[id],
          quantity: newQuantity,
          totalPrice: newQuantity * state.cart[id].unitPrice,
        },
      },
      totalPrice: prevState.totalPrice + state.cart[id].unitPrice,
    }));
  };

  const initiateAddToCart = () => {
    if (Object.prototype.hasOwnProperty.call(state.cart, product.id)) {
      addToCartExisting(product.id);
    } else {
      addToCartNew(product.id, product.name, product.price);
    }
  };

  useEffect(() => {
    persistState(state);
  }, [state]);

  return (
    <div>
      <div>{product.name}</div>
      <img alt={`${product.name}`} src={require(`../../public/assets/product-images/${product.image}`)} style={{ width: '100px' }} />
      <Button
        onClick={() => initiateAddToCart()}
        type="primary"
        block
      >
        Add to cart
      </Button>
    </div>
  );
};

export default ProductPage;
