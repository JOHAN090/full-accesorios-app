import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBolt, FaPhone, FaMapMarkerAlt, FaFacebook, FaInstagram, FaWhatsapp, FaTiktok } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import './Footer.css';

const Footer = () => {
  const location = useLocation();

  // Don't show footer on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="footer" id="main-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-section">
            <div className="footer-logo">
              <FaBolt className="footer-logo-icon" />
              <span className="footer-logo-text">
                FULL <span className="footer-logo-accent">Accesorios</span>
              </span>
            </div>
            <p className="footer-description">
              Soluciones Tecnológicas - Tu tienda de confianza para accesorios electrónicos de calidad en La Paz, Bolivia.
            </p>
            <div className="footer-socials">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" id="footer-social-facebook" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" id="footer-social-instagram" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://wa.me/59169865195" target="_blank" rel="noopener noreferrer" className="footer-social-link" id="footer-social-whatsapp" aria-label="WhatsApp">
                <FaWhatsapp />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" id="footer-social-tiktok" aria-label="TikTok">
                <FaTiktok />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-section-title">Enlaces Rápidos</h4>
            <nav className="footer-links">
              <Link to="/" className="footer-link" id="footer-link-inicio">Inicio</Link>
              <Link to="/tienda" className="footer-link" id="footer-link-tienda">Tienda</Link>
              <Link to="/ofertas" className="footer-link" id="footer-link-ofertas">Ofertas</Link>
              <Link to="/contacto" className="footer-link" id="footer-link-contacto">Contáctanos</Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4 className="footer-section-title">Contacto</h4>
            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <FaPhone className="footer-contact-icon" />
                <a href="tel:+59169865195" className="footer-contact-text">69865195</a>
              </div>
              <div className="footer-contact-item">
                <HiOutlineMail className="footer-contact-icon" />
                <a href="mailto:info@fullaccesorios.com" className="footer-contact-text">info@fullaccesorios.com</a>
              </div>
              <div className="footer-contact-item">
                <FaMapMarkerAlt className="footer-contact-icon" />
                <span className="footer-contact-text">La Paz, Bolivia</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} FULL Accesorios - Soluciones Tecnológicas. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
