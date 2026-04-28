import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const SettingsPage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    appointmentReminders: true
  })

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    })
  }

  const handleNotificationChange = (e) => {
    setNotifications({
      ...notifications,
      [e.target.name]: e.target.checked
    })
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    
    try {
      setLoading(true)
      // API call to change password
      // await userService.changePassword(passwordData)
      toast.success('Password changed successfully')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      toast.error('Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        setLoading(true)
        // API call to delete account
        // await userService.deleteAccount()
        toast.success('Account deleted successfully')
        logout()
        navigate('/')
      } catch (error) {
        toast.error('Failed to delete account')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', color: '#2C3E50', marginBottom: '2rem' }}>
            Settings
          </h1>

          {/* Password Change Section */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
            marginBottom: '2rem'
          }}>
            <h2 style={{ color: '#2C3E50', marginBottom: '1.5rem' }}>Change Password</h2>
            
            <form onSubmit={handlePasswordSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
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
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '2px solid #E0E0E0',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                  required
                  minLength="6"
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
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

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Notification Settings */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
            marginBottom: '2rem'
          }}>
            <h2 style={{ color: '#2C3E50', marginBottom: '1.5rem' }}>Notification Preferences</h2>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="email"
                  checked={notifications.email}
                  onChange={handleNotificationChange}
                />
                <span>Email notifications</span>
              </label>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="sms"
                  checked={notifications.sms}
                  onChange={handleNotificationChange}
                />
                <span>SMS notifications</span>
              </label>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="appointmentReminders"
                  checked={notifications.appointmentReminders}
                  onChange={handleNotificationChange}
                />
                <span>Appointment reminders</span>
              </label>
            </div>

            <button
              onClick={() => toast.success('Settings saved')}
              className="btn btn-primary"
              style={{ marginTop: '1rem' }}
            >
              Save Preferences
            </button>
          </div>

          {/* Danger Zone */}
          <div style={{
            background: '#FDEBEA',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
            border: '2px solid #E74C3C'
          }}>
            <h2 style={{ color: '#E74C3C', marginBottom: '1rem' }}>Danger Zone</h2>
            <p style={{ color: '#7F8C8D', marginBottom: '1.5rem' }}>
              Once you delete your account, there is no going back. Please be certain.
            </p>
            
            <button
              onClick={handleDeleteAccount}
              className="btn btn-danger"
              disabled={loading}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage