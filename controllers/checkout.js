const { Pool } = require('pg');
const {
  stripeSecret,
  pgUser,
  pgHost,
  pgDb,
  pgPassword,
  pgPort,
} = require('../config/environment');
const stripe = require('stripe')(stripeSecret);
const sendEmail = require('./sendEmail');

const pool = new Pool({
  user: pgUser,
  host: pgHost,
  database: pgDb,
  password: pgPassword,
  port: pgPort,
});

const createOrderDbEntry = async (req, res) => {
  const { cart, totalPrice } = req.body;

  const queryStringCreateOrder = 'INSERT INTO orders(total_price, cart, payment_received) VALUES($1, $2, false) RETURNING *';
  const queryParamsCreateOrder = [totalPrice, JSON.stringify(cart)];

  await pool.query(queryStringCreateOrder, queryParamsCreateOrder, (err, queryRes) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      console.log(`Created ${queryRes.rowCount} new rows.`);
      res.status(200);
      res.send({ id: queryRes.rows[0].order_id });
    }
  });
};

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

const completeOrder = async (req, res) => {
  const {
    id, cart, chargedPrice, customerEmail, paymentId,
  } = req.body;
  const formattedChargedPrice = (chargedPrice / 100).toFixed(2);

  sendEmail.sendConfirmationEmail({ cart, formattedChargedPrice, customerEmail });

  const queryStringUpdateOrder = 'UPDATE orders SET charged_price = $1, customer_email = $2, payment_id = $3 WHERE order_id = $4 RETURNING *';
  const queryParamsUpdateOrder = [chargedPrice, customerEmail, paymentId, id];

  await pool.query(queryStringUpdateOrder, queryParamsUpdateOrder, (err, queryRes) => {
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
  createOrderDbEntry,
  createPaymentIntent,
  completeOrder,
};
