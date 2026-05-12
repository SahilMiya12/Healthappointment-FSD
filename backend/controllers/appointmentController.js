const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const User = require('../models/User');
const { sendAppointmentConfirmation, sendAppointmentStatusUpdate } = require('../utils/emailService');

// Get available slots for a doctor
const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;
    
    console.log('=== Getting Available Slots ===');
    console.log('Doctor ID:', doctorId);
    console.log('Date:', date);

    if (!doctorId || !date) {
      return res.status(400).json({ message: 'Doctor ID and date are required' });
    }

    const doctor = await Doctor.findById(doctorId).populate('user', 'name');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const selectedDate = new Date(date);
    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
    
    const dayAvailability = doctor.availability.find(a => a.day === dayName);
    
    if (!dayAvailability) {
      return res.json({ availableSlots: [] });
    }

    // Generate time slots
    const allSlots = [];
    for (const slot of dayAvailability.slots) {
      if (slot.isAvailable) {
        const startHour = parseInt(slot.startTime.split(':')[0]);
        const endHour = parseInt(slot.endTime.split(':')[0]);
        
        for (let hour = startHour; hour < endHour; hour++) {
          const period = hour >= 12 ? 'PM' : 'AM';
          const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
          allSlots.push(`${displayHour}:00 ${period}`);
          allSlots.push(`${displayHour}:30 ${period}`);
        }
      }
    }

    // Get booked appointments
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
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

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

    console.log('=== Creating Appointment ===');
    
    // Find patient
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    // Find doctor
    const doctor = await Doctor.findById(doctorId).populate('user');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check if slot is available
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: { $in: ['scheduled', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patient: patient._id,
      doctor: doctorId,
      appointmentDate,
      appointmentTime,
      type: type || 'consultation',
      reason: reason || 'General consultation',
      symptoms: symptoms || [],
      amount: doctor.consultationFee
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('doctor')
      .populate('patient');

   // In createAppointment function - after appointment is created
// Send email notification
const patientUser = await User.findById(req.user._id);
if (patientUser && patientUser.email) {
  await sendAppointmentConfirmation(
    patientUser.email,
    patientUser.name,
    doctor.user?.name || 'Doctor',
    appointmentDate,
    appointmentTime,
    appointment._id
  );
}
    res.status(201).json(populatedAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get user appointments
const getUserAppointments = async (req, res) => {
  try {
    let appointments;

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user._id });
      if (!patient) {
        return res.status(404).json({ message: 'Patient profile not found' });
      }
      appointments = await Appointment.find({ patient: patient._id })
        .populate('doctor')
        .populate('patient')
        .sort({ appointmentDate: -1 });
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor profile not found' });
      }
      appointments = await Appointment.find({ doctor: doctor._id })
        .populate('patient')
        .populate('doctor')
        .sort({ appointmentDate: 1 });
    } else {
      appointments = await Appointment.find()
        .populate('patient')
        .populate('doctor')
        .sort({ appointmentDate: -1 });
    }

    res.json({ appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get appointment by ID
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient')
      .populate('doctor');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
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
    res.status(500).json({ message: error.message });
  }
};

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient')
      .populate('doctor');
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();

    // Send email notification (don't await, let it run in background)
    const patientUser = await User.findById(appointment.patient?.userId);
    const doctorUser = await User.findById(appointment.doctor?.userId);
    
    if (patientUser && patientUser.email && doctorUser) {
      sendAppointmentStatusUpdate(
        patientUser.email,
        patientUser.name,
        doctorUser.name,
        appointment.appointmentDate,
        appointment.appointmentTime,
        status
      ).catch(err => console.error('Email error:', err));
    }

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
  getAppointmentById,
  cancelAppointment,
  updateAppointmentStatus
};