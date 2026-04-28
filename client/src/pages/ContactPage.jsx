import { useState } from 'react'

import toast from 'react-hot-toast'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Message sent successfully! We\'ll get back to you soon.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
      setIsSubmitting(false)
    }, 1500)
  }

  const departments = [
    {
      name: 'General Inquiries',
      email: 'info@healthcareplus.com',
      phone: '+1 (555) 123-4567',
      icon: 'fa-info-circle'
    },
    {
      name: 'Appointments',
      email: 'appointments@healthcareplus.com',
      phone: '+1 (555) 123-4568',
      icon: 'fa-calendar-check'
    },
    {
      name: 'Billing',
      email: 'billing@healthcareplus.com',
      phone: '+1 (555) 123-4569',
      icon: 'fa-credit-card'
    },
    {
      name: 'Emergency',
      email: 'emergency@healthcareplus.com',
      phone: '+1 (555) 123-4570',
      icon: 'fa-ambulance',
      emergency: true
    }
  ]

  const facilities = [
    {
      name: 'Main Hospital',
      address: '123 Healthcare Avenue, Medical City, MC 12345',
      phone: '+1 (555) 123-4600',
      hours: '24/7 Emergency',
      directions: 'https://maps.google.com'
    },
    {
      name: 'Downtown Clinic',
      address: '456 Wellness Street, Downtown, DT 67890',
      phone: '+1 (555) 123-4700',
      hours: 'Mon-Fri: 8am-8pm, Sat: 9am-5pm',
      directions: 'https://maps.google.com'
    },
    {
      name: 'Westside Medical Center',
      address: '789 Health Boulevard, Westside, WS 13579',
      phone: '+1 (555) 123-4800',
      hours: 'Mon-Fri: 7am-9pm, Sat-Sun: 9am-5pm',
      directions: 'https://maps.google.com'
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
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Contact Us</h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', opacity: 0.95 }}>
            We're here to help. Reach out to us anytime for appointments, inquiries, or emergencies.
          </p>
        </div>
      </section>

      {/* Emergency Banner */}
      <section style={{ background: '#E74C3C', color: 'white', padding: '1rem 0' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap'
          }}>
            <i className="fas fa-exclamation-triangle" style={{ fontSize: '2rem' }}></i>
            <span style={{ fontSize: '1.2rem', fontWeight: '500' }}>
              For Medical Emergencies, Call: <strong>+1 (555) 123-4570</strong> (24/7)
            </span>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', color: '#2C3E50', textAlign: 'center', marginBottom: '3rem' }}>
            Department Contacts
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            {departments.map((dept, index) => (
              <div
                key={index}
                style={{
                  background: dept.emergency ? '#FDEBEA' : 'white',
                  padding: '2rem',
                  borderRadius: '12px',
                  boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
                  border: dept.emergency ? '2px solid #E74C3C' : 'none',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{
                  width: '70px',
                  height: '70px',
                  background: dept.emergency ? '#E74C3C' : '#2A5C7F',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  color: 'white',
                  fontSize: '2rem'
                }}>
                  <i className={`fas ${dept.icon}`}></i>
                </div>
                <h3 style={{ color: '#2C3E50', marginBottom: '0.5rem' }}>{dept.name}</h3>
                <p style={{ color: '#7F8C8D', marginBottom: '1rem' }}>
                  <i className="fas fa-envelope" style={{ marginRight: '0.5rem' }}></i>
                  {dept.email}
                </p>
                <p style={{ color: '#7F8C8D', fontWeight: dept.emergency ? '600' : 'normal' }}>
                  <i className="fas fa-phone" style={{ marginRight: '0.5rem' }}></i>
                  {dept.phone}
                </p>
                {dept.emergency && (
                  <span style={{
                    background: '#E74C3C',
                    color: 'white',
                    padding: '0.2rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    marginTop: '1rem',
                    display: 'inline-block'
                  }}>
                    24/7 Emergency
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section style={{ background: '#F8FAFC', padding: '4rem 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem'
          }}>
            {/* Contact Form */}
            <div>
              <h2 style={{ fontSize: '2rem', color: '#2C3E50', marginBottom: '2rem' }}>
                Send Us a Message
              </h2>

              <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
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
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
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
                    Phone Number
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
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '2px solid #E0E0E0',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="">Select a subject</option>
                    <option value="appointment">Appointment Inquiry</option>
                    <option value="billing">Billing Question</option>
                    <option value="records">Medical Records</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '2px solid #E0E0E0',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '1.1rem',
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Map & Location Info */}
            <div>
              <h2 style={{ fontSize: '2rem', color: '#2C3E50', marginBottom: '2rem' }}>
                Our Locations
              </h2>

              {facilities.map((facility, index) => (
                <div
                  key={index}
                  style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
                    marginBottom: '1.5rem'
                  }}
                >
                  <h3 style={{ color: '#2A5C7F', marginBottom: '1rem' }}>
                    <i className="fas fa-hospital" style={{ marginRight: '0.5rem' }}></i>
                    {facility.name}
                  </h3>
                  <p style={{ marginBottom: '0.5rem', color: '#7F8C8D' }}>
                    <i className="fas fa-map-marker-alt" style={{ width: '20px', marginRight: '0.5rem', color: '#2A5C7F' }}></i>
                    {facility.address}
                  </p>
                  <p style={{ marginBottom: '0.5rem', color: '#7F8C8D' }}>
                    <i className="fas fa-phone" style={{ width: '20px', marginRight: '0.5rem', color: '#2A5C7F' }}></i>
                    {facility.phone}
                  </p>
                  <p style={{ marginBottom: '1rem', color: '#7F8C8D' }}>
                    <i className="far fa-clock" style={{ width: '20px', marginRight: '0.5rem', color: '#2A5C7F' }}></i>
                    {facility.hours}
                  </p>
                  <a
                    href={facility.directions}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#2A5C7F',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontWeight: '500'
                    }}
                  >
                    <i className="fas fa-directions"></i>
                    Get Directions
                  </a>
                </div>
              ))}

              {/* Map Placeholder - Replace with actual Google Maps iframe */}
              <div style={{
                background: '#E0E0E0',
                height: '300px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7F8C8D'
              }}>
                <i className="fas fa-map" style={{ fontSize: '3rem', marginRight: '1rem' }}></i>
                <span>Google Maps Integration</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', color: '#2C3E50', textAlign: 'center', marginBottom: '3rem' }}>
            Frequently Asked Questions
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '2rem'
          }}>
            {[
              {
                q: 'How do I schedule an appointment?',
                a: 'You can schedule appointments online through our website, call our appointment line, or visit any of our locations.'
              },
              {
                q: 'What insurance plans do you accept?',
                a: 'We accept most major insurance plans. Please contact our billing department for specific information about your coverage.'
              },
              {
                q: 'Can I access my medical records online?',
                a: 'Yes, registered patients can access their medical records through our secure patient portal.'
              },
              {
                q: 'What are your visiting hours?',
                a: 'Our main hospital is open 24/7 for emergencies. Clinic hours vary by location - please check our locations section.'
              }
            ].map((faq, index) => (
              <div
                key={index}
                style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
                }}
              >
                <h4 style={{ color: '#2C3E50', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-question-circle" style={{ color: '#2A5C7F' }}></i>
                  {faq.q}
                </h4>
                <p style={{ color: '#7F8C8D', lineHeight: '1.6' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default ContactPage