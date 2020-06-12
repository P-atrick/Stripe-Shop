import React, { useContext, useState } from 'react';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { LoadingOutlined } from '@ant-design/icons';
import { AppContext } from '../../Context';
import formatPrice from '../utility/FormatPrice';

const CheckoutForm = () => {
  const [state, setState] = useContext(AppContext);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [form, setForm] = useState({});
  const history = useHistory();

  const CARD_ELEMENT_OPTIONS = {
    iconStyle: 'solid',
    style: {
      base: {
        iconColor: '#c4f0ff',
        color: '#fff',
        fontWeight: 500,
        fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        ':-webkit-autofill': {
          color: '#fce883',
        },
        '::placeholder': {
          color: '#87BBFD',
        },
      },
      invalid: {
        iconColor: '#FFC7EE',
        color: '#FFC7EE',
      },
    },
  };

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaymentProcessing(true);
    const customerEmail = form.email;

    const result = await stripe.confirmCardPayment(state.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: form.name,
          email: form.email,
          address: {
            line1: form.address,
            city: form.town,
            postal_code: form.postcode,
          },
        },
      },
      receipt_email: form.email,
    });

    setPaymentProcessing(false);

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(result.error.message);
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        setState({
          ...state,
          clientSecret: '',
          cart: {},
          totalPrice: 0,
        });

        Axios
          .post('/api/checkout/order', {
            cart: state.cart,
            totalPrice: state.totalPrice,
            customerEmail,
          });

        history.push('/ordercomplete');

        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
      }
    }
  };

  return (
    <div className="paymentDetailsFormContainer">
      <form
        className="paymentDetailsForm"
        id="myForm"
        onSubmit={handleSubmit}
      >
        <fieldset>
          <div className="row">
            <label htmlFor="name">Name</label>
            <input
              disabled={paymentProcessing}
              id="name"
              type="text"
              placeholder="Jane Doe"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="row">
            <label htmlFor="email">Email</label>
            <input
              disabled={paymentProcessing}
              id="email"
              type="email"
              placeholder="janedoe@gmail.com"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="row">
            <label htmlFor="address">Address</label>
            <input
              disabled={paymentProcessing}
              id="address"
              type="text"
              placeholder="The Mall"
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>

          <div className="row">
            <label htmlFor="city">City</label>
            <input
              disabled={paymentProcessing}
              id="city"
              type="text"
              placeholder="London"
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />

            <label htmlFor="postcode">Postcode</label>
            <input
              disabled={paymentProcessing}
              id="postcode"
              type="postcode"
              placeholder="SW1A 1AA"
              onChange={(e) => setForm({ ...form, postcode: e.target.value })}
            />
          </div>
        </fieldset>

        <fieldset>
          <div className="row">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </fieldset>
        <button
          disabled={!stripe || !elements}
          form="myForm"
          key="submit"
          type="submit"
        >
          {
            paymentProcessing
              ? <LoadingOutlined />
              : `Confirm payment of £${formatPrice(state.totalPrice)}`
          }
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
