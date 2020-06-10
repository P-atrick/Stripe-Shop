import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button, Form, Input } from 'antd';
import { AppContext } from '../Context';
import { CheckoutFormSpinner } from './CheckoutFormSpinner.jsx';

export const CheckoutForm = () => {

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
    console.log(form)
    e.preventDefault();
    setPaymentProcessing(true);

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

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
          }
        },
      }
    });

    setPaymentProcessing(false);
    
    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(result.error.message);
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        setState({ ...state, clientSecret: '' });
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
    <div className='paymentDetailsFormContainer'>
      { paymentProcessing ?
          <CheckoutFormSpinner />
        :
          null
      }
      <form
        className='paymentDetailsForm'
        id='myForm'
        onSubmit={ handleSubmit }
      >
        <fieldset>
          <div className='row' name='name'>
            <label>Name</label>
            <input
              type='text'
              placeholder='Jane Doe'
              onChange={(e) => setForm({...form, name: e.target.value})}
            />
          </div>

          <div className='row'>
            <label name='email'>Email</label>
            <input
              type='email'
              placeholder='janedoe@gmail.com'
              onChange={(e) => setForm({...form, email: e.target.value})}
            />
          </div>

          <div className='row'>
            <label>Address</label>
            <input
              type='text'
              placeholder='The Mall'
              onChange={(e) => setForm({...form, address: e.target.value})}
            />
          </div>

          <div className='row'>
            <label>City</label>
            <input
              type='text'
              placeholder='London'
              onChange={(e) => setForm({...form, city: e.target.value})}
            />

            <label>Postcode</label>
            <input
              type='postcode'
              placeholder='SW1A 1AA'
              onChange={(e) => setForm({...form, postcode: e.target.value})}
            />
          </div>
        </fieldset>

        <fieldset>
          <div className='row'>
            <CardElement options={ CARD_ELEMENT_OPTIONS } />
          </div>
        </fieldset>
        <button
          disabled={ !stripe || !elements }
          form='myForm'
          key='submit'
          type='submit'
        >Confirm order</button>
      </form>
    </div>
  )
}