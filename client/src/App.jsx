import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import ServiceDetail from './pages/ServiceDetail'
import ContactPage from './pages/ContactPage'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import DoctorList from './pages/DoctorList'
import DoctorProfile from './pages/DoctorProfile'
import PatientsPage from './pages/PatientsPage'
import PatientDetail from './pages/PatientDetail'
import AppointmentBooking from './pages/AppointmentBooking'
import AppointmentDetail from './pages/AppointmentDetail'
import MyAppointments from './pages/MyAppointments'
import PatientDashboard from './components/dashboard/PatientDashboard'
import DoctorDashboard from './components/dashboard/DoctorDashboard'
import AdminDashboard from './components/dashboard/AdminDashboard'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import ProtectedRoute from './components/common/ProtectedRoute'
import { Toaster } from 'react-hot-toast'
import DoctorSchedule from './pages/DoctorSchedule'
import DoctorPatients from './pages/DoctorPatients'
import AdminManageDoctors from './pages/AdminManageDoctors'
import AdminManagePatients from './pages/AdminManagePatients'
import AdminAllAppointments from './pages/AdminAllAppointments'


function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Header />
        <main style={{ minHeight: 'calc(100vh - 80px - 300px)' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:serviceName" element={<ServiceDetail />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/doctors" element={<DoctorList />} />
            <Route path="/doctors/:id" element={<DoctorProfile />} />
            
            {/* Patient Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientDashboard />
              </ProtectedRoute>
            } />
            <Route path="/my-appointments" element={
              <ProtectedRoute allowedRoles={['patient']}>
                <MyAppointments />
              </ProtectedRoute>
            } />
            <Route path="/book-appointment" element={
              <ProtectedRoute allowedRoles={['patient']}>
                <AppointmentBooking />
              </ProtectedRoute>
            } />
            
            {/* Doctor Routes */}
            <Route path="/doctor/dashboard" element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorDashboard />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/patients" element={
              <ProtectedRoute allowedRoles={['admin', 'doctor']}>
                <PatientsPage />
              </ProtectedRoute>
            } />
            <Route path="/patients/:id" element={
              <ProtectedRoute allowedRoles={['admin', 'doctor']}>
                <PatientDetail />
              </ProtectedRoute>
            } />
            
            {/* Common Protected Routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
            <Route path="/appointments/:id" element={
              <ProtectedRoute>
                <AppointmentDetail />
              </ProtectedRoute>
            } />

            <Route path="/my-schedule" element={
  <ProtectedRoute allowedRoles={['doctor']}>
    <DoctorSchedule />
  </ProtectedRoute>
} />

<Route path="/my-patients" element={
  <ProtectedRoute allowedRoles={['doctor']}>
    <DoctorPatients />
  </ProtectedRoute>
} />

// Add these routes for admin
<Route path="/admin/dashboard" element={
  <ProtectedRoute allowedRoles={['admin']}>
    <AdminDashboard />
  </ProtectedRoute>
} />

<Route path="/all-appointments" element={
  <ProtectedRoute allowedRoles={['admin']}>
    <AdminDashboard />
  </ProtectedRoute>
} />

<Route path="/manage-doctors" element={
  <ProtectedRoute allowedRoles={['admin']}>
    <AdminDashboard />
  </ProtectedRoute>
} />

<Route path="/manage-patients" element={
  <ProtectedRoute allowedRoles={['admin']}>
    <AdminDashboard />
  </ProtectedRoute>
} />
<Route path="/manage-doctors" element={
  <ProtectedRoute allowedRoles={['admin']}>
    <AdminManageDoctors />
  </ProtectedRoute>
} />

<Route path="/manage-patients" element={
  <ProtectedRoute allowedRoles={['admin']}>
    <AdminManagePatients />
  </ProtectedRoute>
} />

<Route path="/all-appointments" element={
  <ProtectedRoute allowedRoles={['admin']}>
    <AdminAllAppointments />
  </ProtectedRoute>
} />



          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
    </AuthProvider>
  )
}

export default App