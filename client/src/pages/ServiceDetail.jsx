import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const ServiceDetail = () => {
  const { serviceName } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [showBooking, setShowBooking] = useState(false)

  // Service data mapping
  const serviceData = {
    'general-checkup': {
      id: 1,
      title: 'General Checkup',
      icon: 'fa-stethoscope',
      description: 'Comprehensive health checkups and preventive care to maintain your wellbeing.',
      longDescription: 'Our general checkup service includes a thorough physical examination, review of medical history, and preventive health screenings. We focus on early detection and prevention of potential health issues.',
      price: '$99',
      duration: '30 mins',
      bgColor: '#2A5C7F',
      features: [
        'Complete physical examination',
        'Blood pressure monitoring',
        'Cholesterol screening',
        'Blood glucose test',
        'BMI calculation',
        'Health risk assessment',
        'Vaccination review',
        'Lifestyle counseling'
      ],
      preparation: [
        'Fast for 8-12 hours before blood tests',
        'Bring list of current medications',
        'Wear comfortable clothing',
        'Bring previous medical records if available'
      ],
      faq: [
        {
          q: 'How often should I get a general checkup?',
          a: 'It is recommended to have a general checkup annually, or more frequently if you have existing health conditions.'
        },
        {
          q: 'Do I need to fast before the checkup?',
          a: 'Yes, fasting for 8-12 hours is required for accurate blood test results.'
        }
      ]
    },
    'cardiology': {
      id: 2,
      title: 'Cardiology',
      icon: 'fa-heartbeat',
      description: 'Expert heart care and cardiovascular treatments from experienced cardiologists.',
      longDescription: 'Our cardiology department offers comprehensive heart care services, from diagnostic testing to treatment of various cardiovascular conditions. We use state-of-the-art technology for accurate diagnosis and effective treatment.',
      price: '$199',
      duration: '45 mins',
      bgColor: '#E74C3C',
      features: [
        'Heart consultations',
        'ECG/EKG testing',
        'Echocardiogram',
        'Stress tests',
        'Holter monitoring',
        'Blood pressure management',
        'Cholesterol management',
        'Heart disease prevention'
      ],
      preparation: [
        'Avoid caffeine for 24 hours before test',
        'Wear comfortable clothing and walking shoes',
        'Bring list of current medications',
        'Arrive 15 minutes early'
      ],
      faq: [
        {
          q: 'What symptoms require a cardiology visit?',
          a: 'Chest pain, shortness of breath, irregular heartbeat, dizziness, or high blood pressure.'
        },
        {
          q: 'How long does a stress test take?',
          a: 'A typical stress test takes about 60 minutes, including preparation and recovery time.'
        }
      ]
    },
    'dental-care': {
      id: 3,
      title: 'Dental Care',
      icon: 'fa-tooth',
      description: 'Complete dental services for a healthy smile.',
      longDescription: 'Our dental care services cover everything from routine cleanings to complex procedures. We focus on preventive care and patient education to maintain optimal oral health.',
      price: '$79',
      duration: '45 mins',
      bgColor: '#27AE60',
      features: [
        'Professional cleanings',
        'Fillings and restorations',
        'Root canals',
        'Extractions',
        'Cosmetic dentistry',
        'Teeth whitening',
        'Dental implants',
        'Orthodontic consultations'
      ],
      preparation: [
        'Brush and floss before appointment',
        'Bring dental insurance information',
        'List any dental concerns',
        'Arrive 10 minutes early for paperwork'
      ],
      faq: [
        {
          q: 'How often should I visit the dentist?',
          a: 'It is recommended to visit the dentist every 6 months for regular checkups and cleanings.'
        },
        {
          q: 'Does dental care hurt?',
          a: 'We use modern anesthesia and techniques to ensure your comfort during procedures.'
        }
      ]
    },
    'emergency-care': {
      id: 4,
      title: 'Emergency Care',
      icon: 'fa-ambulance',
      description: '24/7 emergency medical services for urgent healthcare needs.',
      longDescription: 'Our emergency department is open 24/7 with board-certified emergency physicians and specialized trauma care. We provide immediate care for life-threatening conditions and serious injuries.',
      price: 'Varies',
      duration: '24/7',
      bgColor: '#E67E22',
      features: [
        '24/7 emergency services',
        'Trauma care',
        'Acute illness treatment',
        'Injury care',
        'Cardiac emergencies',
        'Stroke care',
        'Pediatric emergencies',
        'On-site laboratory and imaging'
      ],
      preparation: [
        'Call 911 for life-threatening emergencies',
        'Bring ID and insurance card',
        'List of current medications',
        'Emergency contact information'
      ],
      faq: [
        {
          q: 'When should I go to the emergency room?',
          a: 'Go to ER for life-threatening conditions, severe chest pain, difficulty breathing, severe bleeding, or head injuries.'
        },
        {
          q: 'What is the average wait time?',
          a: 'Wait times vary based on severity. Critical cases are seen immediately.'
        }
      ]
    },
    'lab-tests': {
      id: 5,
      title: 'Lab Tests',
      icon: 'fa-flask',
      description: 'Comprehensive laboratory testing services for accurate diagnosis.',
      longDescription: 'Our state-of-the-art laboratory offers a wide range of diagnostic tests with quick and accurate results. We maintain the highest standards of quality and precision.',
      price: '$45-$200',
      duration: '15-30 mins',
      bgColor: '#9B59B6',
      features: [
        'Blood tests',
        'Urinalysis',
        'Thyroid panel',
        'Lipid profile',
        'Liver function tests',
        'Kidney function tests',
        'Vitamin deficiency tests',
        'Allergy testing'
      ],
      preparation: [
        'Follow specific fasting instructions for your test',
        'Stay hydrated (water only)',
        'Bring doctor\'s order/referral',
        'Inform staff of medications'
      ],
      faq: [
        {
          q: 'How long do lab results take?',
          a: 'Most routine tests are completed within 24-48 hours. Some specialized tests may take longer.'
        },
        {
          q: 'Do I need a doctor\'s order for lab tests?',
          a: 'Yes, most lab tests require a referral from a healthcare provider.'
        }
      ]
    }
  }

  const service = serviceData[serviceName]

  useEffect(() => {
    if (!service) {
      navigate('/services')
    }
  }, [service, navigate])

  if (!service) {
    return null
  }

  const availableSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']

  const handleBookAppointment = () => {
    if (!user) {
      toast.error('Please login to book an appointment')
      navigate('/login')
      return
    }
    
    if (!selectedDate || !selectedTime) {
      toast.error('Please select date and time')
      return
    }

    toast.success(`Appointment booked for ${service.title} on ${selectedDate} at ${selectedTime}`)
    setShowBooking(false)
    setSelectedDate('')
    setSelectedTime('')
  }

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: `linear-gradient(135deg, ${service.bgColor}, ${service.bgColor}dd)`,
        color: 'white',
        padding: '4rem 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <Link 
            to="/services" 
            style={{
              color: 'white',
              textDecoration: 'none',
              display: 'inline-block',
              marginBottom: '2rem',
              opacity: 0.9
            }}
          >
            <i className="fas fa-arrow-left"></i> Back to Services
          </Link>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '2.5rem'
          }}>
            <i className={`fas ${service.icon}`}></i>
          </div>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>{service.title}</h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', opacity: 0.95 }}>
            {service.description}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '2rem'
          }}>
            {/* Left Column - Details */}
            <div>
              <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
                marginBottom: '2rem'
              }}>
                <h2 style={{ color: '#2C3E50', marginBottom: '1rem' }}>About this Service</h2>
                <p style={{ color: '#7F8C8D', lineHeight: '1.8', marginBottom: '2rem' }}>
                  {service.longDescription}
                </p>

                <h3 style={{ color: '#2C3E50', marginBottom: '1rem' }}>Key Features</h3>
                <ul style={{
                  listStyle: 'none',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1rem',
                  marginBottom: '2rem'
                }}>
                  {service.features.map((feature, index) => (
                    <li key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: '#7F8C8D'
                    }}>
                      <i className="fas fa-check-circle" style={{ color: '#27AE60' }}></i>
                      {feature}
                    </li>
                  ))}
                </ul>

                <h3 style={{ color: '#2C3E50', marginBottom: '1rem' }}>Preparation</h3>
                <ul style={{
                  listStyle: 'none',
                  marginBottom: '2rem'
                }}>
                  {service.preparation.map((item, index) => (
                    <li key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem',
                      color: '#7F8C8D'
                    }}>
                      <i className="fas fa-info-circle" style={{ color: '#3498DB' }}></i>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* FAQ Section */}
              <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
              }}>
                <h2 style={{ color: '#2C3E50', marginBottom: '1.5rem' }}>Frequently Asked Questions</h2>
                {service.faq.map((item, index) => (
                  <div key={index} style={{
                    marginBottom: index < service.faq.length - 1 ? '1.5rem' : 0,
                    paddingBottom: index < service.faq.length - 1 ? '1.5rem' : 0,
                    borderBottom: index < service.faq.length - 1 ? '1px solid #E0E0E0' : 'none'
                  }}>
                    <h4 style={{ color: '#2C3E50', marginBottom: '0.5rem' }}>
                      <i className="fas fa-question-circle" style={{ color: '#2A5C7F', marginRight: '0.5rem' }}></i>
                      {item.q}
                    </h4>
                    <p style={{ color: '#7F8C8D', marginLeft: '2rem' }}>{item.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Booking Card */}
            <div>
              <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
                position: 'sticky',
                top: '100px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem',
                  paddingBottom: '1.5rem',
                  borderBottom: '1px solid #E0E0E0'
                }}>
                  <div>
                    <span style={{
                      fontSize: '2rem',
                      fontWeight: '700',
                      color: '#2A5C7F'
                    }}>{service.price}</span>
                    {service.price !== 'Varies' && <span style={{ color: '#7F8C8D' }}>/visit</span>}
                  </div>
                  <span style={{
                    background: '#ECF0F1',
                    padding: '0.3rem 1rem',
                    borderRadius: '20px',
                    color: '#7F8C8D'
                  }}>
                    <i className="far fa-clock"></i> {service.duration}
                  </span>
                </div>

                {!showBooking ? (
                  <button
                    onClick={() => setShowBooking(true)}
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      fontSize: '1.1rem',
                      marginBottom: '1rem'
                    }}
                  >
                    Book Appointment
                  </button>
                ) : (
                  <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ marginBottom: '1rem' }}>Select Date & Time</h4>
                    
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Date
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        style={{
                          width: '100%',
                          padding: '0.8rem',
                          border: '2px solid #E0E0E0',
                          borderRadius: '8px',
                          marginBottom: '1rem'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Time
                      </label>
                      <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.8rem',
                          border: '2px solid #E0E0E0',
                          borderRadius: '8px'
                        }}
                      >
                        <option value="">Select time</option>
                        {availableSlots.map(slot => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button
                        onClick={() => setShowBooking(false)}
                        className="btn btn-secondary"
                        style={{ flex: 1 }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleBookAppointment}
                        className="btn btn-primary"
                        style={{ flex: 1 }}
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                )}

                <div style={{
                  marginTop: '1.5rem',
                  padding: '1rem',
                  background: '#F8FAFC',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ marginBottom: '0.5rem' }}>Need help?</h4>
                  <p style={{ color: '#7F8C8D', marginBottom: '0.5rem' }}>
                    <i className="fas fa-phone" style={{ marginRight: '0.5rem', color: '#2A5C7F' }}></i>
                    +1 (555) 123-4567
                  </p>
                  <p style={{ color: '#7F8C8D' }}>
                    <i className="fas fa-envelope" style={{ marginRight: '0.5rem', color: '#2A5C7F' }}></i>
                    appointments@healthcareplus.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section style={{ background: '#F8FAFC', padding: '4rem 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', color: '#2C3E50', textAlign: 'center', marginBottom: '3rem' }}>
            Other Services You Might Need
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            {Object.entries(serviceData)
              .filter(([key]) => key !== serviceName)
              .slice(0, 3)
              .map(([key, relatedService]) => (
                <Link
                  key={key}
                  to={`/services/${key}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    background: 'white',
                    padding: '2rem',
                    borderRadius: '12px',
                    boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
                    textAlign: 'center',
                    transition: 'transform 0.3s ease',
                    height: '100%'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: `${relatedService.bgColor}20`,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1rem',
                      fontSize: '1.8rem',
                      color: relatedService.bgColor
                    }}>
                      <i className={`fas ${relatedService.icon}`}></i>
                    </div>
                    <h3 style={{ color: '#2C3E50', marginBottom: '0.5rem' }}>
                      {relatedService.title}
                    </h3>
                    <p style={{ color: '#7F8C8D', fontSize: '0.95rem' }}>
                      {relatedService.description.substring(0, 60)}...
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default ServiceDetail