import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const PatientDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({})

  useEffect(() => {
    fetchPatientDetails()
  }, [id])

  const fetchPatientDetails = () => {
    setLoading(true)
    // Mock data - replace with actual API call
    setTimeout(() => {
      const mockPatient = {
        id: parseInt(id),
        name: id === '1' ? 'John Doe' : 
              id === '2' ? 'Jane Smith' : 
              id === '3' ? 'Robert Johnson' : 'Maria Garcia',
        age: id === '1' ? 45 : id === '2' ? 32 : id === '3' ? 58 : 28,
        gender: id === '1' ? 'Male' : id === '2' ? 'Female' : id === '3' ? 'Male' : 'Female',
        bloodGroup: id === '1' ? 'O+' : id === '2' ? 'A-' : id === '3' ? 'B+' : 'AB+',
        email: id === '1' ? 'john.doe@example.com' : 
               id === '2' ? 'jane.smith@example.com' : 
               id === '3' ? 'robert.j@example.com' : 'maria.g@example.com',
        phone: id === '1' ? '+1 (555) 123-4567' : 
               id === '2' ? '+1 (555) 234-5678' : 
               id === '3' ? '+1 (555) 345-6789' : '+1 (555) 456-7890',
        address: '123 Main Street, Medical City, MC 12345',
        dateOfBirth: id === '1' ? '1979-05-15' : 
                     id === '2' ? '1992-08-22' : 
                     id === '3' ? '1966-03-10' : '1996-11-30',
        emergencyContact: id === '1' ? 'Jane Doe - +1 (555) 123-4568' : 
                          id === '2' ? 'John Smith - +1 (555) 234-5679' : 
                          id === '3' ? 'Mary Johnson - +1 (555) 345-6780' : 'Carlos Garcia - +1 (555) 456-7891',
        insurance: id === '1' ? 'Blue Cross' : 
                   id === '2' ? 'Aetna' : 
                   id === '3' ? 'Cigna' : 'UnitedHealthcare',
        policyNumber: id === '1' ? 'BC123456' : 
                      id === '2' ? 'AE789012' : 
                      id === '3' ? 'CG345678' : 'UH901234',
        primaryPhysician: id === '1' ? 'Dr. Sarah Johnson' : 
                          id === '2' ? 'Dr. Michael Chen' : 
                          id === '3' ? 'Dr. Emily Williams' : 'Dr. James Wilson',
        status: id === '1' ? 'Active' : 
                id === '2' ? 'Active' : 
                id === '3' ? 'Active' : 'Active',
        conditions: id === '1' ? ['Hypertension', 'High Cholesterol'] : 
                    id === '2' ? ['Type 2 Diabetes'] : 
                    id === '3' ? ['Arthritis', 'Osteoporosis'] : ['Asthma'],
        allergies: id === '1' ? ['Penicillin'] : 
                   id === '2' ? ['Sulfa', 'Peanuts'] : 
                   id === '3' ? ['Latex'] : ['Dust', 'Pollen'],
        medications: id === '1' ? [
          { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
          { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily' }
        ] : id === '2' ? [
          { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' }
        ] : id === '3' ? [
          { name: 'Ibuprofen', dosage: '400mg', frequency: 'As needed' },
          { name: 'Calcium', dosage: '500mg', frequency: 'Once daily' }
        ] : [
          { name: 'Albuterol', dosage: '90mcg', frequency: 'As needed' }
        ],
        appointments: [
          { date: '2024-02-10', type: 'Regular Checkup', doctor: 'Dr. Sarah Johnson' },
          { date: '2024-01-15', type: 'Follow-up', doctor: 'Dr. Sarah Johnson' },
          { date: '2023-12-20', type: 'Consultation', doctor: 'Dr. Michael Chen' }
        ],
        labResults: [
          { date: '2024-02-10', test: 'Blood Pressure', result: '120/80', status: 'Normal' },
          { date: '2024-02-10', test: 'Cholesterol', result: '180', status: 'Normal' },
          { date: '2024-01-15', test: 'Blood Glucose', result: '95', status: 'Normal' }
        ],
        visits: [
          { date: '2024-02-10', reason: 'Regular checkup', doctor: 'Dr. Sarah Johnson' },
          { date: '2024-01-15', reason: 'Medication review', doctor: 'Dr. Sarah Johnson' },
          { date: '2023-12-20', reason: 'Specialist consultation', doctor: 'Dr. Michael Chen' }
        ]
      }
      setPatient(mockPatient)
      setEditForm(mockPatient)
      setLoading(false)
    }, 1000)
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()
    toast.success('Patient information updated successfully')
    setShowEditModal(false)
    setPatient(editForm)
  }

  const handleScheduleAppointment = () => {
    navigate(`/book-appointment?patient=${id}`)
  }

  const handleSendMessage = () => {
    toast.success('Message sent to patient')
  }

  const handleAddMedicalRecord = () => {
    toast.success('New medical record added')
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
        padding: '2rem 0'
      }}>
        <div className="container">
          <Link 
            to="/patients"
            style={{
              color: 'white',
              textDecoration: 'none',
              display: 'inline-block',
              marginBottom: '1rem',
              opacity: 0.9
            }}
          >
            <i className="fas fa-arrow-left"></i> Back to Patients
          </Link>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem'
            }}>
              <i className="fas fa-user-circle"></i>
            </div>
            <div>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{patient.name}</h1>
              <p style={{ fontSize: '1.1rem', opacity: 0.95 }}>
                Patient ID: {patient.id} • {patient.age} years • {patient.gender} • {patient.bloodGroup}
              </p>
              <div style={{
                display: 'inline-block',
                background: patient.status === 'Critical' ? '#E74C3C' : '#27AE60',
                padding: '0.3rem 1.5rem',
                borderRadius: '20px',
                fontSize: '0.9rem',
                marginTop: '0.5rem'
              }}>
                {patient.status}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <section style={{ padding: '2rem 0', background: '#F8FAFC' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleScheduleAppointment}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <i className="fas fa-calendar-plus"></i>
              Schedule Appointment
            </button>
            <button
              onClick={handleSendMessage}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <i className="fas fa-envelope"></i>
              Send Message
            </button>
            <button
              onClick={handleAddMedicalRecord}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <i className="fas fa-notes-medical"></i>
              Add Medical Record
            </button>
            <button
              onClick={() => setShowEditModal(true)}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <i className="fas fa-edit"></i>
              Edit Information
            </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section style={{ padding: '2rem 0' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            gap: '1rem',
            borderBottom: '2px solid #E0E0E0',
            marginBottom: '2rem',
            overflowX: 'auto'
          }}>
            {['overview', 'medical', 'appointments', 'lab-results', 'billing'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '1rem 2rem',
                  background: 'none',
                  border: 'none',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  color: activeTab === tab ? '#2A5C7F' : '#7F8C8D',
                  borderBottom: activeTab === tab ? '3px solid #2A5C7F' : 'none',
                  fontWeight: activeTab === tab ? '600' : '400',
                  textTransform: 'capitalize'
                }}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '2rem'
            }}>
              <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)' }}>
                <h3 style={{ color: '#2C3E50', marginBottom: '1.5rem' }}>Personal Information</h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div><strong>Email:</strong> {patient.email}</div>
                  <div><strong>Phone:</strong> {patient.phone}</div>
                  <div><strong>Date of Birth:</strong> {new Date(patient.dateOfBirth).toLocaleDateString()}</div>
                  <div><strong>Address:</strong> {patient.address}</div>
                  <div><strong>Emergency Contact:</strong> {patient.emergencyContact}</div>
                </div>
              </div>

              <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)' }}>
                <h3 style={{ color: '#2C3E50', marginBottom: '1.5rem' }}>Insurance Information</h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div><strong>Provider:</strong> {patient.insurance}</div>
                  <div><strong>Policy Number:</strong> {patient.policyNumber}</div>
                  <div><strong>Primary Physician:</strong> {patient.primaryPhysician}</div>
                </div>
              </div>

              <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)' }}>
                <h3 style={{ color: '#2C3E50', marginBottom: '1.5rem' }}>Medical Conditions</h3>
                <ul style={{ listStyle: 'none' }}>
                  {patient.conditions.map((condition, index) => (
                    <li key={index} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fas fa-circle" style={{ color: '#2A5C7F', fontSize: '0.5rem' }}></i>
                      {condition}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)' }}>
                <h3 style={{ color: '#2C3E50', marginBottom: '1.5rem' }}>Allergies</h3>
                <ul style={{ listStyle: 'none' }}>
                  {patient.allergies.map((allergy, index) => (
                    <li key={index} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fas fa-exclamation-triangle" style={{ color: '#E74C3C' }}></i>
                      {allergy}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'medical' && (
            <div>
              <h3 style={{ color: '#2C3E50', marginBottom: '1.5rem' }}>Current Medications</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
              }}>
                {patient.medications.map((med, index) => (
                  <div key={index} style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
                  }}>
                    <h4 style={{ color: '#2A5C7F', marginBottom: '0.5rem' }}>{med.name}</h4>
                    <p><strong>Dosage:</strong> {med.dosage}</p>
                    <p><strong>Frequency:</strong> {med.frequency}</p>
                  </div>
                ))}
              </div>

              <h3 style={{ color: '#2C3E50', marginBottom: '1.5rem' }}>Visit History</h3>
              <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: '#F8FAFC' }}>
                    <tr>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Reason</th>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Doctor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patient.visits.map((visit, index) => (
                      <tr key={index} style={{ borderTop: '1px solid #E0E0E0' }}>
                        <td style={{ padding: '1rem' }}>{new Date(visit.date).toLocaleDateString()}</td>
                        <td style={{ padding: '1rem' }}>{visit.reason}</td>
                        <td style={{ padding: '1rem' }}>{visit.doctor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div>
              <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ color: '#2C3E50' }}>Upcoming & Past Appointments</h3>
                <button onClick={handleScheduleAppointment} className="btn btn-primary">
                  Schedule New Appointment
                </button>
              </div>
              
              <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: '#F8FAFC' }}>
                    <tr>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Type</th>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Doctor</th>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patient.appointments.map((apt, index) => (
                      <tr key={index} style={{ borderTop: '1px solid #E0E0E0' }}>
                        <td style={{ padding: '1rem' }}>{new Date(apt.date).toLocaleDateString()}</td>
                        <td style={{ padding: '1rem' }}>{apt.type}</td>
                        <td style={{ padding: '1rem' }}>{apt.doctor}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            background: new Date(apt.date) > new Date() ? '#27AE60' : '#7F8C8D',
                            color: 'white',
                            padding: '0.2rem 1rem',
                            borderRadius: '20px',
                            fontSize: '0.8rem'
                          }}>
                            {new Date(apt.date) > new Date() ? 'Upcoming' : 'Completed'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <button
                            onClick={() => toast.success('Viewing appointment details')}
                            style={{
                              padding: '0.3rem 1rem',
                              background: '#2A5C7F',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'lab-results' && (
            <div>
              <h3 style={{ color: '#2C3E50', marginBottom: '1.5rem' }}>Recent Lab Results</h3>
              <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: '#F8FAFC' }}>
                    <tr>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Test</th>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Result</th>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patient.labResults.map((result, index) => (
                      <tr key={index} style={{ borderTop: '1px solid #E0E0E0' }}>
                        <td style={{ padding: '1rem' }}>{new Date(result.date).toLocaleDateString()}</td>
                        <td style={{ padding: '1rem' }}>{result.test}</td>
                        <td style={{ padding: '1rem' }}>{result.result}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            background: result.status === 'Normal' ? '#27AE60' : '#E74C3C',
                            color: 'white',
                            padding: '0.2rem 1rem',
                            borderRadius: '20px',
                            fontSize: '0.8rem'
                          }}>
                            {result.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div>
              <h3 style={{ color: '#2C3E50', marginBottom: '1.5rem' }}>Billing Information</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '2rem',
                marginBottom: '2rem'
              }}>
                <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)' }}>
                  <h4 style={{ color: '#2A5C7F', marginBottom: '1rem' }}>Insurance Coverage</h4>
                  <p><strong>Provider:</strong> {patient.insurance}</p>
                  <p><strong>Policy Number:</strong> {patient.policyNumber}</p>
                  <p><strong>Coverage:</strong> 80% after deductible</p>
                </div>
                <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)' }}>
                  <h4 style={{ color: '#2A5C7F', marginBottom: '1rem' }}>Outstanding Balance</h4>
                  <p style={{ fontSize: '2rem', color: '#E74C3C', fontWeight: '700' }}>$0.00</p>
                  <p style={{ color: '#7F8C8D' }}>No outstanding payments</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Edit Modal */}
      {showEditModal && (
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
            padding: '2rem',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Edit Patient Information</h3>
            <form onSubmit={handleEditSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '2px solid #E0E0E0',
                    borderRadius: '8px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '2px solid #E0E0E0',
                    borderRadius: '8px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Phone</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '2px solid #E0E0E0',
                    borderRadius: '8px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Address</label>
                <textarea
                  value={editForm.address}
                  onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '2px solid #E0E0E0',
                    borderRadius: '8px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientDetail