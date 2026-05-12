import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { userService } from '../services/userService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const DoctorAvailability = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [availability, setAvailability] = useState([])
  const [selectedDay, setSelectedDay] = useState('Monday')
  const [newSlot, setNewSlot] = useState({ startTime: '09:00', endTime: '17:00' })

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  useEffect(() => {
    fetchAvailability()
  }, [])

  const fetchAvailability = async () => {
    try {
      setLoading(true)
      const response = await userService.getDoctorAvailability()
      setAvailability(response.availability || [])
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to load availability')
    } finally {
      setLoading(false)
    }
  }

  const getDayAvailability = (day) => {
    const dayData = availability.find(a => a.day === day)
    return dayData ? dayData.slots : []
  }

  const addTimeSlot = async () => {
    if (!newSlot.startTime || !newSlot.endTime) {
      toast.error('Please enter both start and end time')
      return
    }

    if (newSlot.startTime >= newSlot.endTime) {
      toast.error('Start time must be before end time')
      return
    }

    let updatedAvailability = [...availability]
    const dayIndex = updatedAvailability.findIndex(a => a.day === selectedDay)
    
    const newSlotObj = {
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      isAvailable: true
    }

    if (dayIndex === -1) {
      updatedAvailability.push({
        day: selectedDay,
        slots: [newSlotObj]
      })
    } else {
      updatedAvailability[dayIndex].slots.push(newSlotObj)
    }

    await saveAvailability(updatedAvailability)
    setNewSlot({ startTime: '09:00', endTime: '17:00' })
  }

  const removeTimeSlot = async (day, slotIndex) => {
    const updatedAvailability = [...availability]
    const dayIndex = updatedAvailability.findIndex(a => a.day === day)
    
    if (dayIndex !== -1) {
      updatedAvailability[dayIndex].slots.splice(slotIndex, 1)
      
      if (updatedAvailability[dayIndex].slots.length === 0) {
        updatedAvailability.splice(dayIndex, 1)
      }
      
      await saveAvailability(updatedAvailability)
    }
  }

  const saveAvailability = async (newAvailability) => {
    try {
      setSaving(true)
      await userService.updateDoctorAvailability(newAvailability)
      setAvailability(newAvailability)
      toast.success('Availability updated successfully')
    } catch (error) {
      console.error('Error saving:', error)
      toast.error('Failed to update availability')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div style={{ padding: '2rem 0', background: '#F8FAFC', minHeight: 'calc(100vh - 80px - 300px)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', color: '#2C3E50', marginBottom: '0.5rem' }}>
            Manage Availability
          </h1>
          <p style={{ color: '#7F8C8D' }}>Set your working hours and time slots</p>
        </div>

        {saving && (
          <div style={{ background: '#3498DB', color: 'white', padding: '0.5rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' }}>
            Saving...
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Left Panel - Day Selection */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '1rem', color: '#2C3E50' }}>Select Day</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {daysOfWeek.map(day => {
                const slots = getDayAvailability(day)
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    style={{
                      padding: '0.8rem 1rem',
                      background: selectedDay === day ? '#2A5C7F' : '#F8FAFC',
                      color: selectedDay === day ? 'white' : '#333',
                      border: selectedDay === day ? 'none' : '1px solid #E0E0E0',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span>{day}</span>
                    {slots.length > 0 && (
                      <span style={{
                        background: '#27AE60',
                        color: 'white',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '20px',
                        fontSize: '0.7rem'
                      }}>
                        {slots.length} slots
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right Panel - Time Slots */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '1rem', color: '#2C3E50' }}>
              {selectedDay} - Time Slots
            </h3>

            {/* Add new slot */}
            <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <h4 style={{ marginBottom: '0.8rem', fontSize: '0.9rem' }}>Add New Time Slot</h4>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <select
                  value={newSlot.startTime}
                  onChange={(e) => setNewSlot({...newSlot, startTime: e.target.value})}
                  style={{ padding: '0.5rem', border: '2px solid #E0E0E0', borderRadius: '8px' }}
                >
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                  <option value="17:00">5:00 PM</option>
                </select>
                <span>to</span>
                <select
                  value={newSlot.endTime}
                  onChange={(e) => setNewSlot({...newSlot, endTime: e.target.value})}
                  style={{ padding: '0.5rem', border: '2px solid #E0E0E0', borderRadius: '8px' }}
                >
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                  <option value="17:00">5:00 PM</option>
                  <option value="18:00">6:00 PM</option>
                </select>
                <button
                  onClick={addTimeSlot}
                  disabled={saving}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#27AE60',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  + Add Slot
                </button>
              </div>
            </div>

            {/* Existing slots */}
            {getDayAvailability(selectedDay).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#7F8C8D' }}>
                <i className="fas fa-clock" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
                <p>No time slots added for {selectedDay}</p>
                <p style={{ fontSize: '0.8rem' }}>Use the form above to add your working hours</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {getDayAvailability(selectedDay).map((slot, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.8rem',
                      background: '#F8FAFC',
                      borderRadius: '8px',
                      border: '1px solid #E0E0E0'
                    }}
                  >
                    <span>
                      <i className="far fa-clock" style={{ color: '#2A5C7F', marginRight: '0.5rem' }}></i>
                      {slot.startTime} - {slot.endTime}
                    </span>
                    <button
                      onClick={() => removeTimeSlot(selectedDay, idx)}
                      disabled={saving}
                      style={{
                        padding: '0.3rem 0.8rem',
                        background: '#E74C3C',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.75rem'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Summary Section */}
        <div style={{
          marginTop: '2rem',
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#2C3E50' }}>Weekly Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
            {daysOfWeek.map(day => {
              const slots = getDayAvailability(day)
              return (
                <div key={day} style={{ padding: '0.5rem' }}>
                  <div style={{ fontWeight: '600', marginBottom: '0.3rem' }}>{day.slice(0, 3)}</div>
                  <div style={{
                    padding: '0.3rem',
                    borderRadius: '6px',
                    background: slots.length > 0 ? '#27AE60' : '#E74C3C',
                    color: 'white',
                    fontSize: '0.75rem'
                  }}>
                    {slots.length > 0 ? `${slots.length} slots` : 'Off'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorAvailability