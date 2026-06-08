import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import productosService from '../../services/productosService';
import { HiOutlineFire } from 'react-icons/hi';
import './Ofertas.css';

const Ofertas = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        const response = await productosService.getAll({ en_oferta: 1 });
        const serverData = response.data;
        const items = serverData.data || serverData.productos || serverData;
        setProductos(Array.isArray(items) ? items : []);
      } catch (error) {
        console.error('Error fetching offers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOfertas();
  }, []);

  return (
    <div className="ofertas-page" id="ofertas-page">
      {/* Banner */}
      <section className="ofertas-banner" id="ofertas-banner">
        <div className="ofertas-banner-bg" />
        <div className="ofertas-banner-content container">
          <span className="ofertas-banner-emoji">🔥</span>
          <h1 className="ofertas-banner-title">
            <HiOutlineFire className="ofertas-fire-icon" />
            Ofertas Especiales
          </h1>
          <p className="ofertas-banner-subtitle">
            Aprovecha descuentos increíbles en accesorios tecnológicos seleccionados
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="section">
        <div className="container">
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
          ) : productos.length > 0 ? (
            <div className="grid grid-3">
              {productos.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🏷️</div>
              <p className="empty-state-text">No hay ofertas disponibles en este momento</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                ¡Vuelve pronto para encontrar las mejores ofertas!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Ofertas;
