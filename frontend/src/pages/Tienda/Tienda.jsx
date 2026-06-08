import React, { useState, useEffect, useCallback } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import CategorySidebar from '../../components/CategorySidebar/CategorySidebar';
import SearchBar from '../../components/SearchBar/SearchBar';
import productosService from '../../services/productosService';
import categoriasService from '../../services/categoriasService';
import { HiOutlineCube } from 'react-icons/hi';
import './Tienda.css';

const Tienda = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 12;

  const fetchProductos = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (categoriaActiva) params.categoria_id = categoriaActiva;
      if (busqueda) params.search = busqueda;

      const response = await productosService.getAll(params);
      const serverData = response.data;
      const items = serverData.data || serverData.productos || serverData;
      setProductos(Array.isArray(items) ? items : []);
      setTotalPages(serverData.totalPages || serverData.total_pages || Math.ceil((serverData.total || items.length) / limit));
      setTotalItems(serverData.total || (Array.isArray(items) ? items.length : 0));
    } catch (error) {
      console.error('Error fetching products:', error);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  }, [page, categoriaActiva, busqueda]);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await categoriasService.getAll();
        const cats = data.categorias || data.data || data;
        setCategorias(Array.isArray(cats) ? cats : []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategorias();
  }, []);

  const handleSearch = useCallback((query) => {
    setBusqueda(query);
    setPage(1);
  }, []);

  const handleCategoriaChange = useCallback((catId) => {
    setCategoriaActiva(catId);
    setPage(1);
  }, []);

  return (
    <div className="tienda-page" id="tienda-page">
      <div className="container">
        {/* Page Header */}
        <div className="tienda-header">
          <h1 className="tienda-title">Nuestra Tienda</h1>
          <p className="tienda-subtitle">
            Encuentra los mejores accesorios tecnológicos
          </p>
        </div>

        {/* Search */}
        <div className="tienda-search-wrapper">
          <SearchBar onSearch={handleSearch} />
          <span className="tienda-count">
            <HiOutlineCube /> {totalItems} productos
          </span>
        </div>

        {/* Content */}
        <div className="tienda-content">
          <CategorySidebar
            categorias={categorias}
            categoriaActiva={categoriaActiva}
            onCategoriaChange={handleCategoriaChange}
          />

          <div className="tienda-products">
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
                <div className="empty-state-icon">🔍</div>
                <p className="empty-state-text">No se encontraron productos</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Intenta ajustar los filtros o la búsqueda
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination" id="tienda-pagination">
                <button
                  className="pagination-btn"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  id="pagination-prev"
                >
                  Anterior
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    className={`pagination-btn ${page === i + 1 ? 'active' : ''}`}
                    onClick={() => setPage(i + 1)}
                    id={`pagination-${i + 1}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="pagination-btn"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  id="pagination-next"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tienda;
