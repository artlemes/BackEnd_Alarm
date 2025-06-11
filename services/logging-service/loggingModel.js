// logging-service/models/Log.js
const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  alarmId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userID: { type: String },
  eventType: { type: String, enum: ['activated', 'deactivated', 'triggered'], required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', LogSchema);
