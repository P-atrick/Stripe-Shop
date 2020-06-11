const stripeSecret = require('../config/environment').stripeSecret;
const stripeUrl = require('../config/environment').stripeUrl;
const stripe = require('stripe')(stripeSecret);
const { pgUser, pgHost, pgDb, pgPassword, pgPort } = require('../config/environment');

const Pool = require('pg').Pool
const pool = new Pool({
  user: pgUser,
  host: pgHost,
  database: pgDb,
  password: pgPassword,
  port: pgPort,
});

const createPaymentIntent = async (req, res, next) => {
  const totalPrice = req.body.totalPrice;

  let paymentIntent = await stripe.paymentIntents.create({
    amount: totalPrice,
    currency: 'gbp',
    payment_method_types: ['card'],
    receipt_email: 'jenny.rosen@example.com'
    })
  res.send({ clientSecret: paymentIntent.client_secret });
}

const orderComplete = async (req, res, next) => {
  const { cart, totalPrice } = req.body
  const text = 'INSERT INTO orders (order_id, name, email, total_price) VALUES ($1, $2, $3, $4) RETURNING *';
  const values = [1, 'Patrick Kelly', 'patrick@pkelly.co', 123];

  var queryString = `INSERT INTO orders(
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
    RETURNING *`
    
  pool.query(queryString, (err,queryRes)=>{
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      console.log(`Created ${queryRes.rowCount} new rows.`);
      res.sendStatus(200);
    }
  })
}

module.exports = {
  createPaymentIntent,
  orderComplete
}
