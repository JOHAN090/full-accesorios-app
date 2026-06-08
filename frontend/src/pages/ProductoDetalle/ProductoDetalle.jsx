import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineTag, HiOutlineCube } from 'react-icons/hi';
import ProductCard from '../../components/ProductCard/ProductCard';
import productosService from '../../services/productosService';
import './ProductoDetalle.css';

const ProductoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducto = async () => {
      setLoading(true);
      try {
        const response = await productosService.getById(id);
        const serverData = response.data;
        const prod = serverData.producto || serverData;
        setProducto(prod);

        // Fetch related products by same category
        if (prod.categoria_id) {
          const relResponse = await productosService.getAll({ categoria_id: prod.categoria_id, limit: 4 });
          const relServerData = relResponse.data;
          const relItems = relServerData.data || relServerData.productos || relServerData;
          const filtered = (Array.isArray(relItems) ? relItems : []).filter(
            (p) => p.id !== parseInt(id)
          );
          setRelated(filtered.slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducto();
  }, [id]);

  const parseDetalles = (detalles) => {
    if (!detalles) return null;
    try {
      const parsed = typeof detalles === 'string' ? JSON.parse(detalles) : detalles;
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p className="loading-text">Cargando producto...</p>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>Producto no encontrado</h2>
        <button className="btn btn-secondary" onClick={() => navigate('/tienda')} style={{ marginTop: '1rem' }}>
          Volver a la tienda
        </button>
      </div>
    );
  }

  const API_BASE = 'http://localhost:3001';
  const rawImageUrl = producto.imagen_url || producto.imagen;
  
  const imageUrl = rawImageUrl
    ? (rawImageUrl.startsWith('http') ? rawImageUrl : `${API_BASE}${rawImageUrl.startsWith('/') ? '' : '/'}${rawImageUrl}`)
    : 'https://via.placeholder.com/600x400?text=Sin+imagen';

  const detalles = parseDetalles(producto.detalles_tecnicos || producto.detalles);
  const stockStatus = producto.stock > 10
    ? { label: 'En Stock', className: 'badge-success' }
    : producto.stock > 0
    ? { label: `Quedan ${producto.stock}`, className: 'badge-warning' }
    : { label: 'Agotado', className: 'badge-danger' };

  return (
    <div className="detalle-page" id="detalle-page">
      <div className="container">
        {/* Back Button */}
        <button
          className="detalle-back btn btn-secondary"
          id="detalle-back"
          onClick={() => navigate(-1)}
        >
          <HiOutlineArrowLeft /> Volver
        </button>

        {/* Product Detail */}
        <div className="detalle-content">
          <div className="detalle-image-section">
            <div className="detalle-image-wrapper glass-card">
              <img src={imageUrl} alt={producto.nombre} className="detalle-image" />
              {producto.en_oferta === 1 && (
                <span className="detalle-offer-badge">🔥 EN OFERTA</span>
              )}
            </div>
          </div>

          <div className="detalle-info-section">
            {(producto.categoria?.nombre || producto.categoria_nombre) && (
              <span className="badge badge-primary detalle-category">
                <HiOutlineTag /> {producto.categoria?.nombre || producto.categoria_nombre}
              </span>
            )}

            <h1 className="detalle-title">{producto.nombre}</h1>

            <div className="detalle-price-row">
              {producto.precio_oferta ? (
                <>
                  <span className="detalle-price-original">Bs. {Number(producto.precio).toFixed(2)}</span>
                  <span className="detalle-price">Bs. {Number(producto.precio_oferta).toFixed(2)}</span>
                </>
              ) : (
                <span className="detalle-price">Bs. {Number(producto.precio).toFixed(2)}</span>
              )}
            </div>

            <span className={`badge ${stockStatus.className} detalle-stock`}>
              <HiOutlineCube /> {stockStatus.label}
            </span>

            {producto.descripcion_corta && (
              <div className="detalle-description">
                <h3>Descripción</h3>
                <p>{producto.descripcion_corta}</p>
              </div>
            )}

            {detalles && (
              <div className="detalle-specs">
                <h3>Especificaciones Técnicas</h3>
                <div className="detalle-specs-table">
                  {Object.entries(detalles).map(([key, value]) => (
                    <div key={key} className="detalle-spec-row">
                      <span className="detalle-spec-key">{key}</span>
                      <span className="detalle-spec-value">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="detalle-related section">
            <h2 className="section-title">Productos Relacionados</h2>
            <div className="grid grid-4">
              {related.map((p) => (
                <ProductCard key={p.id} producto={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductoDetalle;
