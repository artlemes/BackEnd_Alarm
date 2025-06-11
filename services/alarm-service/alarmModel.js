const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  name: { type: String, required: true },        // Ex: "Casa do João"
  address: { type: String },                      // Ex: "Rua das Palmeiras, 123"
  city: { type: String },
  state: { type: String },
  zipcode: { type: String },
});

const AlarmSchema = new mongoose.Schema({
  location: { type: LocationSchema, required: true },
  authorizedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }],  // IDs dos usuários permitidos
  monitoredPoints: [{ type: String, required: true }], // Ex: ["Porta principal", "Sala", "Quarto"]
  activated: [{type: String, required: false}],
  triggered: [{type: String, required: false}],
}, {
  timestamps: true,  // cria createdAt e updatedAt automaticamente
});

module.exports = mongoose.model('Alarm', AlarmSchema);
