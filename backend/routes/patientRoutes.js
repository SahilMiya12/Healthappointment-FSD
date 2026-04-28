const express = require('express');
const router = express.Router();
const { getPatientById } = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:id', protect, getPatientById);

module.exports = router;