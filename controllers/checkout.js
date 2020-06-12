const { Pool } = require('pg');
const { stripeSecret } = require('../config/environment');
const stripe = require('stripe')(stripeSecret);
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const {
  pgUser,
  pgHost,
  pgDb,
  pgPassword,
  pgPort,
} = require('../config/environment');
const { sendFromEmail, sendFromPass } = require('../config/environment');

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

const orderComplete = async (req, res, next) => {
  const { cart, totalPrice, customerEmail } = req.body;

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
    } else {
      console.log(`Created ${queryRes.rowCount} new rows.`);
    }
  });

  next(sendConfirmationEmail(cart, totalPrice, customerEmail))
};

const sendConfirmationEmail = (cart, totalPrice, customerEmail) => {
  const readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
          throw err;
          callback(err);
        }
        else {
          callback(null, html);
        }
    });
  };

  readHTMLFile(path.resolve(__dirname, '../src/assets/emails/orderConfirmation.html'), function(err, html) {
    const template = handlebars.compile(html);
    const replacements = {
         totalPrice
    };
    const htmlToSend = template(replacements);

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      service: 'gmail',
      auth: {
        user: sendFromEmail,
        pass: sendFromPass
      }
    });

    const mailOptions = {
      from: {
        name: 'Patrick Kelly',
        address: sendFromEmail
      },
      to: customerEmail,
      subject: 'Nodemailer Test',
      text: htmlToSend
    };

     transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        // res.sendStatus(500);
      } else {
        console.log('Email sent: ' + info.response);
        // res.sendStatus(200);
      }
    });
  });
}

module.exports = {
  createPaymentIntent,
  orderComplete
};
