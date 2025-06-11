const express = require('express');
const router = express.Router();
const alarmController = require('./alarmController');

router.post('/', alarmController.createAlarm);
router.get('/all', alarmController.getAlarms);
router.get('/:id', alarmController.getAlarmById);
router.delete('/:id', alarmController.deleteAlarm);
router.patch('/', alarmController.associateUser);
router.patch('/:id', alarmController.removePermission);
router.put('/activate', alarmController.activateAlarm);
router.put('/deactivate', alarmController.deactivateAlarm);
router.put('/trigger', alarmController.triggeredAlarm);
router.put('/untrigger', alarmController.untriggeredAlarm);

module.exports = router;
