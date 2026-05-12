const Doctor = require('../models/Doctor');
const User = require('../models/User');

// Get all doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isAvailable: true })
      .populate('user', 'name email phone')
      .sort({ rating: -1 });
    
    res.json({ doctors });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get doctor by ID
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('user', 'name email phone');
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json(doctor);
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get current doctor profile
const getMyDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id })
      .populate('user', 'name email phone');
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }
    
    res.json(doctor);
  } catch (error) {
    console.error('Error fetching doctor profile:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update doctor profile
const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const allowedFields = ['specialization', 'qualification', 'experience', 'consultationFee', 'bio', 'languages', 'isAvailable'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        doctor[field] = req.body[field];
      }
    });

    await doctor.save();

    res.json(doctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update doctor availability
const updateAvailability = async (req, res) => {
  try {
    console.log('=== Updating Availability ===');
    console.log('User ID:', req.user._id);
    console.log('Received availability:', JSON.stringify(req.body, null, 2));
    
    const doctor = await Doctor.findOne({ user: req.user._id });
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    // Update availability
    doctor.availability = req.body.availability || [];
    await doctor.save();

    console.log('Availability saved successfully');
    
    res.json({ 
      success: true,
      message: 'Availability updated successfully', 
      availability: doctor.availability 
    });
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get doctor availability
const getAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    res.json({ availability: doctor.availability || [] });
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get doctor's appointments
const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const Appointment = require('../models/Appointment');
    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate('patient')
      .sort({ appointmentDate: -1 });

    res.json({ appointments });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  getMyDoctorProfile,
  updateDoctorProfile,
  updateAvailability,
  getAvailability,
  getDoctorAppointments
};