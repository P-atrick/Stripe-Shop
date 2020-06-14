const router = require('express').Router();
const checkout = require('../controllers/checkout');

router.route('/checkout/createorder')
  .post(checkout.createOrderDbEntry);

router.route('/checkout/createpayment')
  .post(checkout.createPaymentIntent);
  
router.route('/checkout/ordercomplete')
  .post(checkout.completeOrder);

router.all('/*', (req, res) => res.notFound());

module.exports = router;
