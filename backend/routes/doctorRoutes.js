const express = require('express');
const router = express.Router();
const { 
  getAllDoctors,
  getDoctorById,
  getMyDoctorProfile,
  updateDoctorProfile,
  updateAvailability,
  getAvailability,
  getDoctorAppointments
} = require('../controllers/doctorController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public routes
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);

// Protected routes (require authentication)
router.use(protect);

// Doctor only routes
router.get('/my/profile', authorize('doctor'), getMyDoctorProfile);
router.put('/my/profile', authorize('doctor'), updateDoctorProfile);
router.get('/my/availability', authorize('doctor'), getAvailability);
router.put('/my/availability', authorize('doctor'), updateAvailability);
router.get('/my/appointments', authorize('doctor'), getDoctorAppointments);

module.exports = router;