const express = require('express');
const router = express.Router();
const loggingController = require('./loggingController');

router.get('/', loggingController.getAllLogs);


module.exports = router;
