import React, { useContext, useState, useEffect } from 'react';
import Axios from 'axios';
import { AppContext } from '../../Context';
import CartEmpty from './CartEmpty';
import CartTable from './CartTable';
import Checkout from './Checkout';
import persistState from '../utility/PersistState';

const Cart = () => {
  const [state, setState] = useContext(AppContext);
  const [allowContinue, setAllowContinue] = useState(true);

  const createpaymentIntent = (id) => {
    Axios
      .post('/api/checkout/createpayment', {
        totalPrice: state.totalPrice,
      })
      .then(async (res) => {
        await res.data.clientSecret;
        setState({ ...state, token: res.data.clientSecret, id: id });
      });
      setAllowContinue(false);
  }

  const createOrder = () => {
    // Save order to DB
    Axios
    .post('/api/checkout/createorder', {
      cart: state.cart,
      totalPrice: state.totalPrice
    })
    .then(res => {
      // If the DB saved the order, create payment intent
      if (res.status === 200) {
        createpaymentIntent(res.data.id);
      // If the DB hit an error, console log the error
      } else {
        console.log('Received error when saving order to database');
      }
    })
  };

  useEffect(() => {
    persistState(state);
  }, [state]);

  return (
    <div>
      {
        Object.keys(state.cart).length > 0
          ? (
            <div>
              <CartTable />
              { allowContinue
            && (
              <button
                className="createOrderButton"
                disabled={!allowContinue}
                onClick={createOrder}
                type="button"
              >
                Continue
              </button>
            )}
              { state.token && <Checkout /> }
            </div>
          )
          : <CartEmpty />
      }
    </div>
  );
};

export default Cart;
