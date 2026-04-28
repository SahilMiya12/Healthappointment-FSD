const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Doctor = require('./models/Doctor');

async function addDoctors() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing doctors
    await Doctor.deleteMany({});
    await User.deleteMany({ role: 'doctor' });
    console.log('Cleared existing doctors');

    // Doctor 1 - Dr. Sarah Johnson (Cardiologist)
    const user1 = await User.create({
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@healthcare.com',
      password: await bcrypt.hash('doctor123', 10),
      phone: '+1 (555) 123-4567',
      role: 'doctor'
    });

    await Doctor.create({
      user: user1._id,
      specialization: 'Cardiology',
      qualification: 'MD, FACC - Harvard Medical School',
      experience: 15,
      consultationFee: 200,
      bio: 'Board-certified cardiologist with over 15 years of experience.',
      languages: ['English', 'Spanish'],
      rating: 4.8,
      totalReviews: 124,
      availability: [
        { 
          day: 'Monday', 
          slots: [
            { startTime: '09:00', endTime: '12:00', isAvailable: true },
            { startTime: '14:00', endTime: '17:00', isAvailable: true }
          ] 
        },
        { 
          day: 'Tuesday', 
          slots: [
            { startTime: '09:00', endTime: '12:00', isAvailable: true },
            { startTime: '14:00', endTime: '17:00', isAvailable: true }
          ] 
        },
        { 
          day: 'Wednesday', 
          slots: [
            { startTime: '09:00', endTime: '12:00', isAvailable: true },
            { startTime: '14:00', endTime: '17:00', isAvailable: true }
          ] 
        },
        { 
          day: 'Thursday', 
          slots: [
            { startTime: '09:00', endTime: '12:00', isAvailable: true },
            { startTime: '14:00', endTime: '17:00', isAvailable: true }
          ] 
        },
        { 
          day: 'Friday', 
          slots: [
            { startTime: '09:00', endTime: '13:00', isAvailable: true }
          ] 
        }
      ]
    });
    console.log('✅ Added Dr. Sarah Johnson (Cardiology)');

    // Doctor 2 - Dr. Michael Chen (Neurologist)
    const user2 = await User.create({
      name: 'Dr. Michael Chen',
      email: 'michael.chen@healthcare.com',
      password: await bcrypt.hash('doctor123', 10),
      phone: '+1 (555) 234-5678',
      role: 'doctor'
    });

    await Doctor.create({
      user: user2._id,
      specialization: 'Neurology',
      qualification: 'MD, PhD - Stanford University',
      experience: 12,
      consultationFee: 250,
      bio: 'Renowned neurologist specializing in stroke care and epilepsy.',
      languages: ['English', 'Mandarin'],
      rating: 4.9,
      totalReviews: 98,
      availability: [
        { 
          day: 'Monday', 
          slots: [
            { startTime: '09:00', endTime: '12:00', isAvailable: true },
            { startTime: '14:00', endTime: '17:00', isAvailable: true }
          ] 
        },
        { 
          day: 'Tuesday', 
          slots: [
            { startTime: '09:00', endTime: '12:00', isAvailable: true },
            { startTime: '14:00', endTime: '17:00', isAvailable: true }
          ] 
        },
        { 
          day: 'Wednesday', 
          slots: [
            { startTime: '09:00', endTime: '12:00', isAvailable: true },
            { startTime: '14:00', endTime: '17:00', isAvailable: true }
          ] 
        },
        { 
          day: 'Thursday', 
          slots: [
            { startTime: '09:00', endTime: '17:00', isAvailable: true }
          ] 
        },
        { 
          day: 'Friday', 
          slots: [
            { startTime: '09:00', endTime: '13:00', isAvailable: true }
          ] 
        }
      ]
    });
    console.log('✅ Added Dr. Michael Chen (Neurology)');

    // Doctor 3 - Dr. Emily Williams (Pediatrician)
    const user3 = await User.create({
      name: 'Dr. Emily Williams',
      email: 'emily.williams@healthcare.com',
      password: await bcrypt.hash('doctor123', 10),
      phone: '+1 (555) 345-6789',
      role: 'doctor'
    });

    await Doctor.create({
      user: user3._id,
      specialization: 'Pediatrics',
      qualification: 'MD, FAAP - Johns Hopkins University',
      experience: 10,
      consultationFee: 150,
      bio: 'Compassionate pediatrician for children of all ages.',
      languages: ['English'],
      rating: 4.7,
      totalReviews: 156,
      availability: [
        { 
          day: 'Monday', 
          slots: [
            { startTime: '10:00', endTime: '13:00', isAvailable: true },
            { startTime: '15:00', endTime: '18:00', isAvailable: true }
          ] 
        },
        { 
          day: 'Tuesday', 
          slots: [
            { startTime: '09:00', endTime: '12:00', isAvailable: true },
            { startTime: '14:00', endTime: '17:00', isAvailable: true }
          ] 
        },
        { 
          day: 'Wednesday', 
          slots: [
            { startTime: '09:00', endTime: '12:00', isAvailable: true },
            { startTime: '14:00', endTime: '17:00', isAvailable: true }
          ] 
        },
        { 
          day: 'Thursday', 
          slots: [
            { startTime: '09:00', endTime: '17:00', isAvailable: true }
          ] 
        },
        { 
          day: 'Friday', 
          slots: [
            { startTime: '09:00', endTime: '13:00', isAvailable: true }
          ] 
        }
      ]
    });
    console.log('✅ Added Dr. Emily Williams (Pediatrics)');

    console.log('\n🎉 All 3 doctors added successfully!');
    console.log('\n📋 Doctor Login Credentials:');
    console.log('Password for all doctors: doctor123');
    console.log('\n📧 Doctor Emails:');
    console.log('1. sarah.johnson@healthcare.com (Cardiology)');
    console.log('2. michael.chen@healthcare.com (Neurology)');
    console.log('3. emily.williams@healthcare.com (Pediatrics)');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addDoctors();