import React, { useContext } from 'react';
import Axios from 'axios';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button } from 'antd';
import { AppContext } from '../Context';

export const CheckoutForm = () => {

  const [state] = useContext(AppContext);

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('a')

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmCardPayment(state.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: 'Patrick Kelly',
        },
      }
    });

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(result.error.message);
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
      }
    }
  };

  

  return (
    <div style={{border: '1px solid black', marginTop: '20px', padding: '5px'}}>
      CheckoutForm.jsx
      <form onSubmit={ handleSubmit }>
        <CardElement options={ CARD_ELEMENT_OPTIONS } />
        <Button disabled={ !stripe || !elements } onClick={ handleSubmit }>Confirm order</Button>
      </form>
    </div>
  )
}