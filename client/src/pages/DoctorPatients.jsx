import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { userService } from '../services/userService'
import { appointmentService } from '../services/appointmentService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const DoctorPatients = () => {
  const { user } = useAuth()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      setLoading(true)
      // Get all appointments to find unique patients
      const response = await appointmentService.getUserAppointments()
      const appointments = response.appointments || []
      
      // Extract unique patients from appointments
      const uniquePatients = {}
      appointments.forEach(apt => {
        if (apt.patient && apt.patient.user) {
          const patientId = apt.patient._id
          if (!uniquePatients[patientId]) {
            uniquePatients[patientId] = {
              _id: patientId,
              name: apt.patient.user.name,
              email: apt.patient.user.email,
              phone: apt.patient.user.phone,
              appointments: [],
              lastVisit: apt.appointmentDate,
              totalVisits: 1
            }
          } else {
            uniquePatients[patientId].totalVisits++
            if (new Date(apt.appointmentDate) > new Date(uniquePatients[patientId].lastVisit)) {
              uniquePatients[patientId].lastVisit = apt.appointmentDate
            }
          }
          uniquePatients[patientId].appointments.push(apt)
        }
      })
      
      setPatients(Object.values(uniquePatients))
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to load patients')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredPatients = patients.filter(patient =>
    patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone?.includes(searchTerm)
  )

  if (loading) return <LoadingSpinner />

  return (
    <div style={{ padding: '2rem 0', background: '#F8FAFC', minHeight: 'calc(100vh - 80px - 300px)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', color: '#2C3E50', marginBottom: '0.5rem' }}>
            My Patients
          </h1>
          <p style={{ color: '#7F8C8D' }}>View and manage all your patients</p>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: '#2A5C7F', fontWeight: '700' }}>{patients.length}</div>
            <div style={{ color: '#7F8C8D' }}>Total Patients</div>
          </div>
          <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: '#27AE60', fontWeight: '700' }}>
              {patients.reduce((sum, p) => sum + p.totalVisits, 0)}
            </div>
            <div style={{ color: '#7F8C8D' }}>Total Consultations</div>
          </div>
        </div>

        {/* Search */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ position: 'relative' }}>
            <i className="fas fa-search" style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#7F8C8D'
            }}></i>
            <input
              type="text"
              placeholder="Search patients by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem 1rem 0.8rem 2.5rem',
                border: '2px solid #E0E0E0',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}
            />
          </div>
        </div>

        {/* Patients List */}
        {filteredPatients.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem',
            background: 'white',
            borderRadius: '12px'
          }}>
            <i className="fas fa-users" style={{ fontSize: '3rem', color: '#E0E0E0' }}></i>
            <h3 style={{ marginTop: '1rem', color: '#2C3E50' }}>No patients found</h3>
            <p style={{ color: '#7F8C8D' }}>You haven't had any appointments yet</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {filteredPatients.map((patient) => (
              <div
                key={patient._id}
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
                    <i className="fas fa-user-circle"></i>
                  </div>
                  <div>
                    <h4 style={{ margin: 0, color: '#2C3E50' }}>{patient.name}</h4>
                    <div style={{ fontSize: '0.85rem', color: '#7F8C8D' }}>
                      {patient.email} • {patient.phone}
                    </div>
                    <div style={{ marginTop: '0.3rem', fontSize: '0.8rem', color: '#2A5C7F' }}>
                      <i className="fas fa-calendar-alt"></i> Last visit: {formatDate(patient.lastVisit)} • {patient.totalVisits} visits
                    </div>
                  </div>
                </div>
                <div>
                  <Link
                    to={`/patients/${patient._id}`}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#2A5C7F',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <i className="fas fa-chart-line"></i> View History
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorPatients