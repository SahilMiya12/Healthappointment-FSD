const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const jwt = require('jsonwebtoken');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Register user with role selection
const register = async (req, res) => {
  try {
    const { name, email, password, phone, role, specialization, qualification, experience, consultationFee } = req.body;
    
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user with selected role
    const user = await User.create({ 
      name, 
      email, 
      password, 
      phone, 
      role: role || 'patient' 
    });

    // Create role-specific profile
    if (user.role === 'patient') {
      await Patient.create({ user: user._id });
    } else if (user.role === 'doctor') {
      await Doctor.create({
        user: user._id,
        specialization: specialization || 'General Medicine',
        qualification: qualification || 'MD',
        experience: experience || 0,
        consultationFee: consultationFee || 100,
        bio: 'Experienced healthcare professional',
        languages: ['English'],
        availability: [
          { day: 'Monday', slots: [{ startTime: '09:00', endTime: '17:00', isAvailable: true }] },
          { day: 'Tuesday', slots: [{ startTime: '09:00', endTime: '17:00', isAvailable: true }] },
          { day: 'Wednesday', slots: [{ startTime: '09:00', endTime: '17:00', isAvailable: true }] },
          { day: 'Thursday', slots: [{ startTime: '09:00', endTime: '17:00', isAvailable: true }] },
          { day: 'Friday', slots: [{ startTime: '09:00', endTime: '13:00', isAvailable: true }] }
        ]
      });
    }
    // Admin doesn't need additional profile

    res.status(201).json({ 
      _id: user._id, 
      name, 
      email, 
      role: user.role, 
      token: generateToken(user._id) 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Login user - returns role-specific dashboard URL
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    
    if (user && (await user.matchPassword(password))) {
      user.lastLogin = Date.now();
      await user.save();

      // Get role-specific data
      let doctorData = null;
      let patientData = null;
      let dashboardUrl = '/dashboard';

      if (user.role === 'doctor') {
        doctorData = await Doctor.findOne({ user: user._id }).populate('user');
        dashboardUrl = '/doctor/dashboard';
      } else if (user.role === 'patient') {
        patientData = await Patient.findOne({ user: user._id }).populate('user');
        dashboardUrl = '/dashboard';
      } else if (user.role === 'admin') {
        dashboardUrl = '/admin/dashboard';
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        doctor: doctorData,
        patient: patientData,
        dashboardUrl: dashboardUrl,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let profile = null;
    
    if (user.role === 'doctor') {
      profile = await Doctor.findOne({ user: user._id });
    } else if (user.role === 'patient') {
      profile = await Patient.findOne({ user: user._id });
    }
    
    res.json({ success: true, user, profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, getProfile };