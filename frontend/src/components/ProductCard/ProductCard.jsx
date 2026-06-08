import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineTag, HiOutlineCube } from 'react-icons/hi';
import './ProductCard.css';

const ProductCard = ({ producto }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/producto/${producto.id}`);
  };

  const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:3001/api').replace('/api', '');
  const rawImageUrl = producto.imagen_url || producto.imagen;
  
  const imageUrl = rawImageUrl
    ? (rawImageUrl.startsWith('http') ? rawImageUrl : `${API_BASE}${rawImageUrl.startsWith('/') ? '' : '/'}${rawImageUrl}`)
    : 'https://via.placeholder.com/400x300?text=Sin+imagen';

  const stockStatus = producto.stock > 10
    ? { label: 'En Stock', className: 'stock-ok' }
    : producto.stock > 0
    ? { label: `Quedan ${producto.stock}`, className: 'stock-low' }
    : { label: 'Agotado', className: 'stock-out' };

  return (
    <article
      className="product-card"
      id={`product-card-${producto.id}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') handleClick(); }}
    >
      <div className="product-card-image-wrapper">
        <img
          src={imageUrl}
          alt={producto.nombre}
          className="product-card-image"
          loading="lazy"
        />
        <div className="product-card-overlay" />
        {producto.en_oferta === 1 && (
          <span className="product-card-badge-offer">OFERTA</span>
        )}
      </div>

      <div className="product-card-body">
        {(producto.categoria?.nombre || producto.categoria_nombre) && (
          <span className="product-card-category">
            <HiOutlineTag />
            {producto.categoria?.nombre || producto.categoria_nombre}
          </span>
        )}

        <h3 className="product-card-title">{producto.nombre}</h3>

        {producto.descripcion_corta && (
          <p className="product-card-desc">{producto.descripcion_corta}</p>
        )}

        <div className="product-card-footer">
          <div className="product-card-price-group">
            {producto.precio_oferta ? (
              <>
                <span className="product-card-price-original">Bs. {Number(producto.precio).toFixed(2)}</span>
                <span className="product-card-price">Bs. {Number(producto.precio_oferta).toFixed(2)}</span>
              </>
            ) : (
              <span className="product-card-price">Bs. {Number(producto.precio).toFixed(2)}</span>
            )}
          </div>

          <span className={`product-card-stock ${stockStatus.className}`}>
            <HiOutlineCube />
            {stockStatus.label}
          </span>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
