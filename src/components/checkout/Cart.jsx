import React, { useContext, useState } from 'react';
import Axios from 'axios';
import { AppContext } from '../../Context';
import CartEmpty from './CartEmpty';
import CartTable from './CartTable';
import Checkout from './Checkout';

const Cart = () => {
  const [state, setState] = useContext(AppContext);
  const [allowContinue, setAllowContinue] = useState(true);

  const createPaymentIntent = () => {
    Axios
      .post('/api/checkout', {
        totalPrice: state.totalPrice,
      })
      .then(async (res) => {
        await res.data.clientSecret;
        setState({ ...state, clientSecret: res.data.clientSecret });
      });
    setAllowContinue(false);
  };

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
                className="createPaymentIntentButton"
                disabled={!allowContinue}
                onClick={createPaymentIntent}
                type="button"
              >
                Continue
              </button>
            )}
              { state.clientSecret && <Checkout /> }
            </div>
          )
          : <CartEmpty />
      }
    </div>
  );
};

export default Cart;
