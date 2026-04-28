const Doctor = require('../models/Doctor');

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('user', 'name email');
    res.json({ doctors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user', 'name email');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllDoctors, getDoctorById };