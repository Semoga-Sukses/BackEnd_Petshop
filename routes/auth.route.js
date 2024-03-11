var express = require('express');
const authController  = require('../controllers/auth.controller');
var router = express.Router();

router.post('/', authController.authControllerLogin)


module.exports = router;