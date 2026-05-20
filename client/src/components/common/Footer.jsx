import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>HealthCare Plus</h3>
            <p>
              Your trusted partner in healthcare. We provide comprehensive 
              medical services with care and compassion.
            </p>
            <div className="social-links">
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-linkedin"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Our Services</Link></li>
              <li><Link to="/doctors">Our Doctors</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Services</h3>
            <ul>
              <li><Link to="/services/general-checkup">General Checkup</Link></li>
              <li><Link to="/services/cardiology">Cardiology</Link></li>
              <li><Link to="/services/dental-care">Dental Care</Link></li>
              <li><Link to="/services/emergency-care">Emergency Care</Link></li>
              <li><Link to="/services/lab-tests">Lab Tests</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact Info</h3>
            <ul>
              <li><i className="fas fa-map-marker-alt"></i> 123 Health St, Medical City</li>
              <li><i className="fas fa-phone"></i> +1 (555) 123-4567</li>
              <li><i className="fas fa-envelope"></i> info@healthcareplus.com</li>
              <li><i className="fas fa-clock"></i> 24/7 Emergency Services</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} HealthCare Plus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;