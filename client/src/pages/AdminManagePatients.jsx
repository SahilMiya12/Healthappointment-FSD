import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { userService } from '../services/userService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const AdminManagePatients = () => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      setLoading(true)
      const response = await userService.getPatients()
      setPatients(response.patients || [])
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
    patient.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.user?.phone?.includes(searchTerm)
  )

  if (loading) return <LoadingSpinner />

  return (
    <div style={{ padding: '2rem 0', background: '#F8FAFC', minHeight: 'calc(100vh - 80px - 300px)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', color: '#2C3E50', marginBottom: '0.5rem' }}>
            Manage Patients
          </h1>
          <p style={{ color: '#7F8C8D' }}>View and manage all registered patients</p>
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
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E0E0E0' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Patient</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Phone</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Registered</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
                 </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient._id} style={{ borderBottom: '1px solid #E0E0E0' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: '500' }}>{patient.user?.name}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>{patient.user?.email}</td>
                    <td style={{ padding: '1rem' }}>{patient.user?.phone}</td>
                    <td style={{ padding: '1rem' }}>{formatDate(patient.createdAt)}</td>
                    <td style={{ padding: '1rem' }}>
                      <Link
                        to={`/patients/${patient._id}`}
                        style={{
                          padding: '0.3rem 1rem',
                          background: '#2A5C7F',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '4px',
                          fontSize: '0.8rem'
                        }}
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredPatients.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px', marginTop: '1rem' }}>
            <i className="fas fa-users" style={{ fontSize: '3rem', color: '#E0E0E0' }}></i>
            <h3 style={{ marginTop: '1rem', color: '#2C3E50' }}>No patients found</h3>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminManagePatients