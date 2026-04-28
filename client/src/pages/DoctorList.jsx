import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { userService } from '../services/userService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const DoctorList = () => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [specialization, setSpecialization] = useState('')

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      setLoading(true)
      const response = await userService.getAllDoctors()
      console.log('Doctors response:', response) // Debug log
      
      // Handle different response formats
      const doctorsData = response.doctors || response || []
      setDoctors(doctorsData)
    } catch (error) {
      console.error('Error fetching doctors:', error)
      toast.error('Failed to load doctors')
    } finally {
      setLoading(false)
    }
  }

  const getSpecializations = () => {
    const specs = doctors.map(d => d.specialization).filter(Boolean)
    return [...new Set(specs)]
  }

  const filteredDoctors = specialization
    ? doctors.filter(d => d.specialization === specialization)
    : doctors

  if (loading) return <LoadingSpinner />

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '2.5rem', color: '#2C3E50', marginBottom: '1rem' }}>
          Our Doctors
        </h1>
        <p style={{ color: '#7F8C8D', marginBottom: '2rem' }}>
          Meet our team of experienced healthcare professionals
        </p>

        {doctors.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              style={{
                padding: '0.8rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                width: '300px',
                fontSize: '1rem'
              }}
            >
              <option value="">All Specializations</option>
              {getSpecializations().map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
        )}

        {doctors.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <i className="fas fa-user-md" style={{ fontSize: '4rem', color: '#E0E0E0', marginBottom: '1rem' }}></i>
            <h3 style={{ color: '#2C3E50', marginBottom: '0.5rem' }}>No Doctors Found</h3>
            <p style={{ color: '#7F8C8D' }}>Please check back later or contact administration.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {filteredDoctors.map(doctor => (
              <Link
                key={doctor._id || doctor.id}
                to={`/doctors/${doctor._id || doctor.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  height: '100%'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: '#ECF0F1',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                    fontSize: '2.5rem',
                    color: '#2A5C7F'
                  }}>
                    <i className="fas fa-user-md"></i>
                  </div>
                  <h3 style={{ color: '#2C3E50', marginBottom: '0.5rem', textAlign: 'center' }}>
                    {doctor.user?.name || doctor.name || 'Doctor'}
                  </h3>
                  <p style={{ color: '#2A5C7F', fontWeight: '500', textAlign: 'center', marginBottom: '0.5rem' }}>
                    {doctor.specialization || 'General Medicine'}
                  </p>
                  <p style={{ color: '#7F8C8D', textAlign: 'center', marginBottom: '0.5rem' }}>
                    {doctor.experience || 0} years experience
                  </p>
                  <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className="fas fa-star"
                        style={{
                          color: i < Math.floor(doctor.rating || 0) ? '#F39C12' : '#E0E0E0',
                          marginRight: '2px'
                        }}
                      ></i>
                    ))}
                    <span style={{ color: '#7F8C8D', marginLeft: '0.5rem' }}>
                      ({doctor.rating || 0})
                    </span>
                  </div>
                  <p style={{ color: '#2A5C7F', fontWeight: '600', textAlign: 'center' }}>
                    ${doctor.consultationFee || 0} consultation
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorList