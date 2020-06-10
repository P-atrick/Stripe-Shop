import React, { useContext, useEffect } from 'react';
import { Button, Card } from 'antd';
import { AppContext } from '../Context';
import { products } from '../Data/products';
import { formatPrice } from './utility/FormatPrice';
import { persistState } from './utility/PersistState';

export const Products = () => {

  const [state, setState] = useContext(AppContext);

  const initiateAddToCart = (product) => {

    if (state.cart.hasOwnProperty(product.id)) {
      addToCartExisting(product.id);
      
    } else {
      addToCartNew(product.id, product.name, product.price);
    }
  }

  const addToCartNew = (productId, productName, productPrice) => {
    setState(prevState => ({
      ...state,
      cart: {
        ...state.cart,
        [productId]: {
          name: productName,
          quantity: 1,
          unitPrice: productPrice,
          totalPrice: productPrice
        }
      },
      totalPrice: prevState.totalPrice + productPrice
    }));
  }

  const addToCartExisting = (productId) => {

    const newQuantity = state.cart[productId].quantity + 1;

    setState(prevState => ({
      ...state,
      cart: {
        ...state.cart,
        [productId]: {
          ...state.cart[productId],
          quantity: newQuantity,
          totalPrice: newQuantity * state.cart[productId].unitPrice
        }
      },
      totalPrice: prevState.totalPrice + state.cart[productId].unitPrice
    }));
  }

  useEffect(() => {
    persistState(state);
  }, [state])

  return(
    <div className='productsContainer'>
      {products.map((product, i) => {
        return (
          <Card
            className='productCard'
            cover={<img alt={`${product.name}`} src={require(`../assets/product-images/${product.image}`)} />}
            hoverable
            key={i}
            style={{width: '100'}}
            >
            <p className='productName'>{ product.name }</p>
            <p>£{ formatPrice(product.price) }</p>
            <Button
              onClick={() => initiateAddToCart(product)}
              type='primary'
              block
            >
              Add to cart
            </Button>
          </Card>
        )
      })}
    </div>
  )
}