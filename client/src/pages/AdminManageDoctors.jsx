import { useState, useEffect } from 'react'
import { userService } from '../services/userService'
import { appointmentService } from '../services/appointmentService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const AdminManageDoctors = () => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    specialization: '',
    qualification: '',
    experience: '',
    consultationFee: ''
  })

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      setLoading(true)
      const response = await userService.getAllDoctors()
      setDoctors(response.doctors || [])
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to load doctors')
    } finally {
      setLoading(false)
    }
  }

  const handleAddDoctor = async (e) => {
    e.preventDefault()
    try {
      // This would call an API to register a new doctor
      toast.success('Doctor added successfully')
      setShowAddModal(false)
      fetchDoctors()
    } catch (error) {
      toast.error('Failed to add doctor')
    }
  }

  const toggleDoctorStatus = async (doctorId, currentStatus) => {
    try {
      // This would call an API to update doctor status
      toast.success(`Doctor ${currentStatus ? 'deactivated' : 'activated'}`)
      fetchDoctors()
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div style={{ padding: '2rem 0', background: '#F8FAFC', minHeight: 'calc(100vh - 80px - 300px)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', color: '#2C3E50', marginBottom: '0.5rem' }}>
              Manage Doctors
            </h1>
            <p style={{ color: '#7F8C8D' }}>Add, edit, or remove doctors from the system</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background: '#2A5C7F',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <i className="fas fa-plus"></i> Add New Doctor
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: '#2A5C7F', fontWeight: '700' }}>{doctors.length}</div>
            <div style={{ color: '#7F8C8D' }}>Total Doctors</div>
          </div>
          <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: '#27AE60', fontWeight: '700' }}>
              {doctors.filter(d => d.isAvailable !== false).length}
            </div>
            <div style={{ color: '#7F8C8D' }}>Active Doctors</div>
          </div>
        </div>

        {/* Doctors List */}
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E0E0E0' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Doctor</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Specialization</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Phone</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Fee</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
                 </tr>
              </thead>
              <tbody>
                {doctors.map((doctor) => (
                  <tr key={doctor._id} style={{ borderBottom: '1px solid #E0E0E0' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: '500' }}>Dr. {doctor.user?.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#7F8C8D' }}>{doctor.qualification}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>{doctor.specialization}</td>
                    <td style={{ padding: '1rem' }}>{doctor.user?.email}</td>
                    <td style={{ padding: '1rem' }}>{doctor.user?.phone}</td>
                    <td style={{ padding: '1rem' }}>${doctor.consultationFee}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        background: doctor.isAvailable !== false ? '#27AE60' : '#E74C3C',
                        color: 'white',
                        padding: '0.2rem 0.8rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem'
                      }}>
                        {doctor.isAvailable !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button
                        onClick={() => toggleDoctorStatus(doctor._id, doctor.isAvailable)}
                        style={{
                          padding: '0.3rem 0.8rem',
                          background: doctor.isAvailable !== false ? '#E74C3C' : '#27AE60',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.75rem'
                        }}
                      >
                        {doctor.isAvailable !== false ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Doctor Modal */}
        {showAddModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              width: '90%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Add New Doctor</h2>
              <form onSubmit={handleAddDoctor}>
                <input type="text" placeholder="Full Name" style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', border: '2px solid #E0E0E0', borderRadius: '8px' }}
                  onChange={(e) => setNewDoctor({...newDoctor, name: e.target.value})} required />
                <input type="email" placeholder="Email" style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', border: '2px solid #E0E0E0', borderRadius: '8px' }}
                  onChange={(e) => setNewDoctor({...newDoctor, email: e.target.value})} required />
                <input type="password" placeholder="Password" style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', border: '2px solid #E0E0E0', borderRadius: '8px' }}
                  onChange={(e) => setNewDoctor({...newDoctor, password: e.target.value})} required />
                <input type="tel" placeholder="Phone" style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', border: '2px solid #E0E0E0', borderRadius: '8px' }}
                  onChange={(e) => setNewDoctor({...newDoctor, phone: e.target.value})} required />
                <input type="text" placeholder="Specialization" style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', border: '2px solid #E0E0E0', borderRadius: '8px' }}
                  onChange={(e) => setNewDoctor({...newDoctor, specialization: e.target.value})} required />
                <input type="text" placeholder="Qualification" style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', border: '2px solid #E0E0E0', borderRadius: '8px' }}
                  onChange={(e) => setNewDoctor({...newDoctor, qualification: e.target.value})} required />
                <input type="number" placeholder="Experience (years)" style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', border: '2px solid #E0E0E0', borderRadius: '8px' }}
                  onChange={(e) => setNewDoctor({...newDoctor, experience: e.target.value})} />
                <input type="number" placeholder="Consultation Fee ($)" style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', border: '2px solid #E0E0E0', borderRadius: '8px' }}
                  onChange={(e) => setNewDoctor({...newDoctor, consultationFee: e.target.value})} required />
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" style={{ flex: 1, padding: '0.8rem', background: '#27AE60', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Add Doctor</button>
                  <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '0.8rem', background: '#E74C3C', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminManageDoctors