const stripeSecret = require('../config/environment').stripeSecret;
const stripeUrl = require('../config/environment').stripeUrl;
const stripe = require('stripe')(stripeSecret);

async function createPaymentIntent(req, res, next) {
  const totalPrice = req.body.totalPrice;

  let paymentIntent = await stripe.paymentIntents.create({
    amount: totalPrice,
    currency: 'gbp',
    payment_method_types: ['card'],
    receipt_email: 'jenny.rosen@example.com',
  })
  res.send({ client_secret: paymentIntent.client_secret })
}

module.exports = {
  createPaymentIntent
}
