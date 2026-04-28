import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { userService } from '../services/userService'
import { appointmentService } from '../services/appointmentService'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const AppointmentBooking = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [doctors, setDoctors] = useState([])
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [availableSlots, setAvailableSlots] = useState([])
  const [formData, setFormData] = useState({
    reason: '',
    symptoms: '',
    type: 'consultation'
  })

  useEffect(() => {
    fetchDoctors()
  }, [])

  useEffect(() => {
    // Check for pre-filled data from URL params
    const doctorId = searchParams.get('doctor')
    const date = searchParams.get('date')
    const time = searchParams.get('time')
    
    if (doctorId && doctors.length > 0) {
      const doctor = doctors.find(d => d._id === doctorId || d.id == doctorId)
      if (doctor) {
        setSelectedDoctor(doctor)
        setStep(2)
        if (date) setSelectedDate(date)
        if (time) setSelectedTime(time)
      }
    }
  }, [searchParams, doctors])

  const fetchDoctors = async () => {
    try {
      setLoading(true)
      const response = await userService.getAllDoctors()
      setDoctors(response.doctors || [])
    } catch (error) {
      toast.error('Failed to load doctors')
    } finally {
      setLoading(false)
    }
  }

  const checkAvailability = async () => {
    if (!selectedDate || !selectedDoctor) return
    
    try {
      setLoading(true)
      const response = await appointmentService.getAvailableSlots(selectedDoctor._id || selectedDoctor.id, selectedDate)
      setAvailableSlots(response.availableSlots || [])
      
      if (response.availableSlots?.length === 0) {
        toast.error('No slots available on this date')
      }
    } catch (error) {
      toast.error('Failed to check availability')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedDate && selectedDoctor) {
      checkAvailability()
    }
  }, [selectedDate, selectedDoctor])

 const handleSubmit = async (e) => {
  e.preventDefault()
  
  if (!selectedDoctor || !selectedDate || !selectedTime) {
    toast.error('Please complete all steps')
    return
  }

  try {
    setLoading(true)
    
    const appointmentData = {
      doctorId: selectedDoctor._id || selectedDoctor.id,
      date: selectedDate,
      time: selectedTime,
      type: formData.type,
      reason: formData.reason,
      symptoms: formData.symptoms
    }
    
    await appointmentService.createAppointment(appointmentData)
    toast.success('Appointment booked successfully!')
    
    // Redirect to dashboard where user can see all appointments
    navigate('/dashboard')
    
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to book appointment'
    toast.error(message)
  } finally {
    setLoading(false)
  }
}

  if (loading && step === 1) return <LoadingSpinner />

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', color: '#2C3E50', marginBottom: '2rem', textAlign: 'center' }}>
            Book an Appointment
          </h1>

          {/* Progress Steps */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '3rem',
            position: 'relative'
          }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ textAlign: 'center', flex: 1 }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: step >= i ? '#2A5C7F' : '#E0E0E0',
                  color: step >= i ? 'white' : '#7F8C8D',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.5rem',
                  fontWeight: '600'
                }}>
                  {i}
                </div>
                <div style={{ color: step >= i ? '#2A5C7F' : '#7F8C8D', fontWeight: '500' }}>
                  {i === 1 ? 'Select Doctor' : i === 2 ? 'Choose Time' : 'Details'}
                </div>
              </div>
            ))}
          </div>

          {/* Step 1: Select Doctor */}
          {step === 1 && (
            <div>
              <h3 style={{ marginBottom: '1.5rem' }}>Select a Doctor</h3>
              {doctors.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#7F8C8D' }}>No doctors available</p>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: '1rem'
                }}>
                  {doctors.map(doctor => (
                    <div
                      key={doctor._id || doctor.id}
                      onClick={() => {
                        setSelectedDoctor(doctor)
                        setStep(2)
                      }}
                      style={{
                        padding: '1.5rem',
                        background: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        cursor: 'pointer',
                        border: selectedDoctor?._id === doctor._id ? '2px solid #2A5C7F' : '2px solid transparent',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div style={{
                        width: '60px',
                        height: '60px',
                        background: '#ECF0F1',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        fontSize: '1.8rem',
                        color: '#2A5C7F'
                      }}>
                        <i className="fas fa-user-md"></i>
                      </div>
                      <h4 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                        {doctor.user?.name || doctor.name}
                      </h4>
                      <p style={{ textAlign: 'center', color: '#2A5C7F', marginBottom: '0.5rem' }}>
                        {doctor.specialization}
                      </p>
                      <p style={{ textAlign: 'center', color: '#7F8C8D' }}>
                        ${doctor.consultationFee}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Select Date & Time */}
          {step === 2 && selectedDoctor && (
            <div>
              <h3 style={{ marginBottom: '1.5rem' }}>
                Select Date & Time with {selectedDoctor.user?.name || selectedDoctor.name}
              </h3>
              
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

              {selectedDate && (
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Available Time Slots
                  </label>
                  {loading ? (
                    <LoadingSpinner />
                  ) : availableSlots.length > 0 ? (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                      gap: '0.5rem'
                    }}>
                      {availableSlots.map(slot => (
                        <button
                          key={slot}
                          onClick={() => {
                            setSelectedTime(slot)
                            setStep(3)
                          }}
                          style={{
                            padding: '0.8rem',
                            background: selectedTime === slot ? '#2A5C7F' : '#ECF0F1',
                            color: selectedTime === slot ? 'white' : '#333',
                            border: '2px solid',
                            borderColor: selectedTime === slot ? '#2A5C7F' : '#E0E0E0',
                            borderRadius: '8px',
                            cursor: 'pointer'
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
                </div>
              )}
            </div>
          )}

          {/* Step 3: Appointment Details */}
          {step === 3 && (
            <div>
              <h3 style={{ marginBottom: '1.5rem' }}>Appointment Details</h3>
              
              <div style={{
                background: '#F8FAFC',
                padding: '1.5rem',
                borderRadius: '8px',
                marginBottom: '2rem'
              }}>
                <h4 style={{ marginBottom: '1rem' }}>Summary</h4>
                <p><strong>Doctor:</strong> {selectedDoctor?.user?.name || selectedDoctor?.name}</p>
                <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {selectedTime}</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Appointment Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #E0E0E0',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="consultation">Consultation</option>
                    <option value="follow-up">Follow-up</option>
                    <option value="checkup">Checkup</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Reason for Visit
                  </label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    rows="4"
                    placeholder="Please describe your reason for the visit"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #E0E0E0',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'inherit'
                    }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Symptoms (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.symptoms}
                    onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                    placeholder="e.g., headache, fever, cough"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #E0E0E0',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                    disabled={loading}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    disabled={loading}
                  >
                    {loading ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AppointmentBooking