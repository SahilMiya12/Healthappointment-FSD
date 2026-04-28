import { useState, useEffect } from 'react'
import { appointmentService } from '../services/appointmentService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const AdminAllAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedDate, setSelectedDate] = useState('')

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

  const updateStatus = async (id, status) => {
    try {
      await appointmentService.updateAppointmentStatus(id, status)
      toast.success(`Appointment ${status}`)
      fetchAppointments()
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

  const getFilteredAppointments = () => {
    let filtered = appointments
    if (filter !== 'all') {
      filtered = filtered.filter(apt => apt.status === filter)
    }
    if (selectedDate) {
      filtered = filtered.filter(apt => 
        new Date(apt.appointmentDate).toISOString().split('T')[0] === selectedDate
      )
    }
    return filtered
  }

  const stats = {
    total: appointments.length,
    scheduled: appointments.filter(apt => apt.status === 'scheduled').length,
    confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
    completed: appointments.filter(apt => apt.status === 'completed').length,
    cancelled: appointments.filter(apt => apt.status === 'cancelled').length
  }

  if (loading) return <LoadingSpinner />

  return (
    <div style={{ padding: '2rem 0', background: '#F8FAFC', minHeight: 'calc(100vh - 80px - 300px)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', color: '#2C3E50', marginBottom: '0.5rem' }}>
            All Appointments
          </h1>
          <p style={{ color: '#7F8C8D' }}>View and manage all appointments in the system</p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2A5C7F' }}>{stats.total}</div>
            <div style={{ fontSize: '0.8rem', color: '#7F8C8D' }}>Total</div>
          </div>
          <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#27AE60' }}>{stats.scheduled}</div>
            <div style={{ fontSize: '0.8rem', color: '#7F8C8D' }}>Scheduled</div>
          </div>
          <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#3498DB' }}>{stats.confirmed}</div>
            <div style={{ fontSize: '0.8rem', color: '#7F8C8D' }}>Confirmed</div>
          </div>
          <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2C3E50' }}>{stats.completed}</div>
            <div style={{ fontSize: '0.8rem', color: '#7F8C8D' }}>Completed</div>
          </div>
          <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#E74C3C' }}>{stats.cancelled}</div>
            <div style={{ fontSize: '0.8rem', color: '#7F8C8D' }}>Cancelled</div>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={() => setFilter('all')} style={{ padding: '0.3rem 1rem', background: filter === 'all' ? '#2A5C7F' : '#ECF0F1', color: filter === 'all' ? 'white' : '#333', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>All</button>
            <button onClick={() => setFilter('scheduled')} style={{ padding: '0.3rem 1rem', background: filter === 'scheduled' ? '#27AE60' : '#ECF0F1', color: filter === 'scheduled' ? 'white' : '#333', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>Scheduled</button>
            <button onClick={() => setFilter('confirmed')} style={{ padding: '0.3rem 1rem', background: filter === 'confirmed' ? '#3498DB' : '#ECF0F1', color: filter === 'confirmed' ? 'white' : '#333', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>Confirmed</button>
            <button onClick={() => setFilter('completed')} style={{ padding: '0.3rem 1rem', background: filter === 'completed' ? '#2C3E50' : '#ECF0F1', color: filter === 'completed' ? 'white' : '#333', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>Completed</button>
            <button onClick={() => setFilter('cancelled')} style={{ padding: '0.3rem 1rem', background: filter === 'cancelled' ? '#E74C3C' : '#ECF0F1', color: filter === 'cancelled' ? 'white' : '#333', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>Cancelled</button>
          </div>
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={{ padding: '0.4rem', border: '2px solid #E0E0E0', borderRadius: '8px' }} />
        </div>

        {/* Appointments Table */}
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E0E0E0' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Patient</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Doctor</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Time</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
                 </tr>
              </thead>
              <tbody>
                {getFilteredAppointments().map((apt) => (
                  <tr key={apt._id} style={{ borderBottom: '1px solid #E0E0E0' }}>
                    <td style={{ padding: '1rem' }}>{apt.patient?.user?.name || 'Patient'}</td>
                    <td style={{ padding: '1rem' }}>Dr. {apt.doctor?.user?.name || 'Doctor'}</td>
                    <td style={{ padding: '1rem' }}>{formatDate(apt.appointmentDate)}</td>
                    <td style={{ padding: '1rem' }}>{apt.appointmentTime}</td>
                    <td style={{ padding: '1rem' }}>{getStatusBadge(apt.status)}</td>
                    <td style={{ padding: '1rem' }}>
                      <select
                        value={apt.status}
                        onChange={(e) => updateStatus(apt._id, e.target.value)}
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
      </div>
    </div>
  )
}

export default AdminAllAppointments