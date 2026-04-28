const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

// Get available slots for a doctor
const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;
    
    console.log('=== getAvailableSlots called ===');
    console.log('doctorId:', doctorId);
    console.log('date:', date);

    if (!doctorId) {
      return res.status(400).json({ message: 'Doctor ID is required' });
    }

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    // Find doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      console.log('Doctor not found');
      return res.status(404).json({ message: 'Doctor not found' });
    }

    console.log('Doctor found:', doctor.user);

    // Get day of week
    const selectedDate = new Date(date);
    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
    console.log('Day name:', dayName);
    
    // Find availability for that day
    const availability = doctor.availability.find(a => a.day === dayName);
    
    if (!availability) {
      console.log('No availability for', dayName);
      return res.json({ availableSlots: [] });
    }

    // Generate time slots (30-minute intervals)
    const allSlots = [];
    for (const slot of availability.slots) {
      if (slot.isAvailable) {
        const startHour = parseInt(slot.startTime.split(':')[0]);
        const startMinute = parseInt(slot.startTime.split(':')[1]) || 0;
        const endHour = parseInt(slot.endTime.split(':')[0]);
        const endMinute = parseInt(slot.endTime.split(':')[1]) || 0;
        
        let currentHour = startHour;
        let currentMinute = startMinute;
        
        while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
          const period = currentHour >= 12 ? 'PM' : 'AM';
          const displayHour = currentHour > 12 ? currentHour - 12 : currentHour === 0 ? 12 : currentHour;
          const displayMinute = currentMinute === 0 ? '00' : currentMinute;
          
          allSlots.push(`${displayHour}:${displayMinute} ${period}`);
          
          // Add 30 minutes
          currentMinute += 30;
          if (currentMinute >= 60) {
            currentHour++;
            currentMinute = 0;
          }
        }
      }
    }

    console.log('Generated slots:', allSlots);

    // Get booked appointments for that day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedAppointments = await Appointment.find({
      doctor: doctorId,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['scheduled', 'confirmed'] }
    });

    const bookedSlots = bookedAppointments.map(apt => apt.appointmentTime);
    console.log('Booked slots:', bookedSlots);

    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
    console.log('Available slots:', availableSlots);

    res.json({ availableSlots });
  } catch (error) {
    console.error('Error in getAvailableSlots:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create appointment
const createAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, type, reason, symptoms } = req.body;
    
    console.log('=== createAppointment called ===');
    console.log('Request body:', req.body);
    console.log('User:', req.user);

    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Find patient
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      console.log('Patient not found for user:', req.user._id);
      return res.status(404).json({ message: 'Patient profile not found. Please complete your registration.' });
    }

    console.log('Patient found:', patient._id);

    // Find doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      console.log('Doctor not found:', doctorId);
      return res.status(404).json({ message: 'Doctor not found' });
    }

    console.log('Doctor found:', doctor._id);

    // Check if appointment already exists for this slot
    const appointmentDateObj = new Date(appointmentDate);
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: appointmentDateObj,
      appointmentTime: appointmentTime,
      status: { $in: ['scheduled', 'confirmed'] }
    });

    if (existingAppointment) {
      console.log('Slot already booked');
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patient: patient._id,
      doctor: doctorId,
      appointmentDate: appointmentDateObj,
      appointmentTime: appointmentTime,
      type: type || 'consultation',
      reason: reason || 'General consultation',
      symptoms: symptoms || [],
      amount: doctor.consultationFee,
      status: 'scheduled'
    });

    console.log('Appointment created:', appointment._id);

    // Populate the appointment
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('doctor', 'specialization consultationFee')
      .populate('patient');

    res.status(201).json(populatedAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get user appointments
const getUserAppointments = async (req, res) => {
  try {
    console.log('=== getUserAppointments called ===');
    console.log('User:', req.user);

    let appointments;

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user._id });
      if (!patient) {
        return res.status(404).json({ message: 'Patient profile not found' });
      }
      appointments = await Appointment.find({ patient: patient._id })
        .populate('doctor')
        .sort({ appointmentDate: -1 });
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor profile not found' });
      }
      appointments = await Appointment.find({ doctor: doctor._id })
        .populate('patient')
        .sort({ appointmentDate: 1 });
    } else {
      appointments = await Appointment.find()
        .populate('patient')
        .populate('doctor');
    }

    console.log('Found appointments:', appointments.length);
    res.json({ appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: error.message });
  }
};

// Cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = 'cancelled';
    appointment.cancellationReason = req.body.reason || 'Cancelled by user';
    await appointment.save();

    res.json({ message: 'Appointment cancelled successfully', appointment });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();

    res.json({ message: 'Appointment status updated', appointment });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAvailableSlots,
  createAppointment,
  getUserAppointments,
  cancelAppointment,
  updateAppointmentStatus
};