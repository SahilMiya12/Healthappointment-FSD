import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { appointmentService } from '../../services/appointmentService'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../common/LoadingSpinner'
import toast from 'react-hot-toast'

const DoctorDashboard = () => {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await appointmentService.getUserAppointments()
      setAppointments(response.appointments || [])
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await appointmentService.updateAppointmentStatus(id, status)
      toast.success(`Appointment ${status}`)
      fetchAppointments()
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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

  const today = new Date().toISOString().split('T')[0]
  const todayAppointments = appointments.filter(apt => 
    new Date(apt.appointmentDate).toISOString().split('T')[0] === today &&
    apt.status !== 'cancelled'
  ).sort((a, b) => a.appointmentTime.localeCompare(b.appointmentTime))

  const upcomingAppointments = appointments.filter(apt => 
    new Date(apt.appointmentDate) > new Date() && 
    apt.status !== 'cancelled'
  ).slice(0, 5)

  const stats = {
    today: todayAppointments.length,
    upcoming: upcomingAppointments.length,
    completed: appointments.filter(apt => apt.status === 'completed').length,
    total: appointments.length
  }

  if (loading) return <LoadingSpinner />

  return (
    <div style={{ padding: '2rem 0', background: '#F8FAFC', minHeight: 'calc(100vh - 80px - 300px)' }}>
      <div className="container">
        {/* Welcome Section */}
        <div style={{
          background: 'linear-gradient(135deg, #2A5C7F, #4A90E2)',
          borderRadius: '16px',
          padding: '2rem',
          color: 'white',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
                Welcome back, Dr. {user?.name?.split(' ')[1] || user?.name?.split(' ')[0]}! 👨‍⚕️
              </h1>
              <p style={{ opacity: 0.9, margin: 0 }}>Here's your daily schedule and patient appointments</p>
            </div>
            <Link to="/my-schedule" style={{
              background: 'white',
              color: '#2A5C7F',
              padding: '0.75rem 1.5rem',
              borderRadius: '30px',
              textDecoration: 'none',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <i className="fas fa-calendar-alt"></i>
              View Full Schedule
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '50px', height: '50px', background: '#2A5C7F20', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2A5C7F', fontSize: '1.5rem' }}>
              <i className="fas fa-calendar-day"></i>
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', margin: 0, color: '#2C3E50' }}>{stats.today}</h3>
              <p style={{ margin: 0, color: '#7F8C8D' }}>Today's Patients</p>
            </div>
          </div>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '50px', height: '50px', background: '#3498DB20', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3498DB', fontSize: '1.5rem' }}>
              <i className="fas fa-clock"></i>
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', margin: 0, color: '#2C3E50' }}>{stats.upcoming}</h3>
              <p style={{ margin: 0, color: '#7F8C8D' }}>Upcoming</p>
            </div>
          </div>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '50px', height: '50px', background: '#27AE6020', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#27AE60', fontSize: '1.5rem' }}>
              <i className="fas fa-check-circle"></i>
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', margin: 0, color: '#2C3E50' }}>{stats.completed}</h3>
              <p style={{ margin: 0, color: '#7F8C8D' }}>Completed</p>
            </div>
          </div>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '50px', height: '50px', background: '#7F8C8D20', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7F8C8D', fontSize: '1.5rem' }}>
              <i className="fas fa-users"></i>
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', margin: 0, color: '#2C3E50' }}>{stats.total}</h3>
              <p style={{ margin: 0, color: '#7F8C8D' }}>Total Patients</p>
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#2C3E50', marginBottom: '1.5rem', fontSize: '1.3rem' }}>
            <i className="fas fa-calendar-day" style={{ marginRight: '0.5rem', color: '#2A5C7F' }}></i>
            Today's Schedule - {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h2>

          {todayAppointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <i className="fas fa-coffee" style={{ fontSize: '3rem', color: '#E0E0E0', marginBottom: '1rem' }}></i>
              <p style={{ color: '#7F8C8D' }}>No appointments scheduled for today. Enjoy your day!</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E0E0E0' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#7F8C8D' }}>Time</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#7F8C8D' }}>Patient</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#7F8C8D' }}>Contact</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#7F8C8D' }}>Type</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#7F8C8D' }}>Status</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#7F8C8D' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {todayAppointments.map((apt) => (
                    <tr key={apt._id} style={{ borderBottom: '1px solid #E0E0E0' }}>
                      <td style={{ padding: '0.75rem', fontWeight: '500' }}>{apt.appointmentTime}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <strong>{apt.patient?.user?.name || 'Patient'}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#7F8C8D' }}>{apt.patient?.user?.email}</div>
                      </td>
                      <td style={{ padding: '0.75rem' }}>{apt.patient?.user?.phone || 'N/A'}</td>
                      <td style={{ padding: '0.75rem', textTransform: 'capitalize' }}>{apt.type || 'Consultation'}</td>
                      <td style={{ padding: '0.75rem' }}>{getStatusBadge(apt.status)}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {apt.status === 'scheduled' && (
                            <>
                              <button onClick={() => updateStatus(apt._id, 'confirmed')} style={{ padding: '0.3rem 0.8rem', background: '#3498DB', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }}>Confirm</button>
                              <button onClick={() => updateStatus(apt._id, 'cancelled')} style={{ padding: '0.3rem 0.8rem', background: '#E74C3C', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }}>Cancel</button>
                            </>
                          )}
                          {apt.status === 'confirmed' && (
                            <>
                              <button onClick={() => updateStatus(apt._id, 'completed')} style={{ padding: '0.3rem 0.8rem', background: '#27AE60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }}>Complete</button>
                              <button onClick={() => updateStatus(apt._id, 'cancelled')} style={{ padding: '0.3rem 0.8rem', background: '#E74C3C', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }}>Cancel</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          <Link to="/my-schedule" style={{
            background: 'white',
            padding: '1.25rem',
            borderRadius: '12px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ width: '45px', height: '45px', background: '#3498DB20', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3498DB' }}>
              <i className="fas fa-calendar-week"></i>
            </div>
            <div>
              <h3 style={{ margin: 0, color: '#2C3E50', fontSize: '1rem' }}>My Schedule</h3>
              <p style={{ margin: '0.2rem 0 0', color: '#7F8C8D', fontSize: '0.8rem' }}>View all appointments</p>
            </div>
          </Link>

          <Link to="/my-patients" style={{
            background: 'white',
            padding: '1.25rem',
            borderRadius: '12px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ width: '45px', height: '45px', background: '#27AE6020', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#27AE60' }}>
              <i className="fas fa-users"></i>
            </div>
            <div>
              <h3 style={{ margin: 0, color: '#2C3E50', fontSize: '1rem' }}>My Patients</h3>
              <p style={{ margin: '0.2rem 0 0', color: '#7F8C8D', fontSize: '0.8rem' }}>View patient history</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard