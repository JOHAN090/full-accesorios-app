import React, { useState } from 'react';
import { FaPhone, FaMapMarkerAlt, FaWhatsapp, FaClock } from 'react-icons/fa';
import { HiOutlineMail, HiOutlinePaperAirplane } from 'react-icons/hi';
import { toast } from 'react-toastify';
import './Contacto.css';

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: '',
  });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.email || !formData.mensaje) {
      toast.error('Por favor completa todos los campos');
      return;
    }
    setSending(true);
    // Simulate sending (no backend endpoint for contact)
    setTimeout(() => {
      toast.success('¡Mensaje enviado exitosamente! Te contactaremos pronto.');
      setFormData({ nombre: '', email: '', mensaje: '' });
      setSending(false);
    }, 1200);
  };

  const contactInfo = [
    {
      icon: <FaPhone />,
      title: 'Teléfono',
      value: '69865195',
      link: 'tel:+59169865195',
    },
    {
      icon: <FaWhatsapp />,
      title: 'WhatsApp',
      value: '69865195',
      link: 'https://wa.me/59169865195',
    },
    {
      icon: <HiOutlineMail />,
      title: 'Email',
      value: 'info@fullaccesorios.com',
      link: 'mailto:info@fullaccesorios.com',
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Ubicación',
      value: 'La Paz, Bolivia',
      link: 'https://maps.app.goo.gl/Hb3kyVaLkjrFvhL4A',
    },
  ];

  return (
    <div className="contacto-page" id="contacto-page">
      <div className="container">
        {/* Header */}
        <div className="contacto-header">
          <h1 className="contacto-title">Contáctanos</h1>
          <p className="contacto-subtitle">
            ¿Tienes alguna pregunta? Estamos aquí para ayudarte
          </p>
        </div>

        <div className="contacto-grid">
          {/* Contact Info + Map */}
          <div className="contacto-info-section">
            <div className="contacto-info-cards">
              {contactInfo.map((info, index) => (
                <a
                  key={index}
                  href={info.link}
                  target={info.link.startsWith('http') ? '_blank' : undefined}
                  rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="contacto-info-card glass-card"
                  id={`contact-info-${index}`}
                >
                  <div className="contacto-info-icon">{info.icon}</div>
                  <div>
                    <span className="contacto-info-label">{info.title}</span>
                    <span className="contacto-info-value">{info.value}</span>
                  </div>
                </a>
              ))}
            </div>

            {/* Business Hours */}
            <div className="contacto-hours glass-card">
              <div className="contacto-hours-header">
                <FaClock className="contacto-hours-icon" />
                <h3>Horario de Atención</h3>
              </div>
              <div className="contacto-hours-list">
                <div className="contacto-hours-item">
                  <span>Lunes - Viernes</span>
                  <span className="contacto-hours-time">9:00 - 19:00</span>
                </div>
                <div className="contacto-hours-item">
                  <span>Sábados</span>
                  <span className="contacto-hours-time">9:00 - 14:00</span>
                </div>
                <div className="contacto-hours-item">
                  <span>Domingos</span>
                  <span className="contacto-hours-time contacto-hours-closed">Cerrado</span>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="contacto-map glass-card" id="contacto-map">
              <iframe
                title="Ubicación FULL Accesorios"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1231.2225705205085!2d-68.20992821474732!3d-16.52196965598481!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x915edf004e9c2105%3A0x8b30d25fa12310a7!2sFULL%20ACCESORIOS(PUNTO%20TIGO)!5e1!3m2!1ses!2sbo!4v1780603533693!5m2!1ses!2sbo"
                width="100%"
                height="280"
                style={{ border: 0, borderRadius: 'var(--radius-lg)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="contacto-form-section">
            <form className="contacto-form glass-card" id="contact-form" onSubmit={handleSubmit}>
              <h3 className="contacto-form-title">Envíanos un mensaje</h3>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-nombre">Nombre completo</label>
                <input
                  type="text"
                  className="form-input"
                  id="contact-nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-email">Correo electrónico</label>
                <input
                  type="email"
                  className="form-input"
                  id="contact-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-mensaje">Mensaje</label>
                <textarea
                  className="form-textarea"
                  id="contact-mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  placeholder="Escribe tu mensaje aquí..."
                  rows="5"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg contacto-submit-btn"
                id="contact-submit"
                disabled={sending}
              >
                {sending ? (
                  <>
                    <div className="spinner spinner-sm" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <HiOutlinePaperAirplane />
                    Enviar Mensaje
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
