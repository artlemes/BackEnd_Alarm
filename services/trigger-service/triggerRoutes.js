const express = require('express');
const router = express.Router();
const triggerController = require('./triggerController');


router.put('/triggered', triggerController.triggeredAlarm);
router.put('/untriggered', triggerController.untriggeredAlarm);

module.exports = router;
