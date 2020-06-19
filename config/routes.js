const router = require('express').Router();
const checkout = require('../controllers/checkout');
const auth = require('../controllers/auth');

router.route('/checkout/createorder')
  .post(checkout.createOrderDbEntry);

router.route('/checkout/createpayment')
  .post(checkout.createPaymentIntent);
  
router.route('/checkout/ordercomplete')
  .post(checkout.completeOrder);

router.route('/login')
  .post(auth.login);

router.route('/register')
  .post(auth.register);

router.all('/*', (req, res) => res.notFound());

module.exports = router;
