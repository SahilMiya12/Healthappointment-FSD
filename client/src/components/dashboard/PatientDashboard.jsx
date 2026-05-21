import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { appointmentService } from '../../services/appointmentService'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../common/LoadingSpinner'
import toast from 'react-hot-toast'

const PatientDashboard = () => {
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
      toast.error('Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentService.cancelAppointment(id, 'Cancelled by patient')
        toast.success('Appointment cancelled')
        fetchAppointments()
      } catch (error) {
        toast.error('Failed to cancel')
      }
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
        fontSize: '0.7rem',
        fontWeight: '500'
      }}>
        {style.text}
      </span>
    )
  }

  const stats = {
    total: appointments.length,
    upcoming: appointments.filter(apt => new Date(apt.appointmentDate) >= new Date() && apt.status !== 'cancelled').length,
    completed: appointments.filter(apt => apt.status === 'completed').length,
    cancelled: appointments.filter(apt => apt.status === 'cancelled').length
  }

  const recentAppointments = appointments.slice(0, 5)

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
                Welcome back, {user?.name?.split(' ')[0] || 'Patient'}! 👋
              </h1>
              <p style={{ opacity: 0.9, margin: 0 }}>Here's your health summary and upcoming appointments</p>
            </div>
            <Link to="/book-appointment" style={{
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
              <i className="fas fa-plus-circle"></i>
              Book New Appointment
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
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: '#2A5C7F20',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2A5C7F',
              fontSize: '1.5rem'
            }}>
              <i className="fas fa-calendar-alt"></i>
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', margin: 0, color: '#2C3E50' }}>{stats.total}</h3>
              <p style={{ margin: 0, color: '#7F8C8D', fontSize: '0.85rem' }}>Total Appointments</p>
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: '#27AE6020',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#27AE60',
              fontSize: '1.5rem'
            }}>
              <i className="fas fa-clock"></i>
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', margin: 0, color: '#2C3E50' }}>{stats.upcoming}</h3>
              <p style={{ margin: 0, color: '#7F8C8D', fontSize: '0.85rem' }}>Upcoming</p>
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: '#3498DB20',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3498DB',
              fontSize: '1.5rem'
            }}>
              <i className="fas fa-check-circle"></i>
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', margin: 0, color: '#2C3E50' }}>{stats.completed}</h3>
              <p style={{ margin: 0, color: '#7F8C8D', fontSize: '0.85rem' }}>Completed</p>
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: '#E74C3C20',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#E74C3C',
              fontSize: '1.5rem'
            }}>
              <i className="fas fa-times-circle"></i>
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', margin: 0, color: '#2C3E50' }}>{stats.cancelled}</h3>
              <p style={{ margin: 0, color: '#7F8C8D', fontSize: '0.85rem' }}>Cancelled</p>
            </div>
          </div>
        </div>

        {/* Recent Appointments */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <h2 style={{ color: '#2C3E50', margin: 0, fontSize: '1.3rem' }}>
              <i className="fas fa-list" style={{ marginRight: '0.5rem', color: '#2A5C7F' }}></i>
              Recent Appointments
            </h2>
            <Link to="/my-appointments" style={{ color: '#2A5C7F', textDecoration: 'none' }}>
              View All <i className="fas fa-arrow-right"></i>
            </Link>
          </div>

          {recentAppointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <i className="fas fa-calendar-plus" style={{ fontSize: '3rem', color: '#E0E0E0', marginBottom: '1rem' }}></i>
              <p style={{ color: '#7F8C8D' }}>No appointments yet. Book your first appointment!</p>
              <Link to="/book-appointment" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
                Book Appointment
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E0E0E0' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#7F8C8D', fontWeight: '500' }}>Doctor</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#7F8C8D', fontWeight: '500' }}>Specialization</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#7F8C8D', fontWeight: '500' }}>Date</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#7F8C8D', fontWeight: '500' }}>Time</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#7F8C8D', fontWeight: '500' }}>Status</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#7F8C8D', fontWeight: '500' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAppointments.map((apt) => {
                    const isUpcoming = new Date(apt.appointmentDate) >= new Date() && 
                                      ['scheduled', 'confirmed'].includes(apt.status)
                    
                    return (
                      <tr key={apt._id} style={{ borderBottom: '1px solid #E0E0E0' }}>
                        <td style={{ padding: '0.75rem', fontWeight: '500', color: '#2C3E50' }}>
                          Dr. {apt.doctor?.user?.name || apt.doctor?.name || 'Doctor'}
                        </td>
                        <td style={{ padding: '0.75rem', color: '#2A5C7F' }}>
                          {apt.doctor?.specialization || 'General'}
                        </td>
                        <td style={{ padding: '0.75rem', color: '#333' }}>{formatDate(apt.appointmentDate)}</td>
                        <td style={{ padding: '0.75rem', color: '#333' }}>{apt.appointmentTime}</td>
                        <td style={{ padding: '0.75rem' }}>{getStatusBadge(apt.status)}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Link
                              to={`/appointments/${apt._id}`}
                              style={{
                                padding: '0.3rem 0.8rem',
                                background: '#2A5C7F',
                                color: 'white',
                                textDecoration: 'none',
                                borderRadius: '4px',
                                fontSize: '0.75rem'
                              }}
                            >
                              View
                            </Link>
                            {isUpcoming && (
                              <button
                                onClick={() => handleCancel(apt._id)}
                                style={{
                                  padding: '0.3rem 0.8rem',
                                  background: '#E74C3C',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '0.75rem'
                                }}
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PatientDashboard;