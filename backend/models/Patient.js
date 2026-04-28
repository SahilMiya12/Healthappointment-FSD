const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bloodGroup: String,
  allergies: [String],
  chronicConditions: [String]
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);