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

const createOrderDbEntry = async (req, res, next) => {
  const { cart, totalPrice } = req.body;

  const queryString = `INSERT INTO orders(
      total_price,
      cart,
      payment_received
    ) VALUES(
      ${totalPrice},
      '${JSON.stringify(cart)}',
      false
    )
    RETURNING *`;

  await pool.query(queryString, (err, queryRes) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      console.log(`Created ${queryRes.rowCount} new rows.`);
      res.status(200)
      res.send({ id: queryRes.rows[0].order_id })
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
  const { id, cart, chargedPrice, customerEmail, paymentId } = req.body;

  sendEmail.sendConfirmationEmail({ cart, chargedPrice, customerEmail });

  const queryString = `UPDATE orders SET charged_price = ${chargedPrice}, customer_email = '${customerEmail}', payment_id = '${paymentId}' WHERE order_id = ${id} RETURNING *`
  await pool.query(queryString, (err, queryRes) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      console.log(`Created ${queryRes.rowCount} new rows.`);
      res.sendStatus(200);
    }
  });
}

module.exports = {
  createOrderDbEntry,
  createPaymentIntent,
  completeOrder
};
