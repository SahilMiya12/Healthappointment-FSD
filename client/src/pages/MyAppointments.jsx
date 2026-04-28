import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { appointmentService } from '../services/appointmentService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const MyAppointments = () => {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

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
      month: 'long',
      day: 'numeric'
    })
  }

  const getFilteredAppointments = () => {
    if (filter === 'all') return appointments
    if (filter === 'upcoming') {
      return appointments.filter(apt => 
        new Date(apt.appointmentDate) >= new Date() && 
        apt.status !== 'cancelled'
      )
    }
    if (filter === 'past') {
      return appointments.filter(apt => 
        new Date(apt.appointmentDate) < new Date() || apt.status === 'completed'
      )
    }
    return appointments.filter(apt => apt.status === filter)
  }

  const getStatusBadge = (status) => {
    const config = {
      scheduled: { bg: '#27AE60', text: 'Scheduled', icon: 'fa-calendar-check' },
      confirmed: { bg: '#3498DB', text: 'Confirmed', icon: 'fa-check-circle' },
      completed: { bg: '#2C3E50', text: 'Completed', icon: 'fa-check-double' },
      cancelled: { bg: '#E74C3C', text: 'Cancelled', icon: 'fa-times-circle' }
    }
    const style = config[status] || { bg: '#7F8C8D', text: status, icon: 'fa-question' }
    
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        background: style.bg,
        color: 'white',
        padding: '0.3rem 0.8rem',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '500'
      }}>
        <i className={`fas ${style.icon}`} style={{ fontSize: '0.7rem' }}></i>
        {style.text}
      </span>
    )
  }

  if (loading) return <LoadingSpinner />

  const filteredAppointments = getFilteredAppointments()
  const stats = {
    total: appointments.length,
    upcoming: appointments.filter(apt => new Date(apt.appointmentDate) >= new Date() && apt.status !== 'cancelled').length,
    completed: appointments.filter(apt => apt.status === 'completed').length,
    cancelled: appointments.filter(apt => apt.status === 'cancelled').length
  }

  return (
    <div style={{ padding: '2rem 0', background: '#F8FAFC', minHeight: 'calc(100vh - 80px - 300px)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', color: '#2C3E50', marginBottom: '0.5rem' }}>
            My Appointments
          </h1>
          <p style={{ color: '#7F8C8D' }}>View and manage all your healthcare appointments</p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: '#2A5C7F', fontWeight: '700' }}>{stats.total}</div>
            <div style={{ color: '#7F8C8D', fontSize: '0.9rem' }}>Total Appointments</div>
          </div>
          <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: '#27AE60', fontWeight: '700' }}>{stats.upcoming}</div>
            <div style={{ color: '#7F8C8D', fontSize: '0.9rem' }}>Upcoming</div>
          </div>
          <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: '#3498DB', fontWeight: '700' }}>{stats.completed}</div>
            <div style={{ color: '#7F8C8D', fontSize: '0.9rem' }}>Completed</div>
          </div>
          <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: '#E74C3C', fontWeight: '700' }}>{stats.cancelled}</div>
            <div style={{ color: '#7F8C8D', fontSize: '0.9rem' }}>Cancelled</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          borderBottom: '2px solid #E0E0E0',
          paddingBottom: '0.5rem'
        }}>
          {['all', 'upcoming', 'scheduled', 'confirmed', 'completed', 'past'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '0.5rem 1.25rem',
                background: filter === f ? '#2A5C7F' : 'transparent',
                color: filter === f ? 'white' : '#7F8C8D',
                border: filter === f ? 'none' : '1px solid #E0E0E0',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                textTransform: 'capitalize',
                transition: 'all 0.2s ease'
              }}
            >
              {f === 'past' ? 'Past' : f}
            </button>
          ))}
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}>
            <i className="fas fa-calendar-times" style={{ fontSize: '3rem', color: '#E0E0E0', marginBottom: '1rem' }}></i>
            <h3 style={{ color: '#2C3E50', marginBottom: '0.5rem' }}>No appointments found</h3>
            <p style={{ color: '#7F8C8D', marginBottom: '1.5rem' }}>You haven't booked any appointments yet</p>
            <Link to="/doctors" className="btn btn-primary">Book an Appointment</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {filteredAppointments.map((apt) => {
              const isUpcoming = new Date(apt.appointmentDate) >= new Date() && 
                                ['scheduled', 'confirmed'].includes(apt.status)
              
              return (
                <div
                  key={apt._id}
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <h3 style={{ color: '#2C3E50', margin: 0 }}>
                        Dr. {apt.doctor?.user?.name || apt.doctor?.name || 'Doctor'}
                      </h3>
                      {getStatusBadge(apt.status)}
                    </div>
                    <p style={{ color: '#2A5C7F', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                      {apt.doctor?.specialization || 'General Medicine'}
                    </p>
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                      <span style={{ color: '#7F8C8D', fontSize: '0.85rem' }}>
                        <i className="far fa-calendar" style={{ marginRight: '0.3rem' }}></i>
                        {formatDate(apt.appointmentDate)}
                      </span>
                      <span style={{ color: '#7F8C8D', fontSize: '0.85rem' }}>
                        <i className="far fa-clock" style={{ marginRight: '0.3rem' }}></i>
                        {apt.appointmentTime}
                      </span>
                      <span style={{ color: '#7F8C8D', fontSize: '0.85rem' }}>
                        <i className="fas fa-dollar-sign" style={{ marginRight: '0.3rem' }}></i>
                        ${apt.amount || apt.doctor?.consultationFee || 0}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link
                      to={`/appointments/${apt._id}`}
                      style={{
                        padding: '0.4rem 1rem',
                        background: '#ECF0F1',
                        color: '#2A5C7F',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#2A5C7F'
                        e.currentTarget.style.color = 'white'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#ECF0F1'
                        e.currentTarget.style.color = '#2A5C7F'
                      }}
                    >
                      <i className="fas fa-eye"></i> View
                    </Link>
                    {isUpcoming && (
                      <button
                        onClick={() => handleCancel(apt._id)}
                        style={{
                          padding: '0.4rem 1rem',
                          background: '#FDEBEA',
                          color: '#E74C3C',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#E74C3C'
                          e.currentTarget.style.color = 'white'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#FDEBEA'
                          e.currentTarget.style.color = '#E74C3C'
                        }}
                      >
                        <i className="fas fa-times"></i> Cancel
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyAppointments