import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { FiSearch, FiAlertCircle } from 'react-icons/fi';
import { HiOutlineFire } from 'react-icons/hi';
import productosService from '../../services/productosService';
import './AdminOfertas.css';

const AdminOfertas = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Local state for editing prices
  const [editPrices, setEditPrices] = useState({});

  const fetchProductos = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all products to manage offers (or search)
      const params = { limit: 1000 };
      if (search) params.search = search;

      const response = await productosService.getAll(params);
      const data = response.data;
      const items = data.data || data.productos || data;
      
      const productList = Array.isArray(items) ? items : [];
      setProductos(productList);

      // Initialize editPrices
      const initialPrices = {};
      productList.forEach(p => {
        initialPrices[p.id] = p.precio_oferta || '';
      });
      setEditPrices(initialPrices);

    } catch (error) {
      console.error('Error fetching productos:', error);
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handlePriceChange = (id, val) => {
    setEditPrices(prev => ({ ...prev, [id]: val }));
  };

  const handleToggleOferta = async (producto) => {
    const isCurrentlyEnOferta = producto.en_oferta === 1;
    const newStatus = isCurrentlyEnOferta ? 0 : 1;
    
    // If activating offer, ensure there is a valid price
    const currentEditPrice = editPrices[producto.id];
    let priceToSave = currentEditPrice ? parseFloat(currentEditPrice) : null;

    if (newStatus === 1 && (!priceToSave || isNaN(priceToSave))) {
      toast.error('Debes ingresar un precio de oferta válido antes de activarla');
      return;
    }

    try {
      await productosService.updateOferta(producto.id, {
        en_oferta: newStatus,
        precio_oferta: newStatus === 1 ? priceToSave : null
      });

      toast.success(`Oferta ${newStatus === 1 ? 'activada' : 'desactivada'} correctamente`);
      
      // Update local state
      setProductos(prev => prev.map(p => 
        p.id === producto.id 
          ? { ...p, en_oferta: newStatus, precio_oferta: newStatus === 1 ? priceToSave : null } 
          : p
      ));
    } catch (error) {
      console.error('Error updating offer:', error);
      toast.error('Error al actualizar la oferta');
    }
  };

  const handleSavePrice = async (producto) => {
    if (producto.en_oferta !== 1) {
      toast.info('Activa la oferta para establecer este precio');
      return;
    }

    const currentEditPrice = editPrices[producto.id];
    let priceToSave = parseFloat(currentEditPrice);

    if (!priceToSave || isNaN(priceToSave)) {
      toast.error('Debes ingresar un precio válido');
      return;
    }

    try {
      await productosService.updateOferta(producto.id, {
        en_oferta: 1,
        precio_oferta: priceToSave
      });

      toast.success('Precio de oferta actualizado');
      
      setProductos(prev => prev.map(p => 
        p.id === producto.id ? { ...p, precio_oferta: priceToSave } : p
      ));
    } catch (error) {
      console.error('Error updating offer price:', error);
      toast.error('Error al actualizar el precio de oferta');
    }
  };

  return (
    <div className="admin-ofertas">
      <div className="admin-ofertas__header">
        <div>
          <h1 className="admin-ofertas__title">
            <HiOutlineFire style={{ color: 'var(--warning)' }} /> Gestión de Ofertas
          </h1>
          <p className="admin-ofertas__subtitle">
            Activa o desactiva ofertas y asigna precios promocionales a tus productos.
          </p>
        </div>
      </div>

      <div className="admin-ofertas__filters glass-card">
        <div className="admin-ofertas__search">
          <FiSearch className="admin-ofertas__search-icon" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={handleSearch}
            className="admin-ofertas__search-input"
          />
        </div>
      </div>

      {loading ? (
        <div className="admin-ofertas__loading">
          <div className="admin-ofertas__spinner"></div>
          <p>Cargando productos...</p>
        </div>
      ) : productos.length === 0 ? (
        <div className="admin-ofertas__empty">
          <FiAlertCircle size={48} />
          <h3>No se encontraron productos</h3>
        </div>
      ) : (
        <div className="admin-ofertas__table-wrap">
          <table className="admin-ofertas__table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio Regular</th>
                <th>Precio Oferta</th>
                <th>Estado Oferta</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(producto => {
                const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:3001/api').replace('/api', '');
                const rawImage = producto.imagen_url || producto.imagen;
                const imageUrl = rawImage 
                  ? (rawImage.startsWith('http') ? rawImage : `${API_BASE}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`)
                  : 'https://via.placeholder.com/50';

                return (
                  <tr key={producto.id}>
                    <td>
                      <div className="admin-ofertas__prod-cell">
                        <img src={imageUrl} alt={producto.nombre} className="admin-ofertas__prod-img" />
                        <span className="admin-ofertas__prod-name">{producto.nombre}</span>
                      </div>
                    </td>
                    <td>{producto.categoria?.nombre || producto.categoria_nombre || 'Sin categoría'}</td>
                    <td>Bs. {Number(producto.precio).toFixed(2)}</td>
                    <td>
                      <input 
                        type="number"
                        min="0"
                        step="0.01"
                        className="admin-ofertas__price-input"
                        value={editPrices[producto.id] !== undefined ? editPrices[producto.id] : ''}
                        onChange={(e) => handlePriceChange(producto.id, e.target.value)}
                        placeholder="0.00"
                      />
                    </td>
                    <td>
                      <label className="admin-ofertas__switch">
                        <input 
                          type="checkbox" 
                          checked={producto.en_oferta === 1}
                          onChange={() => handleToggleOferta(producto)}
                        />
                        <span className="admin-ofertas__slider"></span>
                      </label>
                    </td>
                    <td>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleSavePrice(producto)}
                        disabled={producto.en_oferta !== 1}
                        style={{ opacity: producto.en_oferta === 1 ? 1 : 0.5 }}
                      >
                        Guardar Precio
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOfertas;
