import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { userService } from '../services/userService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const ProfilePage = () => {
  const { user, login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [profile, setProfile] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    bloodGroup: '',
    height: '',
    weight: '',
    allergies: '',
    chronicConditions: ''
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await userService.getUserProfile()
      console.log('Profile response:', response)
      
      if (response.user) {
        setProfile(response.user)
        setFormData({
          name: response.user.name || '',
          email: response.user.email || '',
          phone: response.user.phone || '',
          dateOfBirth: response.user.dateOfBirth ? response.user.dateOfBirth.split('T')[0] : '',
          gender: response.user.gender || '',
          address: response.user.address || {
            street: '', city: '', state: '', zipCode: '', country: ''
          },
          bloodGroup: response.profile?.bloodGroup || '',
          height: response.profile?.height || '',
          weight: response.profile?.weight || '',
          allergies: response.profile?.allergies?.join(', ') || '',
          chronicConditions: response.profile?.chronicConditions?.join(', ') || ''
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      // Format data for API
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address,
        bloodGroup: formData.bloodGroup,
        height: formData.height ? parseFloat(formData.height) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        allergies: formData.allergies ? formData.allergies.split(',').map(s => s.trim()) : [],
        chronicConditions: formData.chronicConditions ? formData.chronicConditions.split(',').map(s => s.trim()) : []
      }
      
      const response = await userService.updateUserProfile(updateData)
      toast.success('Profile updated successfully')
      setEditMode(false)
      fetchProfile() // Refresh data
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem'
            }}>
              <h1 style={{ color: '#2C3E50' }}>My Profile</h1>
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="btn btn-primary"
                >
                  <i className="fas fa-edit"></i> Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => setEditMode(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              )}
            </div>

            {!editMode ? (
              // View Mode
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2rem',
                  marginBottom: '2rem',
                  paddingBottom: '2rem',
                  borderBottom: '1px solid #E0E0E0'
                }}>
                  <div style={{
                    width: '100px',
                    height: '100px',
                    background: '#2A5C7F',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '3rem',
                    fontWeight: '600'
                  }}>
                    {profile?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h2 style={{ color: '#2C3E50', marginBottom: '0.5rem' }}>{profile?.name}</h2>
                    <p style={{ color: '#2A5C7F', textTransform: 'capitalize' }}>{profile?.role}</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  <div>
                    <h3 style={{ color: '#2C3E50', marginBottom: '1rem' }}>Personal Information</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                      <div>
                        <label style={{ color: '#7F8C8D', fontSize: '0.9rem' }}>Email</label>
                        <p style={{ fontWeight: '500' }}>{profile?.email}</p>
                      </div>
                      <div>
                        <label style={{ color: '#7F8C8D', fontSize: '0.9rem' }}>Phone</label>
                        <p style={{ fontWeight: '500' }}>{profile?.phone}</p>
                      </div>
                      <div>
                        <label style={{ color: '#7F8C8D', fontSize: '0.9rem' }}>Date of Birth</label>
                        <p style={{ fontWeight: '500' }}>
                          {profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not set'}
                        </p>
                      </div>
                      <div>
                        <label style={{ color: '#7F8C8D', fontSize: '0.9rem' }}>Gender</label>
                        <p style={{ fontWeight: '500', textTransform: 'capitalize' }}>
                          {profile?.gender || 'Not set'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {profile?.role === 'patient' && (
                    <>
                      <div>
                        <h3 style={{ color: '#2C3E50', marginBottom: '1rem' }}>Medical Information</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                          <div>
                            <label style={{ color: '#7F8C8D', fontSize: '0.9rem' }}>Blood Group</label>
                            <p style={{ fontWeight: '500' }}>{formData.bloodGroup || 'Not set'}</p>
                          </div>
                          <div>
                            <label style={{ color: '#7F8C8D', fontSize: '0.9rem' }}>Height</label>
                            <p style={{ fontWeight: '500' }}>{formData.height ? `${formData.height} cm` : 'Not set'}</p>
                          </div>
                          <div>
                            <label style={{ color: '#7F8C8D', fontSize: '0.9rem' }}>Weight</label>
                            <p style={{ fontWeight: '500' }}>{formData.weight ? `${formData.weight} kg` : 'Not set'}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 style={{ color: '#2C3E50', marginBottom: '1rem' }}>Address</h3>
                        <p>{formData.address.street || 'No address provided'}</p>
                        <p>
                          {[formData.address.city, formData.address.state, formData.address.zipCode, formData.address.country]
                            .filter(Boolean).join(', ') || 'No address provided'}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleSubmit}>
                <h3 style={{ color: '#2C3E50', marginBottom: '1rem' }}>Personal Information</h3>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '2px solid #E0E0E0',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '2px solid #E0E0E0',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      background: '#F5F5F5'
                    }}
                    disabled
                  />
                  <small style={{ color: '#7F8C8D' }}>Email cannot be changed</small>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '2px solid #E0E0E0',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '2px solid #E0E0E0',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '2px solid #E0E0E0',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {user?.role === 'patient' && (
                  <>
                    <h3 style={{ color: '#2C3E50', margin: '2rem 0 1rem' }}>Medical Information</h3>
                    
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Blood Group
                      </label>
                      <select
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '0.8rem',
                          border: '2px solid #E0E0E0',
                          borderRadius: '8px',
                          fontSize: '1rem'
                        }}
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                          Height (cm)
                        </label>
                        <input
                          type="number"
                          name="height"
                          value={formData.height}
                          onChange={handleChange}
                          style={{
                            width: '100%',
                            padding: '0.8rem',
                            border: '2px solid #E0E0E0',
                            borderRadius: '8px',
                            fontSize: '1rem'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          name="weight"
                          value={formData.weight}
                          onChange={handleChange}
                          style={{
                            width: '100%',
                            padding: '0.8rem',
                            border: '2px solid #E0E0E0',
                            borderRadius: '8px',
                            fontSize: '1rem'
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Allergies (comma separated)
                      </label>
                      <input
                        type="text"
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleChange}
                        placeholder="e.g., Penicillin, Peanuts, Dust"
                        style={{
                          width: '100%',
                          padding: '0.8rem',
                          border: '2px solid #E0E0E0',
                          borderRadius: '8px',
                          fontSize: '1rem'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Chronic Conditions (comma separated)
                      </label>
                      <input
                        type="text"
                        name="chronicConditions"
                        value={formData.chronicConditions}
                        onChange={handleChange}
                        placeholder="e.g., Hypertension, Diabetes"
                        style={{
                          width: '100%',
                          padding: '0.8rem',
                          border: '2px solid #E0E0E0',
                          borderRadius: '8px',
                          fontSize: '1rem'
                        }}
                      />
                    </div>

                    <h3 style={{ color: '#2C3E50', margin: '2rem 0 1rem' }}>Address</h3>
                    
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '0.8rem',
                          border: '2px solid #E0E0E0',
                          borderRadius: '8px',
                          fontSize: '1rem'
                        }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                          City
                        </label>
                        <input
                          type="text"
                          name="address.city"
                          value={formData.address.city}
                          onChange={handleChange}
                          style={{
                            width: '100%',
                            padding: '0.8rem',
                            border: '2px solid #E0E0E0',
                            borderRadius: '8px',
                            fontSize: '1rem'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                          State
                        </label>
                        <input
                          type="text"
                          name="address.state"
                          value={formData.address.state}
                          onChange={handleChange}
                          style={{
                            width: '100%',
                            padding: '0.8rem',
                            border: '2px solid #E0E0E0',
                            borderRadius: '8px',
                            fontSize: '1rem'
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                          Zip Code
                        </label>
                        <input
                          type="text"
                          name="address.zipCode"
                          value={formData.address.zipCode}
                          onChange={handleChange}
                          style={{
                            width: '100%',
                            padding: '0.8rem',
                            border: '2px solid #E0E0E0',
                            borderRadius: '8px',
                            fontSize: '1rem'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                          Country
                        </label>
                        <input
                          type="text"
                          name="address.country"
                          value={formData.address.country}
                          onChange={handleChange}
                          style={{
                            width: '100%',
                            padding: '0.8rem',
                            border: '2px solid #E0E0E0',
                            borderRadius: '8px',
                            fontSize: '1rem'
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage