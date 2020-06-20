const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const { sendFromEmail, sendFromPass } = require('../config/environment');

const sendConfirmationEmail = (variables) => {
  const { cart, formattedChargedPrice, customerEmail } = variables;

  const readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
      if (err) {
        throw err;
        callback(err);
      }
      else {
        callback(null, html);
      }
    });
  };

  readHTMLFile(path.resolve(__dirname, '../src/assets/emails/orderConfirmation.hbs'), function (err, html) {
    const template = handlebars.compile(html);
    const replacements = {
      formattedChargedPrice,
    };
    const htmlToSend = template(replacements);

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      service: 'gmail',
      auth: {
        user: sendFromEmail,
        pass: sendFromPass,
      },
    });

    const mailOptions = {
      from: {
        name: 'Patrick Kelly',
        address: sendFromEmail,
      },
      to: customerEmail,
      subject: 'Nodemailer Test',
      html: htmlToSend,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  });
};

module.exports = {
  sendConfirmationEmail,
};
