import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { appointmentService } from '../services/appointmentService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const AppointmentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('AppointmentDetail page loaded, ID:', id)
    fetchAppointment()
  }, [id])

  const fetchAppointment = async () => {
    try {
      setLoading(true)
      console.log('Fetching appointment with ID:', id)
      const response = await appointmentService.getAppointmentById(id)
      console.log('Appointment response:', response)
      setAppointment(response)
    } catch (error) {
      console.error('Error fetching appointment:', error)
      toast.error('Failed to load appointment details')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return
    }
    
    try {
      await appointmentService.cancelAppointment(id, 'Cancelled by patient')
      toast.success('Appointment cancelled successfully')
      fetchAppointment()
    } catch (error) {
      toast.error('Failed to cancel appointment')
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'scheduled': return '#27AE60'
      case 'confirmed': return '#3498DB'
      case 'completed': return '#2C3E50'
      case 'cancelled': return '#E74C3C'
      default: return '#7F8C8D'
    }
  }

  const getStatusText = (status) => {
    switch(status) {
      case 'scheduled': return 'Scheduled'
      case 'confirmed': return 'Confirmed'
      case 'completed': return 'Completed'
      case 'cancelled': return 'Cancelled'
      default: return status || 'Unknown'
    }
  }

  if (loading) return <LoadingSpinner />

  if (!appointment) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Appointment not found</h2>
        <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Dashboard
        </Link>
      </div>
    )
  }

  const isUpcoming = new Date(appointment.appointmentDate) >= new Date() && 
                    ['scheduled', 'confirmed'].includes(appointment.status)

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Link
            to="/dashboard"
            style={{
              display: 'inline-block',
              marginBottom: '2rem',
              color: '#2A5C7F',
              textDecoration: 'none'
            }}
          >
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </Link>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <h1 style={{ color: '#2C3E50', margin: 0 }}>Appointment Details</h1>
              <span style={{
                background: getStatusColor(appointment.status),
                color: 'white',
                padding: '0.5rem 2rem',
                borderRadius: '30px',
                fontWeight: '500',
                textTransform: 'capitalize'
              }}>
                {getStatusText(appointment.status)}
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              <div>
                <h3 style={{ color: '#2A5C7F', marginBottom: '1rem' }}>
                  <i className="fas fa-user-md"></i> Doctor Information
                </h3>
                <p><strong>Name:</strong> Dr. {appointment.doctor?.user?.name || appointment.doctor?.name || 'N/A'}</p>
                <p><strong>Specialization:</strong> {appointment.doctor?.specialization || 'General'}</p>
                <p><strong>Consultation Fee:</strong> ${appointment.amount || appointment.doctor?.consultationFee || 0}</p>
              </div>

              <div>
                <h3 style={{ color: '#2A5C7F', marginBottom: '1rem' }}>
                  <i className="fas fa-calendar-alt"></i> Appointment Information
                </h3>
                <p><strong>Date:</strong> {formatDate(appointment.appointmentDate)}</p>
                <p><strong>Time:</strong> {appointment.appointmentTime}</p>
                <p><strong>Type:</strong> <span style={{ textTransform: 'capitalize' }}>{appointment.type || 'Consultation'}</span></p>
                <p><strong>Booked On:</strong> {new Date(appointment.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div style={{
              background: '#F8FAFC',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '2rem'
            }}>
              <h4 style={{ color: '#2C3E50', marginBottom: '1rem' }}>
                <i className="fas fa-notes-medical"></i> Reason for Visit
              </h4>
              <p style={{ color: '#7F8C8D', lineHeight: '1.6' }}>{appointment.reason || 'No reason provided'}</p>
            </div>

            {isUpcoming && (
              <button
                onClick={handleCancel}
                className="btn btn-danger"
                style={{ width: '100%', padding: '1rem' }}
              >
                <i className="fas fa-times"></i> Cancel Appointment
              </button>
            )}

            {appointment.status === 'cancelled' && (
              <div style={{
                background: '#FDEBEA',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center',
                color: '#E74C3C'
              }}>
                <i className="fas fa-info-circle"></i> This appointment has been cancelled
                {appointment.cancellationReason && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                    Reason: {appointment.cancellationReason}
                  </div>
                )}
              </div>
            )}

            {appointment.status === 'completed' && (
              <div style={{
                background: '#E8F8F5',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center',
                color: '#27AE60'
              }}>
                <i className="fas fa-check-circle"></i> This appointment has been completed
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppointmentDetail