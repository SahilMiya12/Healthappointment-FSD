import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useState, useEffect, useRef } from 'react'

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setIsProfileMenuOpen(false)
  }

  // Main navigation links - only public pages
  const mainNavLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/doctors', label: 'Doctors' },
    { path: '/contact', label: 'Contact' }
  ]

  const getDashboardLink = () => {
    if (!user) return '/login'
    switch (user.role) {
      case 'patient': return '/dashboard'
      case 'doctor': return '/doctor/dashboard'
      case 'admin': return '/admin/dashboard'
      default: return '/'
    }
  }

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'admin': return 'fa-shield-alt'
      case 'doctor': return 'fa-stethoscope'
      case 'patient': return 'fa-user'
      default: return 'fa-user'
    }
  }

  const getRoleColor = () => {
    switch (user?.role) {
      case 'admin': return '#E74C3C'
      case 'doctor': return '#3498DB'
      case 'patient': return '#27AE60'
      default: return '#2A5C7F'
    }
  }

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link to="/">
            Health<span>Care</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#2A5C7F'
          }}
        >
          <i className={`fas fa-${isMenuOpen ? 'times' : 'bars'}`}></i>
        </button>

        {/* Navigation Menu - Only main pages */}
        <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul>
            {mainNavLinks.map((link) => (
              <li key={link.path}>
                <NavLink 
                  to={link.path} 
                  onClick={() => setIsMenuOpen(false)}
                  style={({ isActive }) => ({
                    fontWeight: isActive ? '600' : '400',
                    color: isActive ? '#2A5C7F' : '#333'
                  })}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Auth Buttons / User Profile */}
        <div className="auth-buttons">
          {user ? (
            <div style={{ position: 'relative' }} ref={profileMenuRef}>
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '30px',
                  transition: 'all 0.3s ease',
                  backgroundColor: isProfileMenuOpen ? '#F0F0F0' : 'transparent'
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  background: getRoleColor(),
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.9rem'
                }}>
                  <i className={`fas ${getRoleIcon()}`}></i>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: '600', color: '#2C3E50', fontSize: '0.9rem' }}>
                    {user.name ? user.name.split(' ')[0] : 'User'}
                  </div>
                  <div style={{ 
                    fontSize: '0.65rem', 
                    color: getRoleColor(),
                    textTransform: 'capitalize'
                  }}>
                    {user.role}
                  </div>
                </div>
                <i className={`fas fa-chevron-${isProfileMenuOpen ? 'up' : 'down'}`} style={{ color: '#7F8C8D', fontSize: '0.7rem' }}></i>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  width: '280px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                  marginTop: '0.75rem',
                  overflow: 'hidden',
                  zIndex: 1000,
                  animation: 'slideDown 0.2s ease'
                }}>
                  {/* User Info Header */}
                  <div style={{
                    padding: '1.25rem',
                    background: `linear-gradient(135deg, ${getRoleColor()}15, white)`,
                    borderBottom: `1px solid ${getRoleColor()}30`,
                    textAlign: 'center'
                  }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: getRoleColor(),
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.75rem',
                      color: 'white',
                      fontSize: '1.5rem'
                    }}>
                      <i className={`fas ${getRoleIcon()}`}></i>
                    </div>
                    <div style={{ fontWeight: '600', color: '#2C3E50', marginBottom: '0.25rem' }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#7F8C8D' }}>{user.email}</div>
                    <div style={{
                      display: 'inline-block',
                      background: getRoleColor(),
                      color: 'white',
                      padding: '0.2rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.7rem',
                      marginTop: '0.5rem',
                      textTransform: 'capitalize'
                    }}>
                      {user.role} Account
                    </div>
                  </div>

                  {/* Dashboard Links based on role */}
                  <div style={{ padding: '0.5rem 0' }}>
                    <Link
                      to={getDashboardLink()}
                      onClick={() => setIsProfileMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.8rem',
                        padding: '0.75rem 1.25rem',
                        color: '#333',
                        textDecoration: 'none',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                    >
                      <i className="fas fa-tachometer-alt" style={{ width: '20px', color: getRoleColor() }}></i>
                      <span>Dashboard</span>
                    </Link>

                    {/* Patient-specific links */}
                    {user.role === 'patient' && (
                      <>
                        <Link
                          to="/my-appointments"
                          onClick={() => setIsProfileMenuOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.8rem',
                            padding: '0.75rem 1.25rem',
                            color: '#333',
                            textDecoration: 'none',
                            transition: 'background 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                        >
                          <i className="fas fa-calendar-alt" style={{ width: '20px', color: getRoleColor() }}></i>
                          <span>My Appointments</span>
                        </Link>
                        <Link
                          to="/book-appointment"
                          onClick={() => setIsProfileMenuOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.8rem',
                            padding: '0.75rem 1.25rem',
                            color: '#333',
                            textDecoration: 'none',
                            transition: 'background 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                        >
                          <i className="fas fa-plus-circle" style={{ width: '20px', color: getRoleColor() }}></i>
                          <span>Book Appointment</span>
                        </Link>
                      </>
                    )}

                    {/* Doctor-specific links */}
                    {user.role === 'doctor' && (
                      <>
                        <Link
                          to="/my-schedule"
                          onClick={() => setIsProfileMenuOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.8rem',
                            padding: '0.75rem 1.25rem',
                            color: '#333',
                            textDecoration: 'none',
                            transition: 'background 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                        >
                          <i className="fas fa-calendar-week" style={{ width: '20px', color: getRoleColor() }}></i>
                          <span>My Schedule</span>
                        </Link>
                        <Link
                          to="/patients"
                          onClick={() => setIsProfileMenuOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.8rem',
                            padding: '0.75rem 1.25rem',
                            color: '#333',
                            textDecoration: 'none',
                            transition: 'background 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                        >
                          <i className="fas fa-users" style={{ width: '20px', color: getRoleColor() }}></i>
                          <span>My Patients</span>
                        </Link>
                      </>
                    )}

                    {/* Admin-specific links */}
                    {user.role === 'admin' && (
                      <>
                        <Link
                          to="/patients"
                          onClick={() => setIsProfileMenuOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.8rem',
                            padding: '0.75rem 1.25rem',
                            color: '#333',
                            textDecoration: 'none',
                            transition: 'background 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                        >
                          <i className="fas fa-users" style={{ width: '20px', color: getRoleColor() }}></i>
                          <span>Manage Patients</span>
                        </Link>
                        <Link
                          to="/doctors/manage"
                          onClick={() => setIsProfileMenuOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.8rem',
                            padding: '0.75rem 1.25rem',
                            color: '#333',
                            textDecoration: 'none',
                            transition: 'background 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                        >
                          <i className="fas fa-user-md" style={{ width: '20px', color: getRoleColor() }}></i>
                          <span>Manage Doctors</span>
                        </Link>
                      </>
                    )}

                    <div style={{ height: '1px', background: '#E0E0E0', margin: '0.5rem 0' }}></div>

                    <Link
                      to="/profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.8rem',
                        padding: '0.75rem 1.25rem',
                        color: '#333',
                        textDecoration: 'none',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                    >
                      <i className="fas fa-user-circle" style={{ width: '20px', color: getRoleColor() }}></i>
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setIsProfileMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.8rem',
                        padding: '0.75rem 1.25rem',
                        color: '#333',
                        textDecoration: 'none',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                    >
                      <i className="fas fa-cog" style={{ width: '20px', color: getRoleColor() }}></i>
                      <span>Settings</span>
                    </Link>

                    <div style={{ height: '1px', background: '#E0E0E0', margin: '0.5rem 0' }}></div>

{/* Admin-specific links */}
{user.role === 'admin' && (
  <>
    <Link
      to="/admin/dashboard"
      onClick={() => setIsProfileMenuOpen(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        padding: '0.75rem 1.25rem',
        color: '#333',
        textDecoration: 'none',
        transition: 'background 0.2s ease'
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
    >
      <i className="fas fa-tachometer-alt" style={{ width: '20px', color: '#E74C3C' }}></i>
      <span>Dashboard</span>
    </Link>
    <Link
      to="/all-appointments"
      onClick={() => setIsProfileMenuOpen(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        padding: '0.75rem 1.25rem',
        color: '#333',
        textDecoration: 'none',
        transition: 'background 0.2s ease'
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
    >
      <i className="fas fa-calendar-alt" style={{ width: '20px', color: '#E74C3C' }}></i>
      <span>All Appointments</span>
    </Link>
    <Link
      to="/manage-doctors"
      onClick={() => setIsProfileMenuOpen(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        padding: '0.75rem 1.25rem',
        color: '#333',
        textDecoration: 'none',
        transition: 'background 0.2s ease'
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
    >
      <i className="fas fa-user-md" style={{ width: '20px', color: '#E74C3C' }}></i>
      <span>Manage Doctors</span>
    </Link>
    <Link
      to="/manage-patients"
      onClick={() => setIsProfileMenuOpen(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        padding: '0.75rem 1.25rem',
        color: '#333',
        textDecoration: 'none',
        transition: 'background 0.2s ease'
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
    >
      <i className="fas fa-users" style={{ width: '20px', color: '#E74C3C' }}></i>
      <span>Manage Patients</span>
    </Link>
  </>
)}

                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.8rem',
                        padding: '0.75rem 1.25rem',
                        color: '#E74C3C',
                        background: 'none',
                        border: 'none',
                        width: '100%',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease',
                        fontWeight: '500'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#FDEBEA'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                    >
                      <i className="fas fa-sign-out-alt" style={{ width: '20px' }}></i>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>Login</Link>
              <Link to="/register" className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem' }}>Register</Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block !important;
          }
          .nav-menu {
            position: fixed;
            top: 80px;
            left: -100%;
            width: 100%;
            height: calc(100vh - 80px);
            background: white;
            transition: 0.3s ease;
            padding: 2rem;
            z-index: 999;
          }
          .nav-menu.active {
            left: 0;
          }
          .nav-menu ul {
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
          }
        }
      `}</style>
    </header>
  )
}

export default Header