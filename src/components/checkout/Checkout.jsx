import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { stripePublishable } from '../../../config/environment';
import { CheckoutForm } from './CheckoutForm.jsx';

const stripePromise = loadStripe(stripePublishable);

export const Checkout = () => {

  return (
    <Elements stripe={ stripePromise }>
      <CheckoutForm/>
    </Elements>
  )
}