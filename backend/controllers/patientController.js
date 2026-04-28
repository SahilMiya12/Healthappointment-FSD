const Patient = require('../models/Patient');

const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.params.id === 'profile' ? req.user._id : req.params.id })
      .populate('user');
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPatientById };