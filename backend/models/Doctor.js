const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  specialization: { type: String, required: true },
  qualification: { type: String, required: true },
  experience: { type: Number, default: 0 },
  consultationFee: { type: Number, required: true },
  bio: { type: String },
  languages: [String],
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  availability: [{
    day: String,
    slots: [{ startTime: String, endTime: String, isAvailable: Boolean }]
  }]
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);