import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await login(formData.email, formData.password)
      // Redirect based on user role
      if (result.user.role === 'patient') {
        navigate('/dashboard')
      } else if (result.user.role === 'doctor') {
        navigate('/doctor/dashboard')
      } else if (result.user.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/')
      }
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Please login to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
              <span 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
              </span>
            </div>
          </div>

          {/* Demo Credentials */}
          <div style={{
            background: '#F8FAFC',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.85rem'
          }}>
            <p style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#2C3E50' }}>
              <i className="fas fa-info-circle"></i> Demo Credentials:
            </p>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <div>
                <span style={{ fontWeight: '500', color: '#27AE60' }}>Patient:</span>
                <span style={{ color: '#7F8C8D' }}> patient@healthcare.com / patient123</span>
              </div>
              <div>
                <span style={{ fontWeight: '500', color: '#3498DB' }}>Doctor:</span>
                <span style={{ color: '#7F8C8D' }}> sarah.johnson@healthcare.com / doctor123</span>
              </div>
              <div>
                <span style={{ fontWeight: '500', color: '#E74C3C' }}>Admin:</span>
                <span style={{ color: '#7F8C8D' }}> admin@healthcare.com / admin123</span>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login