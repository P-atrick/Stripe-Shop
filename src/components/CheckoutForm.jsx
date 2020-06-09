import React, { useContext } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button, Form, Input } from 'antd';
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

  const handleSubmit = async (formData) => {

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmCardPayment(state.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: `${formData.email}`,
          address: {
            line1: `${formData.address}`,
            town: `${formData.town}`,
            postal_code: `${formData.postcode}`,
          }
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
    <div className='paymentDetailsFormContainer'>
      Payment Details
      <Form
        className='paymentDetailsForm'
        id='myForm'
        onFinish={ handleSubmit }
      >
        <Form.Item
          label='First Name'
          name='firstName'
          rules={[{ required: true, message: 'Please enter your first name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='Last Name'
          name='lastName'
          rules={[{ required: true, message: 'Please enter your last name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='Email'
          name='email'
          rules={[{ required: true, message: 'Please enter your email' }]}
        >
          <Input type='email'/>
        </Form.Item>
        

        <Form.Item
          label='Address'
          name='address'
          rules={[{ required: true, message: 'Please enter your address' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='Town'
          name='town'
          rules={[{ required: true, message: 'Please enter your town' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='Postcode'
          name='postcode'
          rules={[{ required: true, message: 'Please enter your postcode' }]}
        >
          <Input />
        </Form.Item>

        <CardElement options={ CARD_ELEMENT_OPTIONS } />
        <Button
          disabled={ !stripe || !elements }
          form='myForm'
          key='submit'
          htmlType='submit'
        >Confirm order</Button>
      </Form>
    </div>
  )
}