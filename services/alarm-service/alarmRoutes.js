const express = require('express');
const router = express.Router();
const alarmController = require('./alarmController');

router.post('/', alarmController.createAlarm);
router.get('/all', alarmController.getAlarms);
router.get('/:id', alarmController.getAlarmById);
router.delete('/:id', alarmController.deleteAlarm);


module.exports = router;
