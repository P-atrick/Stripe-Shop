import React, { useContext, useState } from 'react';
import Axios from 'axios';
import { AppContext } from '../../Context';
import { CartEmpty } from './CartEmpty.jsx';
import { CartTable } from './CartTable.jsx';
import { Checkout } from './Checkout.jsx';

export const Cart = () => {

  const [state, setState] = useContext(AppContext);
  const [allowContinue, setAllowContinue] = useState(true)

  const createPaymentIntent = () => {
    Axios
      .post('/api/checkout', {
        totalPrice: state.totalPrice,
      })
      .then(async (res) => {
        await res.data.clientSecret
        setState({ ...state, clientSecret: res.data.clientSecret })
      })
    setAllowContinue(false);
  }

  return (
    <div>
      {
        Object.keys(state.cart).length > 0 ?
        <div>
          <CartTable />
          { allowContinue && 
            <button
              className='createPaymentIntentButton'
              disabled={ !allowContinue }
              onClick={ createPaymentIntent }
            >Continue</button>
          }
          { state.clientSecret && <Checkout/> }
        </div>
        :
          <CartEmpty />
      }
    </div>
  )
}