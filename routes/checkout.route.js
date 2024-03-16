var express = require('express');
const checkoutController = require('../controllers/checkout.controller');
var router = express.Router();

router.post('/', auth, checkoutController.checkoutProducController)


module.exports = router;