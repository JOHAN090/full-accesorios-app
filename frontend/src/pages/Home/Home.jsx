import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBolt, FaShieldAlt, FaTruck, FaHeadset } from 'react-icons/fa';
import { HiOutlineArrowRight } from 'react-icons/hi';
import ProductCard from '../../components/ProductCard/ProductCard';
import productosService from '../../services/productosService';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = [
    '/carousel/imagen1.png',
    '/carousel/imagen2.png',
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await productosService.getAll({ limit: 6 });
        const serverData = response.data;
        const products = serverData.data || serverData.productos || serverData;
        setFeaturedProducts(Array.isArray(products) ? products.slice(0, 6) : []);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const features = [
    {
      icon: <FaShieldAlt />,
      title: 'Calidad Garantizada',
      description: 'Todos nuestros productos cuentan con garantía y son de las mejores marcas del mercado.',
    },
    {
      icon: <FaTruck />,
      title: 'Envío Rápido',
      description: 'Entregas rápidas en toda la ciudad de La Paz. Recibe tu pedido en tiempo récord.',
    },
    {
      icon: <FaHeadset />,
      title: 'Soporte 24/7',
      description: 'Nuestro equipo de soporte está disponible para ayudarte en todo momento.',
    },
  ];

  return (
    <div className="home-page" id="home-page">
      {/* Hero Section */}
      <section className="hero-section" id="hero-section">
        <div className="hero-bg-effects">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
        </div>

        <div className="hero-content container">
          <div className="hero-text">
            <span className="hero-badge">
              <FaBolt /> Soluciones Tecnológicas
            </span>
            <h1 className="hero-title">
              FULL{' '}
              <span className="hero-title-accent">Accesorios</span>
            </h1>
            <p className="hero-subtitle">
              Descubre la mejor selección de accesorios electrónicos con calidad premium 
              y precios increíbles. Tu tecnología, nuestra pasión.
            </p>
            <div className="hero-actions">
              <Link to="/tienda" className="btn btn-primary btn-lg" id="hero-cta-tienda">
                Explorar Tienda
                <HiOutlineArrowRight />
              </Link>
              <Link to="/ofertas" className="btn btn-secondary btn-lg" id="hero-cta-ofertas">
                Ver Ofertas
              </Link>
            </div>
          </div>
          
          <div className="hero-carousel-container">
            <div className="hero-carousel">
              {carouselImages.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`hero-carousel-slide ${idx === currentSlide ? 'active' : ''}`}
                >
                  <img src={img} alt={`Imagen tienda ${idx + 1}`} />
                </div>
              ))}
              
              <button className="carousel-btn prev" onClick={prevSlide}>&lt;</button>
              <button className="carousel-btn next" onClick={nextSlide}>&gt;</button>
              
              <div className="carousel-indicators">
                {carouselImages.map((_, idx) => (
                  <button 
                    key={idx} 
                    className={`carousel-dot ${idx === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(idx)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section" id="featured-section">
        <div className="container">
          <h2 className="section-title">Productos Destacados</h2>

          {loading ? (
            <div className="grid grid-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton" style={{ height: '200px' }} />
                  <div style={{ padding: '1rem' }}>
                    <div className="skeleton" style={{ height: '12px', width: '40%', marginBottom: '0.5rem' }} />
                    <div className="skeleton" style={{ height: '16px', width: '80%', marginBottom: '0.5rem' }} />
                    <div className="skeleton" style={{ height: '12px', width: '60%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-3">
              {featuredProducts.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-state-text">No hay productos disponibles aún</p>
            </div>
          )}

          <div className="featured-more">
            <Link to="/tienda" className="btn btn-secondary" id="featured-ver-todos">
              Ver todos los productos
              <HiOutlineArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section features-section" id="features-section">
        <div className="container">
          <h2 className="section-title">¿Por qué elegirnos?</h2>
          <div className="grid grid-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card glass-card"
                id={`feature-card-${index}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
