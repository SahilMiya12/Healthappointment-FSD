import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { appointmentService } from '../../services/appointmentService'
import { userService } from '../../services/userService'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../common/LoadingSpinner'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      
      // Fetch appointments
      const appointmentsRes = await appointmentService.getUserAppointments()
      const appointmentsData = appointmentsRes.appointments || []
      setAppointments(appointmentsData)
      
      // Fetch doctors
      const doctorsRes = await userService.getAllDoctors()
      const doctorsData = doctorsRes.doctors || []
      setDoctors(doctorsData)
      
      // Fetch patients
      try {
        const patientsRes = await userService.getPatients()
        const patientsData = patientsRes.patients || []
        setPatients(patientsData)
      } catch (error) {
        console.log('Error fetching patients:', error)
      }
      
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const updateAppointmentStatus = async (id, status) => {
    try {
      await appointmentService.updateAppointmentStatus(id, status)
      toast.success(`Appointment ${status}`)
      fetchAllData()
    } catch (error) {
      toast.error('Failed to update')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status) => {
    const config = {
      scheduled: { bg: '#27AE60', text: 'Scheduled' },
      confirmed: { bg: '#3498DB', text: 'Confirmed' },
      completed: { bg: '#2C3E50', text: 'Completed' },
      cancelled: { bg: '#E74C3C', text: 'Cancelled' }
    }
    const style = config[status] || { bg: '#7F8C8D', text: status }
    
    return (
      <span style={{
        background: style.bg,
        color: 'white',
        padding: '0.2rem 0.8rem',
        borderRadius: '20px',
        fontSize: '0.7rem'
      }}>
        {style.text}
      </span>
    )
  }

  const stats = {
    totalAppointments: appointments.length,
    todayAppointments: appointments.filter(apt => 
      new Date(apt.appointmentDate).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
    ).length,
    pendingAppointments: appointments.filter(apt => apt.status === 'scheduled').length,
    completedAppointments: appointments.filter(apt => apt.status === 'completed').length,
    cancelledAppointments: appointments.filter(apt => apt.status === 'cancelled').length,
    totalDoctors: doctors.length,
    totalPatients: patients.length
  }

  const filteredAppointments = appointments.filter(apt => 
    new Date(apt.appointmentDate).toISOString().split('T')[0] === selectedDate
  )

  if (loading) return <LoadingSpinner />

  return (
    <div style={{ padding: '2rem 0', background: '#F8FAFC', minHeight: 'calc(100vh - 80px - 300px)' }}>
      <div className="container">
        {/* Welcome Section */}
        <div style={{
          background: 'linear-gradient(135deg, #E74C3C, #C0392B)',
          borderRadius: '16px',
          padding: '2rem',
          color: 'white',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
                Welcome back, {user?.name?.split(' ')[0] || 'Admin'}! 👑
              </h1>
              <p style={{ opacity: 0.9, margin: 0 }}>System overview and management dashboard</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setActiveTab('overview')}
                style={{
                  background: 'white',
                  color: '#E74C3C',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Appointments
              </button>
              <button
                onClick={() => setActiveTab('doctors')}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Doctors
              </button>
              <button
                onClick={() => setActiveTab('patients')}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Patients
              </button>
            </div>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', color: '#2A5C7F', fontWeight: '700' }}>{stats.totalAppointments}</div>
                <div style={{ color: '#7F8C8D', fontSize: '0.85rem' }}>Total Appointments</div>
              </div>
              <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', color: '#3498DB', fontWeight: '700' }}>{stats.todayAppointments}</div>
                <div style={{ color: '#7F8C8D', fontSize: '0.85rem' }}>Today's Appointments</div>
              </div>
              <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', color: '#27AE60', fontWeight: '700' }}>{stats.pendingAppointments}</div>
                <div style={{ color: '#7F8C8D', fontSize: '0.85rem' }}>Pending</div>
              </div>
              <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', color: '#2C3E50', fontWeight: '700' }}>{stats.completedAppointments}</div>
                <div style={{ color: '#7F8C8D', fontSize: '0.85rem' }}>Completed</div>
              </div>
              <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', color: '#E74C3C', fontWeight: '700' }}>{stats.cancelledAppointments}</div>
                <div style={{ color: '#7F8C8D', fontSize: '0.85rem' }}>Cancelled</div>
              </div>
              <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', color: '#2A5C7F', fontWeight: '700' }}>{stats.totalDoctors}</div>
                <div style={{ color: '#7F8C8D', fontSize: '0.85rem' }}>Doctors</div>
              </div>
              <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', color: '#27AE60', fontWeight: '700' }}>{stats.totalPatients}</div>
                <div style={{ color: '#7F8C8D', fontSize: '0.85rem' }}>Patients</div>
              </div>
            </div>

            {/* Recent Appointments */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <h2 style={{ color: '#2C3E50', marginBottom: '1.5rem', fontSize: '1.3rem' }}>
                <i className="fas fa-clock" style={{ marginRight: '0.5rem', color: '#E74C3C' }}></i>
                Recent Appointments
              </h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E0E0E0' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Patient</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Doctor</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Date</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Time</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.slice(0, 5).map((apt) => (
                      <tr key={apt._id} style={{ borderBottom: '1px solid #E0E0E0' }}>
                        <td style={{ padding: '0.75rem' }}>{apt.patient?.user?.name || 'Patient'}</td>
                        <td style={{ padding: '0.75rem' }}>Dr. {apt.doctor?.user?.name || 'Doctor'}</td>
                        <td style={{ padding: '0.75rem' }}>{formatDate(apt.appointmentDate)}</td>
                        <td style={{ padding: '0.75rem' }}>{apt.appointmentTime}</td>
                        <td style={{ padding: '0.75rem' }}>{getStatusBadge(apt.status)}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <select
                            value={apt.status}
                            onChange={(e) => updateAppointmentStatus(apt._id, e.target.value)}
                            style={{
                              padding: '0.3rem',
                              borderRadius: '4px',
                              border: '1px solid #E0E0E0',
                              fontSize: '0.75rem'
                            }}
                          >
                            <option value="scheduled">Scheduled</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                       </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Links */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem'
            }}>
              <Link to="/manage-doctors" style={{
                background: 'white',
                padding: '1.25rem',
                borderRadius: '12px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}>
                <div style={{ width: '45px', height: '45px', background: '#3498DB20', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3498DB' }}>
                  <i className="fas fa-user-md"></i>
                </div>
                <div>
                  <h3 style={{ margin: 0, color: '#2C3E50', fontSize: '1rem' }}>Manage Doctors</h3>
                  <p style={{ margin: '0.2rem 0 0', color: '#7F8C8D', fontSize: '0.8rem' }}>Add or remove doctors</p>
                </div>
              </Link>

              <Link to="/manage-patients" style={{
                background: 'white',
                padding: '1.25rem',
                borderRadius: '12px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}>
                <div style={{ width: '45px', height: '45px', background: '#27AE6020', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#27AE60' }}>
                  <i className="fas fa-users"></i>
                </div>
                <div>
                  <h3 style={{ margin: 0, color: '#2C3E50', fontSize: '1rem' }}>Manage Patients</h3>
                  <p style={{ margin: '0.2rem 0 0', color: '#7F8C8D', fontSize: '0.8rem' }}>View all patients</p>
                </div>
              </Link>

              <Link to="/all-appointments" style={{
                background: 'white',
                padding: '1.25rem',
                borderRadius: '12px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}>
                <div style={{ width: '45px', height: '45px', background: '#E74C3C20', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E74C3C' }}>
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <div>
                  <h3 style={{ margin: 0, color: '#2C3E50', fontSize: '1rem' }}>All Appointments</h3>
                  <p style={{ margin: '0.2rem 0 0', color: '#7F8C8D', fontSize: '0.8rem' }}>View all appointments</p>
                </div>
              </Link>
            </div>
          </>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ margin: 0, color: '#2C3E50' }}>All Appointments</h2>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ padding: '0.5rem', border: '2px solid #E0E0E0', borderRadius: '8px' }}
              />
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E0E0E0' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Patient</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Doctor</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Time</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Actions</th>
                   </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((apt) => (
                    <tr key={apt._id} style={{ borderBottom: '1px solid #E0E0E0' }}>
                      <td style={{ padding: '0.75rem' }}>{apt.patient?.user?.name || 'Patient'}</td>
                      <td style={{ padding: '0.75rem' }}>Dr. {apt.doctor?.user?.name || 'Doctor'}</td>
                      <td style={{ padding: '0.75rem' }}>{formatDate(apt.appointmentDate)}</td>
                      <td style={{ padding: '0.75rem' }}>{apt.appointmentTime}</td>
                      <td style={{ padding: '0.75rem' }}>{getStatusBadge(apt.status)}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <select
                          value={apt.status}
                          onChange={(e) => updateAppointmentStatus(apt._id, e.target.value)}
                          style={{ padding: '0.3rem', borderRadius: '4px', border: '1px solid #E0E0E0' }}
                        >
                          <option value="scheduled">Scheduled</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                     </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Doctors Tab */}
        {activeTab === 'doctors' && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#2C3E50' }}>Doctors List</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E0E0E0' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Name</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Specialization</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Email</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Fee</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Rating</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
                   </tr>
                </thead>
                <tbody>
                  {doctors.map((doc) => (
                    <tr key={doc._id} style={{ borderBottom: '1px solid #E0E0E0' }}>
                      <td style={{ padding: '0.75rem' }}>Dr. {doc.user?.name}</td>
                      <td style={{ padding: '0.75rem' }}>{doc.specialization}</td>
                      <td style={{ padding: '0.75rem' }}>{doc.user?.email}</td>
                      <td style={{ padding: '0.75rem' }}>${doc.consultationFee}</td>
                      <td style={{ padding: '0.75rem' }}>⭐ {doc.rating || 0}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{
                          background: doc.isAvailable ? '#27AE60' : '#E74C3C',
                          color: 'white',
                          padding: '0.2rem 0.8rem',
                          borderRadius: '20px',
                          fontSize: '0.7rem'
                        }}>
                          {doc.isAvailable ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Patients Tab */}
        {activeTab === 'patients' && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#2C3E50' }}>Patients List</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E0E0E0' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Name</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Email</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Phone</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Registered</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Actions</th>
                   </tr>
                </thead>
                <tbody>
                  {patients.map((pat) => (
                    <tr key={pat._id} style={{ borderBottom: '1px solid #E0E0E0' }}>
                      <td style={{ padding: '0.75rem' }}>{pat.user?.name}</td>
                      <td style={{ padding: '0.75rem' }}>{pat.user?.email}</td>
                      <td style={{ padding: '0.75rem' }}>{pat.user?.phone}</td>
                      <td style={{ padding: '0.75rem' }}>{formatDate(pat.createdAt)}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <Link to={`/patients/${pat._id}`} style={{ color: '#2A5C7F', textDecoration: 'none' }}>
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard