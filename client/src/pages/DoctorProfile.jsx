import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { userService } from '../services/userService'
import { appointmentService } from '../services/appointmentService'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const DoctorProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState('')
  const [availableSlots, setAvailableSlots] = useState([])
  const [activeTab, setActiveTab] = useState('about')
  const [bookingStep, setBookingStep] = useState('date') // date, confirm
  const [selectedSlot, setSelectedSlot] = useState(null)

  useEffect(() => {
    fetchDoctorDetails()
  }, [id])

  const fetchDoctorDetails = async () => {
    try {
      setLoading(true)
      const response = await userService.getDoctorById(id)
      console.log('Doctor details:', response)
      setDoctor(response.doctor)
    } catch (error) {
      console.error('Error fetching doctor:', error)
      toast.error('Failed to load doctor profile')
    } finally {
      setLoading(false)
    }
  }

  const checkAvailability = async () => {
    if (!selectedDate) {
      toast.error('Please select a date')
      return
    }
    try {
      setLoading(true)
      const response = await appointmentService.getAvailableSlots(id, selectedDate)
      console.log('Available slots:', response)
      setAvailableSlots(response.availableSlots || [])
      if (response.availableSlots?.length === 0) {
        toast.error('No slots available on this date')
      }
      setBookingStep('slots')
    } catch (error) {
      toast.error('Failed to check availability')
    } finally {
      setLoading(false)
    }
  }

  const handleBookAppointment = (slot) => {
    if (!user) {
      toast.error('Please login to book appointment')
      navigate('/login')
      return
    }
    setSelectedSlot(slot)
    setBookingStep('confirm')
  }

const confirmBooking = async () => {
  try {
    setLoading(true)
    const appointmentData = {
      doctorId: doctor._id || doctor.id,
      date: selectedDate,
      time: selectedSlot,
      type: 'consultation',
      reason: 'Consultation with Dr. ' + (doctor.user?.name || doctor.name)
    }
    
    await appointmentService.createAppointment(appointmentData)
    toast.success('Appointment booked successfully!', {
      duration: 3000,
      action: {
        label: 'View My Appointments',
        onClick: () => navigate('/dashboard')
      }
    })
    
    // Auto redirect after 2 seconds
    setTimeout(() => {
      navigate('/dashboard')
    }, 2000)
    
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to book appointment')
  } finally {
    setLoading(false)
  }
}

  const getDaySchedule = (day) => {
    if (!doctor?.availability) return []
    const daySchedule = doctor.availability.find(a => a.day === day)
    return daySchedule?.slots || []
  }

  if (loading) return <LoadingSpinner />

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        <Link
          to="/doctors"
          style={{
            display: 'inline-block',
            marginBottom: '2rem',
            color: '#2A5C7F',
            textDecoration: 'none'
          }}
        >
          <i className="fas fa-arrow-left"></i> Back to Doctors
        </Link>

        {/* Doctor Info Card */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{
              width: '120px',
              height: '120px',
              background: '#ECF0F1',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3.5rem',
              color: '#2A5C7F'
            }}>
              <i className="fas fa-user-md"></i>
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '2.5rem', color: '#2C3E50', marginBottom: '0.5rem' }}>
                {doctor?.user?.name || doctor?.name}
              </h1>
              <p style={{ fontSize: '1.2rem', color: '#2A5C7F', marginBottom: '0.5rem' }}>
                {doctor?.specialization}
              </p>
              <div style={{ marginBottom: '0.5rem' }}>
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className="fas fa-star"
                    style={{
                      color: i < Math.floor(doctor?.rating || 0) ? '#F39C12' : '#E0E0E0',
                      marginRight: '2px',
                      fontSize: '1.2rem'
                    }}
                  ></i>
                ))}
                <span style={{ color: '#7F8C8D', marginLeft: '0.5rem' }}>
                  {doctor?.rating || 0} ({doctor?.totalReviews || 0} reviews)
                </span>
              </div>
              <p style={{ color: '#7F8C8D', marginBottom: '0.5rem' }}>
                <i className="fas fa-briefcase"></i> {doctor?.experience || 0} years experience
              </p>
              <p style={{ color: '#2A5C7F', fontWeight: '600', fontSize: '1.2rem' }}>
                Consultation Fee: ${doctor?.consultationFee || 0}
              </p>
            </div>
            {user?.role === 'patient' && (
              <button
                onClick={() => setActiveTab('schedule')}
                className="btn btn-primary"
                style={{ padding: '1rem 2rem' }}
              >
                Book Appointment
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: '2rem', borderBottom: '2px solid #E0E0E0' }}>
          {['about', 'schedule', 'availability', 'reviews'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '1rem 2rem',
                background: 'none',
                border: 'none',
                fontSize: '1.1rem',
                cursor: 'pointer',
                color: activeTab === tab ? '#2A5C7F' : '#7F8C8D',
                borderBottom: activeTab === tab ? '3px solid #2A5C7F' : 'none',
                fontWeight: activeTab === tab ? '600' : '400'
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'about' && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#2C3E50', marginBottom: '1rem' }}>Biography</h3>
            <p style={{ color: '#7F8C8D', lineHeight: '1.8', marginBottom: '2rem' }}>
              {doctor?.bio || 'No biography available.'}
            </p>

            <h3 style={{ color: '#2C3E50', marginBottom: '1rem' }}>Education</h3>
            <ul style={{ listStyle: 'none' }}>
              {(doctor?.education || []).map((edu, index) => (
                <li key={index} style={{ marginBottom: '0.5rem', color: '#7F8C8D' }}>
                  <i className="fas fa-graduation-cap" style={{ color: '#2A5C7F', marginRight: '0.5rem' }}></i>
                  {edu.degree} - {edu.institution} ({edu.year})
                </li>
              ))}
              {(!doctor?.education || doctor.education.length === 0) && (
                <li style={{ color: '#7F8C8D' }}>No education information available.</li>
              )}
            </ul>

            <h3 style={{ color: '#2C3E50', margin: '2rem 0 1rem' }}>Languages</h3>
            <p style={{ color: '#7F8C8D' }}>{doctor?.languages?.join(', ') || 'English'}</p>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#2C3E50', marginBottom: '1.5rem' }}>Book an Appointment</h3>
            
            {bookingStep === 'date' && (
              <div>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #E0E0E0',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <button
                  onClick={checkAvailability}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '1rem' }}
                  disabled={!selectedDate}
                >
                  Check Available Slots
                </button>
              </div>
            )}

            {bookingStep === 'slots' && (
              <div>
                <h4 style={{ color: '#2C3E50', marginBottom: '1rem' }}>
                  Available Slots for {new Date(selectedDate).toLocaleDateString()}
                </h4>
                
                {availableSlots.length > 0 ? (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                    gap: '0.8rem',
                    marginBottom: '2rem'
                  }}>
                    {availableSlots.map(slot => (
                      <button
                        key={slot}
                        onClick={() => handleBookAppointment(slot)}
                        style={{
                          padding: '1rem',
                          background: '#ECF0F1',
                          border: '2px solid #E0E0E0',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#2A5C7F'
                          e.currentTarget.style.color = 'white'
                          e.currentTarget.style.borderColor = '#2A5C7F'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#ECF0F1'
                          e.currentTarget.style.color = '#333'
                          e.currentTarget.style.borderColor = '#E0E0E0'
                        }}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#7F8C8D', textAlign: 'center', padding: '2rem' }}>
                    No slots available for this date
                  </p>
                )}

                <button
                  onClick={() => {
                    setBookingStep('date')
                    setSelectedSlot(null)
                  }}
                  className="btn btn-secondary"
                  style={{ width: '100%' }}
                >
                  Back to Date Selection
                </button>
              </div>
            )}

            {bookingStep === 'confirm' && selectedSlot && (
              <div>
                <div style={{
                  background: '#F8FAFC',
                  padding: '2rem',
                  borderRadius: '8px',
                  marginBottom: '2rem'
                }}>
                  <h4 style={{ marginBottom: '1.5rem', color: '#2C3E50' }}>Confirm Appointment</h4>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Doctor:</strong> {doctor?.user?.name || doctor?.name}
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Specialization:</strong> {doctor?.specialization}
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Time:</strong> {selectedSlot}
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Fee:</strong> ${doctor?.consultationFee || 0}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={() => setBookingStep('slots')}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Back
                  </button>
                  <button
                    onClick={confirmBooking}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    disabled={loading}
                  >
                    {loading ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'availability' && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#2C3E50', marginBottom: '1.5rem' }}>Weekly Schedule</h3>
            
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                const slots = getDaySchedule(day)
                return (
                  <div key={day} style={{
                    padding: '1rem',
                    background: slots.length > 0 ? '#F8FAFC' : 'transparent',
                    borderRadius: '8px'
                  }}>
                    <h4 style={{ color: '#2C3E50', marginBottom: '0.5rem' }}>{day}</h4>
                    {slots.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {slots.map((slot, index) => (
                          <span
                            key={index}
                            style={{
                              padding: '0.3rem 1rem',
                              background: '#27AE60',
                              color: 'white',
                              borderRadius: '20px',
                              fontSize: '0.9rem'
                            }}
                          >
                            {slot.startTime} - {slot.endTime}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: '#7F8C8D', fontStyle: 'italic' }}>Not available</p>
                    )}
                  </div>
                )
              })}
            </div>

            {(user?.role === 'doctor' || user?.role === 'admin') && (
              <button
                onClick={() => toast.success('Edit availability feature coming soon')}
                className="btn btn-primary"
                style={{ marginTop: '2rem' }}
              >
                Edit Availability
              </button>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#2C3E50', marginBottom: '1rem' }}>Patient Reviews</h3>
            
            {doctor?.reviews?.length > 0 ? (
              doctor.reviews.map((review, i) => (
                <div key={i} style={{
                  padding: '1.5rem',
                  borderBottom: i < doctor.reviews.length - 1 ? '1px solid #E0E0E0' : 'none',
                  marginBottom: i < doctor.reviews.length - 1 ? '1.5rem' : '0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong>{review.patientName}</strong>
                    <span style={{ color: '#7F8C8D' }}>{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    {[...Array(5)].map((_, j) => (
                      <i key={j} className="fas fa-star" style={{ 
                        color: j < review.rating ? '#F39C12' : '#E0E0E0',
                        marginRight: '2px' 
                      }}></i>
                    ))}
                  </div>
                  <p style={{ color: '#7F8C8D', lineHeight: '1.6' }}>{review.comment}</p>
                </div>
              ))
            ) : (
              <p style={{ color: '#7F8C8D', textAlign: 'center', padding: '2rem' }}>
                No reviews yet
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorProfile