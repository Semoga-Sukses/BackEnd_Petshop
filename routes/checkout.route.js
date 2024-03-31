var express = require('express');
const checkoutController = require('../controllers/checkout.controller');
const { auth } = require('../middleware/index.middleware');
var router = express.Router();

router.post('/', auth, checkoutController.checkoutProducController)

router.post('/notifikasi', checkoutController.checkoutNotifikasiController)


module.exports = router;