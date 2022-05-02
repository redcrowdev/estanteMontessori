const express = require('express');
const router = express.Router();
const metricsController = require('../controllers/metrics.js');
const { isLoggedIn } = require('../utils/middleware.js');
const wrapAsync = require('../utils/wrapAsync');


router.get('/', isLoggedIn, wrapAsync(metricsController.show))

module.exports = router;