const mongoose = require('mongoose');

const alarmSchema = new mongoose.Schema({
  localization: { type: String, required: true },
  autorizedUsers: { type: [String], required: false },
  monitorizedPoints: { type: [String], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Alarm', alarmSchema);
