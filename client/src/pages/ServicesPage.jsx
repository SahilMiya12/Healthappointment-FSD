import { Link } from 'react-router-dom'


const ServicesPage = () => {
  const services = [
    {
      id: 1,
      icon: 'fa-stethoscope',
      title: 'General Checkup',
      description: 'Comprehensive health checkups and preventive care',
      features: ['Annual physical exams', 'Health screenings', 'Vaccinations', 'Health risk assessments'],
      price: '$99',
      duration: '30 mins'
    },
    {
      id: 2,
      icon: 'fa-heartbeat',
      title: 'Cardiology',
      description: 'Expert heart care and cardiovascular treatments',
      features: ['Heart consultations', 'ECG/EKG', 'Echocardiogram', 'Stress tests', 'Holter monitoring'],
      price: '$199',
      duration: '45 mins'
    },
    {
      id: 3,
      icon: 'fa-brain',
      title: 'Neurology',
      description: 'Advanced neurological care and treatments',
      features: ['Neurological exams', 'EMG/NCS', 'EEG', 'Headache management', 'Movement disorders'],
      price: '$249',
      duration: '60 mins'
    },
    {
      id: 4,
      icon: 'fa-tooth',
      title: 'Dental Care',
      description: 'Complete dental services for a healthy smile',
      features: ['Cleanings', 'Fillings', 'Root canals', 'Extractions', 'Cosmetic dentistry'],
      price: '$79',
      duration: '45 mins'
    },
    {
      id: 5,
      icon: 'fa-bone',
      title: 'Orthopedics',
      description: 'Specialized care for bones and joints',
      features: ['Joint replacements', 'Sports medicine', 'Physical therapy', 'Fracture care', 'Arthritis management'],
      price: '$179',
      duration: '45 mins'
    },
    {
      id: 6,
      icon: 'fa-child',
      title: 'Pediatrics',
      description: 'Comprehensive healthcare for children',
      features: ['Well-child visits', 'Immunizations', 'Developmental screening', 'School physicals', 'Pediatric urgent care'],
      price: '$89',
      duration: '30 mins'
    },
    {
      id: 7,
      icon: 'fa-eye',
      title: 'Ophthalmology',
      description: 'Complete eye care services',
      features: ['Eye exams', 'Cataract surgery', 'Glaucoma treatment', 'Contact lens fitting', 'LASIK consultation'],
      price: '$129',
      duration: '45 mins'
    },
    {
      id: 8,
      icon: 'fa-lungs',
      title: 'Pulmonology',
      description: 'Respiratory and lung care',
      features: ['Pulmonary function tests', 'Asthma management', 'Sleep studies', 'Bronchoscopy', 'COPD treatment'],
      price: '$189',
      duration: '60 mins'
    },
    {
      id: 9,
      icon: 'fa-female',
      title: 'Gynecology',
      description: 'Women\'s health services',
      features: ['Annual exams', 'Prenatal care', 'Family planning', 'Menopause management', 'Ultrasounds'],
      price: '$149',
      duration: '45 mins'
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
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Our Medical Services</h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', opacity: 0.95 }}>
            We offer a comprehensive range of healthcare services delivered by experienced specialists
            using state-of-the-art technology.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {services.map(service => (
              <div
                key={service.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '2rem',
                  boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {/* Price Tag */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: '#27AE60',
                  color: 'white',
                  padding: '0.3rem 1rem',
                  borderRadius: '20px',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}>
                  {service.price}
                </div>

                <div style={{
                  width: '70px',
                  height: '70px',
                  background: '#ECF0F1',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  fontSize: '2rem',
                  color: '#2A5C7F'
                }}>
                  <i className={`fas ${service.icon}`}></i>
                </div>

                <h3 style={{ fontSize: '1.5rem', color: '#2C3E50', marginBottom: '0.5rem' }}>
                  {service.title}
                </h3>
                
                <p style={{ color: '#7F8C8D', marginBottom: '1rem', lineHeight: '1.6' }}>
                  {service.description}
                </p>

                <div style={{ marginBottom: '1.5rem' }}>
                  <span style={{
                    background: '#ECF0F1',
                    padding: '0.2rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    color: '#2A5C7F'
                  }}>
                    <i className="far fa-clock" style={{ marginRight: '0.3rem' }}></i>
                    {service.duration}
                  </span>
                </div>

                <h4 style={{ color: '#2C3E50', marginBottom: '1rem', fontSize: '1rem' }}>
                  What's included:
                </h4>
                
                <ul style={{ listStyle: 'none', marginBottom: '1.5rem' }}>
                  {service.features.map((feature, index) => (
                    <li key={index} style={{
                      marginBottom: '0.5rem',
                      color: '#7F8C8D',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <i className="fas fa-check" style={{ color: '#27AE60', fontSize: '0.9rem' }}></i>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/book-appointment"
                  style={{
                    display: 'inline-block',
                    width: '100%',
                    padding: '1rem',
                    background: '#2A5C7F',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontWeight: '500',
                    transition: 'background 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#4A90E2'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#2A5C7F'}
                >
                  Book Appointment
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section style={{ background: '#F8FAFC', padding: '4rem 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', color: '#2C3E50', textAlign: 'center', marginBottom: '3rem' }}>
            Why Choose Our Services
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                icon: 'fa-user-md',
                title: 'Expert Specialists',
                desc: 'Board-certified doctors with years of experience'
              },
              {
                icon: 'fa-microscope',
                title: 'Modern Technology',
                desc: 'State-of-the-art diagnostic equipment'
              },
              {
                icon: 'fa-clock',
                title: 'Minimal Wait Time',
                desc: 'Efficient scheduling and quick appointments'
              },
              {
                icon: 'fa-hand-holding-heart',
                title: 'Personalized Care',
                desc: 'Treatment plans tailored to your needs'
              }
            ].map((item, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  fontSize: '2rem',
                  color: '#2A5C7F',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                }}>
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <h3 style={{ marginBottom: '0.5rem' }}>{item.title}</h3>
                <p style={{ color: '#7F8C8D' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default ServicesPage