const router = require('express').Router();
const checkout = require('../controllers/checkout');

router.route('/checkout')
  .post(checkout.createPaymentIntent);
  
router.route('/checkout/ordercomplete')
  .post(checkout.orderComplete);

router.all('/*', (req, res) => res.notFound());

module.exports = router;
