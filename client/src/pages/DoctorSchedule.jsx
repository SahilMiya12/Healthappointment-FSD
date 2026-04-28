import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { appointmentService } from '../services/appointmentService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const DoctorSchedule = () => {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

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
      toast.error('Failed to load schedule')
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
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (time) => time

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

  const filteredAppointments = appointments.filter(apt => 
    new Date(apt.appointmentDate).toISOString().split('T')[0] === selectedDate
  ).sort((a, b) => a.appointmentTime.localeCompare(b.appointmentTime))

  const stats = {
    today: appointments.filter(apt => 
      new Date(apt.appointmentDate).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
    ).length,
    upcoming: appointments.filter(apt => 
      new Date(apt.appointmentDate) > new Date() && apt.status !== 'cancelled'
    ).length,
    completed: appointments.filter(apt => apt.status === 'completed').length,
    total: appointments.length
  }

  if (loading) return <LoadingSpinner />

  return (
    <div style={{ padding: '2rem 0', background: '#F8FAFC', minHeight: 'calc(100vh - 80px - 300px)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', color: '#2C3E50', marginBottom: '0.5rem' }}>
            My Schedule
          </h1>
          <p style={{ color: '#7F8C8D' }}>Manage your appointments and patient consultations</p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: '#2A5C7F', fontWeight: '700' }}>{stats.today}</div>
            <div style={{ color: '#7F8C8D' }}>Today's Patients</div>
          </div>
          <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: '#3498DB', fontWeight: '700' }}>{stats.upcoming}</div>
            <div style={{ color: '#7F8C8D' }}>Upcoming</div>
          </div>
          <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: '#27AE60', fontWeight: '700' }}>{stats.completed}</div>
            <div style={{ color: '#7F8C8D' }}>Completed</div>
          </div>
          <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: '#7F8C8D', fontWeight: '700' }}>{stats.total}</div>
            <div style={{ color: '#7F8C8D' }}>Total</div>
          </div>
        </div>

        {/* Date Selector */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <label style={{ fontWeight: '500', marginRight: '0.5rem' }}>Select Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                padding: '0.5rem',
                border: '2px solid #E0E0E0',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}
            />
          </div>
          <div style={{ color: '#7F8C8D' }}>
            <i className="fas fa-calendar-alt"></i> {filteredAppointments.length} appointments on this day
          </div>
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem',
            background: 'white',
            borderRadius: '12px'
          }}>
            <i className="fas fa-calendar-times" style={{ fontSize: '3rem', color: '#E0E0E0' }}></i>
            <h3 style={{ marginTop: '1rem', color: '#2C3E50' }}>No appointments scheduled</h3>
            <p style={{ color: '#7F8C8D' }}>No appointments found for this date</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {filteredAppointments.map((apt) => (
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
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    background: '#2A5C7F20',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2A5C7F',
                    fontSize: '1.2rem'
                  }}>
                    <i className="fas fa-user"></i>
                  </div>
                  <div>
                    <h4 style={{ margin: 0, color: '#2C3E50' }}>
                      {apt.patient?.user?.name || 'Patient'}
                    </h4>
                    <div style={{ fontSize: '0.85rem', color: '#7F8C8D' }}>
                      {apt.patient?.user?.email || 'No email'} • {apt.patient?.user?.phone || 'No phone'}
                    </div>
                    <div style={{ marginTop: '0.3rem' }}>
                      <span style={{ fontSize: '0.85rem', color: '#2A5C7F' }}>
                        <i className="far fa-clock"></i> {formatTime(apt.appointmentTime)}
                      </span>
                      <span style={{ marginLeft: '1rem', fontSize: '0.85rem', color: '#7F8C8D' }}>
                        <i className="fas fa-stethoscope"></i> {apt.type || 'Consultation'}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {getStatusBadge(apt.status)}
                  <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                    {apt.status === 'scheduled' && (
                      <>
                        <button
                          onClick={() => updateStatus(apt._id, 'confirmed')}
                          style={{
                            padding: '0.3rem 0.8rem',
                            background: '#3498DB',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.75rem'
                          }}
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => updateStatus(apt._id, 'cancelled')}
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
                      </>
                    )}
                    {apt.status === 'confirmed' && (
                      <>
                        <button
                          onClick={() => updateStatus(apt._id, 'completed')}
                          style={{
                            padding: '0.3rem 0.8rem',
                            background: '#27AE60',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.75rem'
                          }}
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => updateStatus(apt._id, 'cancelled')}
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
                      </>
                    )}
                    {apt.status === 'completed' && (
                      <button
                        onClick={() => window.location.href = `/patients/${apt.patient?._id}`}
                        style={{
                          padding: '0.3rem 0.8rem',
                          background: '#2A5C7F',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.75rem'
                        }}
                      >
                        View Records
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorSchedule