import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <h1>Your Health, Our Priority</h1>
        <p>
          Comprehensive healthcare solutions with easy appointment booking 
          and secure medical records management
        </p>
        <div className="hero-buttons">
          <Link to="/register" className="btn btn-primary">
            Get Started
          </Link>
          <Link to="/doctors" className="btn btn-secondary">
            Find a Doctor
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Hero