
import { Link } from 'react-router-dom'

const AboutPage = () => {
  const stats = [
    { number: '15+', label: 'Years of Experience' },
    { number: '50+', label: 'Expert Doctors' },
    { number: '100k+', label: 'Happy Patients' },
    { number: '24/7', label: 'Emergency Support' }
  ]

  const team = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Chief Medical Officer',
      specialization: 'Cardiology',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
      description: 'Leading our cardiac care with 15+ years of experience'
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Head of Neurology',
      specialization: 'Neurology',
      image: 'https://randomuser.me/api/portraits/men/75.jpg',
      description: 'Pioneering neurological treatments and research'
    },
    {
      name: 'Dr. Emily Williams',
      role: 'Pediatrics Director',
      specialization: 'Pediatrics',
      image: 'https://randomuser.me/api/portraits/women/45.jpg',
      description: 'Dedicated to providing compassionate care for children'
    },
    {
      name: 'Dr. James Wilson',
      role: 'Orthopedics Specialist',
      specialization: 'Orthopedics',
      image: 'https://randomuser.me/api/portraits/men/52.jpg',
      description: 'Expert in sports medicine and joint replacements'
    }
  ]

  return (
    <>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #2A5C7F, #4A90E2)',
        color: 'white',
        padding: '4rem 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>About HealthCare Plus</h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto', opacity: 0.95 }}>
            We are committed to providing exceptional healthcare services with compassion, 
            innovation, and excellence.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '3rem',
            marginBottom: '4rem'
          }}>
            <div style={{
              background: 'white',
              padding: '2.5rem',
              borderRadius: '12px',
              boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: '#2A5C7F',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                color: 'white',
                fontSize: '1.5rem'
              }}>
                <i className="fas fa-bullseye"></i>
              </div>
              <h2 style={{ color: '#2C3E50', marginBottom: '1rem' }}>Our Mission</h2>
              <p style={{ color: '#7F8C8D', lineHeight: '1.8' }}>
                To provide accessible, high-quality healthcare services to everyone through 
                innovative technology and compassionate care. We strive to make healthcare 
                more personal, convenient, and effective for our patients.
              </p>
            </div>

            <div style={{
              background: 'white',
              padding: '2.5rem',
              borderRadius: '12px',
              boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: '#27AE60',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                color: 'white',
                fontSize: '1.5rem'
              }}>
                <i className="fas fa-eye"></i>
              </div>
              <h2 style={{ color: '#2C3E50', marginBottom: '1rem' }}>Our Vision</h2>
              <p style={{ color: '#7F8C8D', lineHeight: '1.8' }}>
                To be the leading healthcare platform that transforms how people access and 
                manage their healthcare needs. We envision a future where quality healthcare 
                is accessible to everyone, anywhere, anytime.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '2rem',
            marginBottom: '4rem'
          }}>
            {stats.map((stat, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '3rem', color: '#2A5C7F', marginBottom: '0.5rem' }}>
                  {stat.number}
                </h3>
                <p style={{ color: '#7F8C8D', fontSize: '1.1rem' }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Our Story */}
          <div style={{
            background: '#F8FAFC',
            padding: '3rem',
            borderRadius: '12px',
            marginBottom: '4rem'
          }}>
            <h2 style={{ color: '#2C3E50', marginBottom: '1.5rem', textAlign: 'center' }}>
              Our Story
            </h2>
            <p style={{ color: '#7F8C8D', lineHeight: '1.8', marginBottom: '1rem' }}>
              Founded in 2010, HealthCare Plus began with a simple mission: to make quality 
              healthcare accessible to everyone. What started as a small clinic with just 
              three doctors has grown into a comprehensive healthcare network serving 
              thousands of patients across the region.
            </p>
            <p style={{ color: '#7F8C8D', lineHeight: '1.8' }}>
              Today, we're proud to offer a wide range of medical services with over 50 
              specialized doctors and state-of-the-art facilities. Our commitment to 
              patient-centered care and continuous innovation has made us a trusted name 
              in healthcare.
            </p>
          </div>

          {/* Team Section */}
          <h2 style={{ fontSize: '2.5rem', color: '#2C3E50', textAlign: 'center', marginBottom: '2rem' }}>
            Our Leadership Team
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            {team.map((member, index) => (
              <div
                key={index}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  style={{
                    width: '100%',
                    height: '250px',
                    objectFit: 'cover'
                  }}
                />
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ color: '#2C3E50', marginBottom: '0.3rem' }}>{member.name}</h3>
                  <p style={{ color: '#2A5C7F', fontWeight: '500', marginBottom: '0.5rem' }}>
                    {member.role}
                  </p>
                  <p style={{ color: '#7F8C8D', fontSize: '0.95rem', marginBottom: '1rem' }}>
                    {member.description}
                  </p>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <a href="#" style={{ color: '#7F8C8D', transition: 'color 0.3s ease' }}
                       onMouseEnter={(e) => e.currentTarget.style.color = '#2A5C7F'}
                       onMouseLeave={(e) => e.currentTarget.style.color = '#7F8C8D'}>
                      <i className="fab fa-linkedin"></i>
                    </a>
                    <a href="#" style={{ color: '#7F8C8D', transition: 'color 0.3s ease' }}
                       onMouseEnter={(e) => e.currentTarget.style.color = '#2A5C7F'}
                       onMouseLeave={(e) => e.currentTarget.style.color = '#7F8C8D'}>
                      <i className="fab fa-twitter"></i>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default AboutPage