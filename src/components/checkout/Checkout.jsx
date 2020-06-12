import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { stripePublishable } from '../../../config/environment';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe(stripePublishable);

const Checkout = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default Checkout;
