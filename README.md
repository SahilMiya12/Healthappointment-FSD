# 🏥 Healthcare Appointment & Records System

A comprehensive web-based healthcare management platform that digitizes appointment scheduling, medical records management, and clinic workflows. Built with the MERN stack (MongoDB, Express.js, React, Node.js).

## 📌 Features

### 👤 Patient Features
- Register & Login with JWT authentication
- Browse doctors by specialization
- Book, reschedule, and cancel appointments
- View appointment history and status
- Receive email confirmations and reminders
- View digital prescriptions

### 👨‍⚕️ Doctor Features
- Manage availability (working hours)
- View daily/weekly schedules
- Confirm or cancel appointments
- Create digital prescriptions with medications
- Mark appointments as completed

### 👑 Admin Features
- Complete system overview dashboard
- Manage all appointments
- View all doctors and patients
- Update appointment statuses

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js, CSS3, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Authentication | JWT (JSON Web Tokens) |
| Email | Nodemailer |
| Styling | Custom CSS |

## 🚀 Live Demo

- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:5002`

## 📋 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Patient | `patient@healthcare.com` | `patient123` |
| Doctor | `sarah.johnson@healthcare.com` | `doctor123` |
| Admin | `admin@healthcare.com` | `admin123` |

## 🏗️ Project Structure

Healthappointment-FSD/
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ └── utils/
└── client/
├── src/
│ ├── components/
│ ├── pages/
│ ├── services/
│ └── context/
└── public/



## 🔧 Installation

### Prerequisites
- Node.js (v14+)
- MongoDB installed locally or MongoDB Atlas account

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/SahilMiya12/Healthappointment-FSD.git
cd Healthappointment-FSD/backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5002
MONGODB_URI=mongodb://localhost:27017/healthcare_db
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
EMAIL_ENABLED=false
EOF

# Start backend server
npm run dev


Frontend Setup
bash
# Open new terminal
cd ../client

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5002/api" > .env

# Start frontend
npm run dev
