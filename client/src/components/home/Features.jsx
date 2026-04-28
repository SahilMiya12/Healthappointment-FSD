const Features = () => {
  const features = [
    {
      icon: 'fa-calendar-check',
      title: 'Easy Appointments',
      description: 'Book appointments with your preferred doctors in just a few clicks'
    },
    {
      icon: 'fa-file-medical',
      title: 'Medical Records',
      description: 'Secure access to your medical history and reports anytime'
    },
    {
      icon: 'fa-user-md',
      title: 'Expert Doctors',
      description: 'Consult with experienced healthcare professionals'
    },
    {
      icon: 'fa-clock',
      title: '24/7 Support',
      description: 'Round-the-clock assistance for all your healthcare needs'
    }
  ]

  return (
    <section className="features">
      <div className="container">
        <h2>Why Choose Us</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                <i className={`fas ${feature.icon}`}></i>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features