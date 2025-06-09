const express = require('express');
const router = express.Router();
const alarmController = require('./alarmController');

router.post('/', alarmController.createAlarm);
router.get('/all', alarmController.getAlarms);
router.get('/:id', alarmController.getAlarmById);
router.delete('/:id', alarmController.deleteAlarm);
router.patch('/', alarmController.associateUser);


module.exports = router;
