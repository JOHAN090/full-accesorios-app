import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiPackage, FiAlertCircle } from 'react-icons/fi';
import productosService from '../../services/productosService';
import categoriasService from '../../services/categoriasService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './AdminProductos.css';

const API_BASE = 'http://localhost:3001';

function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [deleteModal, setDeleteModal] = useState({ show: false, producto: null });
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.rol === 'admin';

  const fetchProductos = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
      };
      if (search) params.search = search;
      if (categoriaFilter) params.categoria_id = categoriaFilter;

      const response = await productosService.getAll(params);
      const data = response.data;

      if (data.data) {
        setProductos(data.data);
        setTotalPages(data.totalPages || Math.ceil(data.total / 10));
        setTotalItems(data.total || data.data.length);
      } else if (Array.isArray(data)) {
        setProductos(data);
        setTotalItems(data.length);
      }
    } catch (error) {
      console.error('Error fetching productos:', error);
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, categoriaFilter]);

  const fetchCategorias = async () => {
    try {
      const response = await categoriasService.getAll();
      setCategorias(Array.isArray(response.data) ? response.data : response.data.data || []);
    } catch (error) {
      console.error('Error fetching categorias:', error);
    }
  };

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, [fetchProductos]);

  const handleDelete = async () => {
    if (!deleteModal.producto) return;
    try {
      await productosService.remove(deleteModal.producto.id);
      toast.success('Producto eliminado correctamente');
      setDeleteModal({ show: false, producto: null });
      fetchProductos();
    } catch (error) {
      toast.error('Error al eliminar producto');
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoriaFilter = (e) => {
    setCategoriaFilter(e.target.value);
    setCurrentPage(1);
  };

  const getCategoriaName = (categoriaId) => {
    const cat = categorias.find(c => c.id === categoriaId);
    return cat ? cat.nombre : 'Sin categoría';
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${API_BASE}${url}`;
  };

  return (
    <div className="admin-productos">
      <div className="admin-productos__header">
        <div className="admin-productos__title-section">
          <FiPackage className="admin-productos__icon" />
          <div>
            <h1 id="admin-productos-title">Gestión de Productos</h1>
            <p className="admin-productos__subtitle">{totalItems} productos en inventario</p>
          </div>
        </div>
        <Link to="/admin/productos/nuevo" className="admin-productos__add-btn" id="btn-add-producto">
          <FiPlus /> Nuevo Producto
        </Link>
      </div>

      <div className="admin-productos__filters">
        <div className="admin-productos__search-wrap">
          <FiSearch className="admin-productos__search-icon" />
          <input
            type="text"
            id="search-productos"
            placeholder="Buscar productos..."
            value={search}
            onChange={handleSearch}
            className="admin-productos__search-input"
          />
        </div>
        <select
          id="filter-categoria"
          value={categoriaFilter}
          onChange={handleCategoriaFilter}
          className="admin-productos__filter-select"
        >
          <option value="">Todas las categorías</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="admin-productos__loading">
          <div className="admin-productos__spinner"></div>
          <p>Cargando productos...</p>
        </div>
      ) : productos.length === 0 ? (
        <div className="admin-productos__empty">
          <FiAlertCircle size={48} />
          <h3>No se encontraron productos</h3>
          <p>Intenta cambiar los filtros o agrega un nuevo producto.</p>
        </div>
      ) : (
        <div className="admin-productos__table-wrap">
          <table className="admin-productos__table" id="table-productos">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio (Bs)</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(producto => (
                <tr key={producto.id} className="admin-productos__row">
                  <td>
                    <div className="admin-productos__img-cell">
                      {producto.imagen_url ? (
                        <img
                          src={getImageUrl(producto.imagen_url)}
                          alt={producto.nombre}
                          className="admin-productos__thumb"
                        />
                      ) : (
                        <div className="admin-productos__no-img">
                          <FiPackage />
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="admin-productos__name">{producto.nombre}</span>
                    {producto.descripcion_corta && (
                      <span className="admin-productos__desc">{producto.descripcion_corta.substring(0, 60)}...</span>
                    )}
                  </td>
                  <td>
                    <span className="admin-productos__cat-badge">
                      {producto.categoria?.nombre || getCategoriaName(producto.categoria_id)}
                    </span>
                  </td>
                  <td className="admin-productos__price">Bs {parseFloat(producto.precio).toFixed(2)}</td>
                  <td>
                    <span className={`admin-productos__stock ${producto.stock <= 5 ? 'low' : producto.stock <= 15 ? 'medium' : 'high'}`}>
                      {producto.stock}
                    </span>
                  </td>
                  <td>
                    <div className="admin-productos__actions">
                      <button
                        className="admin-productos__action-btn edit"
                        onClick={() => navigate(`/admin/productos/editar/${producto.id}`)}
                        title="Editar"
                        id={`btn-edit-${producto.id}`}
                      >
                        <FiEdit2 />
                      </button>
                      {isAdmin && (
                        <button
                          className="admin-productos__action-btn delete"
                          onClick={() => setDeleteModal({ show: true, producto })}
                          title="Eliminar"
                          id={`btn-delete-${producto.id}`}
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="admin-productos__pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="admin-productos__page-btn"
          >
            Anterior
          </button>
          <span className="admin-productos__page-info">
            Página {currentPage} de {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="admin-productos__page-btn"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="admin-modal-overlay" onClick={() => setDeleteModal({ show: false, producto: null })}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__icon">
              <FiTrash2 />
            </div>
            <h3>¿Eliminar producto?</h3>
            <p>
              Estás a punto de eliminar <strong>{deleteModal.producto?.nombre}</strong>.
              Esta acción se puede revertir.
            </p>
            <div className="admin-modal__actions">
              <button
                className="admin-modal__btn cancel"
                onClick={() => setDeleteModal({ show: false, producto: null })}
                id="btn-cancel-delete"
              >
                Cancelar
              </button>
              <button
                className="admin-modal__btn confirm"
                onClick={handleDelete}
                id="btn-confirm-delete"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProductos;
