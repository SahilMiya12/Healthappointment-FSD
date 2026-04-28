import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const PatientsPage = () => {
  const { user } = useAuth()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = () => {
    setLoading(true)
    // Mock data - replace with actual API call
    setTimeout(() => {
      const mockPatients = [
        {
          id: 1,
          name: 'John Doe',
          age: 45,
          gender: 'Male',
          bloodGroup: 'O+',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          lastVisit: '2024-02-10',
          condition: 'Hypertension',
          doctor: 'Dr. Sarah Johnson',
          status: 'Active',
          insurance: 'Blue Cross',
          emergencyContact: 'Jane Doe - +1 (555) 123-4568'
        },
        {
          id: 2,
          name: 'Jane Smith',
          age: 32,
          gender: 'Female',
          bloodGroup: 'A-',
          email: 'jane.smith@example.com',
          phone: '+1 (555) 234-5678',
          lastVisit: '2024-02-12',
          condition: 'Diabetes Type 2',
          doctor: 'Dr. Michael Chen',
          status: 'Active',
          insurance: 'Aetna',
          emergencyContact: 'John Smith - +1 (555) 234-5679'
        },
        {
          id: 3,
          name: 'Robert Johnson',
          age: 58,
          gender: 'Male',
          bloodGroup: 'B+',
          email: 'robert.j@example.com',
          phone: '+1 (555) 345-6789',
          lastVisit: '2024-02-08',
          condition: 'Arthritis',
          doctor: 'Dr. Emily Williams',
          status: 'Active',
          insurance: 'Cigna',
          emergencyContact: 'Mary Johnson - +1 (555) 345-6780'
        },
        {
          id: 4,
          name: 'Maria Garcia',
          age: 28,
          gender: 'Female',
          bloodGroup: 'AB+',
          email: 'maria.g@example.com',
          phone: '+1 (555) 456-7890',
          lastVisit: '2024-02-11',
          condition: 'Asthma',
          doctor: 'Dr. James Wilson',
          status: 'Active',
          insurance: 'UnitedHealthcare',
          emergencyContact: 'Carlos Garcia - +1 (555) 456-7891'
        },
        {
          id: 5,
          name: 'William Brown',
          age: 52,
          gender: 'Male',
          bloodGroup: 'O-',
          email: 'william.b@example.com',
          phone: '+1 (555) 567-8901',
          lastVisit: '2024-02-09',
          condition: 'Heart Disease',
          doctor: 'Dr. Sarah Johnson',
          status: 'Critical',
          insurance: 'Medicare',
          emergencyContact: 'Elizabeth Brown - +1 (555) 567-8902'
        },
        {
          id: 6,
          name: 'Elizabeth Taylor',
          age: 41,
          gender: 'Female',
          bloodGroup: 'A+',
          email: 'elizabeth.t@example.com',
          phone: '+1 (555) 678-9012',
          lastVisit: '2024-02-07',
          condition: 'Migraine',
          doctor: 'Dr. Michael Chen',
          status: 'Active',
          insurance: 'Blue Cross',
          emergencyContact: 'Richard Taylor - +1 (555) 678-9013'
        }
      ]
      setPatients(mockPatients)
      setLoading(false)
    }, 1000)
  }

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm)
    
    const matchesDepartment = selectedDepartment ? 
      patient.doctor.includes(selectedDepartment) : true
    
    return matchesSearch && matchesDepartment
  })

  const departments = [...new Set(patients.map(p => p.doctor))]

  const getStatusColor = (status) => {
    switch(status) {
      case 'Critical': return '#E74C3C'
      case 'Active': return '#27AE60'
      default: return '#7F8C8D'
    }
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '60vh' 
      }}>
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <section style={{
        background: 'linear-gradient(135deg, #2A5C7F, #4A90E2)',
        color: 'white',
        padding: '3rem 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Patient Management</h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.95 }}>
            View and manage all patient records
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '3rem 0' }}>
        <div className="container">
          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#2A5C7F', fontSize: '2rem', marginBottom: '0.5rem' }}>
                {patients.length}
              </h3>
              <p style={{ color: '#7F8C8D' }}>Total Patients</p>
            </div>
            <div style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#27AE60', fontSize: '2rem', marginBottom: '0.5rem' }}>
                {patients.filter(p => p.status === 'Active').length}
              </h3>
              <p style={{ color: '#7F8C8D' }}>Active Patients</p>
            </div>
            <div style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#E74C3C', fontSize: '2rem', marginBottom: '0.5rem' }}>
                {patients.filter(p => p.status === 'Critical').length}
              </h3>
              <p style={{ color: '#7F8C8D' }}>Critical</p>
            </div>
            <div style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#F39C12', fontSize: '2rem', marginBottom: '0.5rem' }}>
                {new Set(patients.map(p => p.bloodGroup)).size}
              </h3>
              <p style={{ color: '#7F8C8D' }}>Blood Groups</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            flexWrap: 'wrap'
          }}>
            <input
              type="text"
              placeholder="Search patients by name, email, condition..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 2,
                padding: '1rem',
                border: '2px solid #E0E0E0',
                borderRadius: '8px',
                fontSize: '1rem',
                minWidth: '300px'
              }}
            />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              style={{
                flex: 1,
                padding: '1rem',
                border: '2px solid #E0E0E0',
                borderRadius: '8px',
                fontSize: '1rem',
                minWidth: '200px'
              }}
            >
              <option value="">All Doctors</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Patients Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.5rem'
          }}>
            {filteredPatients.map(patient => (
              <Link
                key={patient.id}
                to={`/patients/${patient.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)'
                }}
                >
                  {/* Status Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: getStatusColor(patient.status),
                    color: 'white',
                    padding: '0.2rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}>
                    {patient.status}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: '#ECF0F1',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      color: '#2A5C7F'
                    }}>
                      <i className="fas fa-user-circle"></i>
                    </div>
                    <div>
                      <h3 style={{ color: '#2C3E50', marginBottom: '0.3rem' }}>{patient.name}</h3>
                      <p style={{ color: '#7F8C8D', fontSize: '0.9rem' }}>
                        {patient.age} years • {patient.gender} • {patient.bloodGroup}
                      </p>
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1rem',
                    marginBottom: '1rem',
                    padding: '1rem 0',
                    borderTop: '1px solid #E0E0E0',
                    borderBottom: '1px solid #E0E0E0'
                  }}>
                    <div>
                      <p style={{ color: '#7F8C8D', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                        <i className="fas fa-envelope" style={{ marginRight: '0.3rem', color: '#2A5C7F' }}></i>
                        Email
                      </p>
                      <p style={{ color: '#2C3E50', fontSize: '0.9rem' }}>{patient.email}</p>
                    </div>
                    <div>
                      <p style={{ color: '#7F8C8D', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                        <i className="fas fa-phone" style={{ marginRight: '0.3rem', color: '#2A5C7F' }}></i>
                        Phone
                      </p>
                      <p style={{ color: '#2C3E50', fontSize: '0.9rem' }}>{patient.phone}</p>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ color: '#7F8C8D', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                      <i className="fas fa-stethoscope" style={{ marginRight: '0.5rem', color: '#2A5C7F' }}></i>
                      {patient.doctor}
                    </p>
                    <p style={{ color: '#7F8C8D', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                      <i className="fas fa-notes-medical" style={{ marginRight: '0.5rem', color: '#2A5C7F' }}></i>
                      {patient.condition}
                    </p>
                    <p style={{ color: '#7F8C8D', fontSize: '0.9rem' }}>
                      <i className="fas fa-calendar" style={{ marginRight: '0.5rem', color: '#2A5C7F' }}></i>
                      Last Visit: {new Date(patient.lastVisit).toLocaleDateString()}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    justifyContent: 'flex-end'
                  }}>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        toast.success(`Viewing ${patient.name}'s details`)
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#2A5C7F',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      View Details
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        toast.success(`Message sent to ${patient.name}`)
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'transparent',
                        color: '#2A5C7F',
                        border: '2px solid #2A5C7F',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      Message
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredPatients.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '4rem',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
            }}>
              <i className="fas fa-search" style={{ fontSize: '3rem', color: '#E0E0E0', marginBottom: '1rem' }}></i>
              <h3 style={{ color: '#2C3E50', marginBottom: '0.5rem' }}>No patients found</h3>
              <p style={{ color: '#7F8C8D' }}>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default PatientsPage