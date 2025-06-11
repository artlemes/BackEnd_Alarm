const express = require('express');
const router = express.Router();
const activationController = require('./activationController');


router.put('/activate', activationController.activateAlarm);
router.put('/deactivate', activationController.deactivateAlarm);

module.exports = router;
