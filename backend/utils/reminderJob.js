const cron = require('node-cron');
const { sendAppointmentReminder } = require('./emailService');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

const startReminderJob = () => {
  // Run every hour
  cron.schedule('0 * * * *', async () => {
    console.log('🕐 Running reminder check...');
    
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const dayAfter = new Date(tomorrow);
      dayAfter.setDate(dayAfter.getDate() + 1);
      
      const appointments = await Appointment.find({
        appointmentDate: { $gte: tomorrow, $lt: dayAfter },
        status: { $in: ['scheduled', 'confirmed'] }
      });
      
      console.log(`📋 Found ${appointments.length} appointments for tomorrow`);
      
      for (const apt of appointments) {
        const patient = await Patient.findById(apt.patient).populate('user');
        const doctor = await Doctor.findById(apt.doctor).populate('user');
        
        if (patient && patient.user && patient.user.email && doctor && doctor.user) {
          await sendAppointmentReminder(
            patient.user.email,
            patient.user.name,
            doctor.user.name,
            apt.appointmentDate,
            apt.appointmentTime
          );
        }
      }
    } catch (error) {
      console.error('❌ Reminder job error:', error.message);
    }
  });
  
  console.log('✅ Reminder job started - will check every hour');
};

module.exports = startReminderJob;