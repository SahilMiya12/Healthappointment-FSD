const express = require('express');
const Appointment = require('../models/Appointment');
const router = express.Router();
const { 
  createAppointment,
  getUserAppointments,
  getAppointmentById,
  cancelAppointment,
  updateAppointmentStatus,
  getAvailableSlots
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

// Public route - no authentication needed
router.get('/slots/:doctorId', getAvailableSlots);

// Protected routes - require authentication
router.use(protect);
router.post('/', createAppointment);
router.get('/my', getUserAppointments);
router.put('/:id/cancel', cancelAppointment);
router.put('/:id/status', updateAppointmentStatus);

// Get single appointment by ID
router.get('/:id', async (req, res) => {
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
});

module.exports = router;