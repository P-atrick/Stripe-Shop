const { Pool } = require('pg');
const { stripeSecret } = require('../config/environment');
const stripe = require('stripe')(stripeSecret);
const {
  pgUser,
  pgHost,
  pgDb,
  pgPassword,
  pgPort,
} = require('../config/environment');

const pool = new Pool({
  user: pgUser,
  host: pgHost,
  database: pgDb,
  password: pgPassword,
  port: pgPort,
});

const createPaymentIntent = async (req, res) => {
  const { totalPrice } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalPrice,
    currency: 'gbp',
    payment_method_types: ['card'],
    receipt_email: 'jenny.rosen@example.com',
  });
  res.send({ clientSecret: paymentIntent.client_secret });
};

const orderComplete = async (req, res) => {
  const { cart, totalPrice } = req.body;

  const queryString = `INSERT INTO orders(
      customer_id,
      name,
      email,
      total_price,
      cart
    ) VALUES(
      null,
      'Patrick Kelly',
      'patrick@pkelly.co',
      ${totalPrice},
      '${JSON.stringify(cart)}'
    )
    RETURNING *`;

  pool.query(queryString, (err, queryRes) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      console.log(`Created ${queryRes.rowCount} new rows.`);
      res.sendStatus(200);
    }
  });
};

module.exports = {
  createPaymentIntent,
  orderComplete,
};
