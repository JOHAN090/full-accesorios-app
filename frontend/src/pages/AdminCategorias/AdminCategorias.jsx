import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiGrid, FiAlertCircle } from 'react-icons/fi';
import categoriasService from '../../services/categoriasService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './AdminCategorias.css';

function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, categoria: null });
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.rol === 'admin';

  const fetchCategorias = async () => {
    setLoading(true);
    try {
      const response = await categoriasService.getAll();
      const data = Array.isArray(response.data) ? response.data : response.data.data || [];
      setCategorias(data);
    } catch (error) {
      console.error('Error fetching categorias:', error);
      toast.error('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleDelete = async () => {
    if (!deleteModal.categoria) return;
    try {
      await categoriasService.remove(deleteModal.categoria.id);
      toast.success('Categoría eliminada correctamente');
      setDeleteModal({ show: false, categoria: null });
      fetchCategorias();
    } catch (error) {
      toast.error('Error al eliminar categoría');
    }
  };

  return (
    <div className="admin-categorias">
      <div className="admin-categorias__header">
        <div className="admin-categorias__title-section">
          <FiGrid className="admin-categorias__icon" />
          <div>
            <h1 id="admin-categorias-title">Gestión de Categorías</h1>
            <p className="admin-categorias__subtitle">{categorias.length} categorías registradas</p>
          </div>
        </div>
        <Link to="/admin/categorias/nueva" className="admin-categorias__add-btn" id="btn-add-categoria">
          <FiPlus /> Nueva Categoría
        </Link>
      </div>

      {loading ? (
        <div className="admin-categorias__loading">
          <div className="admin-categorias__spinner"></div>
          <p>Cargando categorías...</p>
        </div>
      ) : categorias.length === 0 ? (
        <div className="admin-categorias__empty">
          <FiAlertCircle size={48} />
          <h3>No hay categorías registradas</h3>
          <p>Crea una nueva categoría para empezar.</p>
        </div>
      ) : (
        <div className="admin-categorias__grid">
          {categorias.map(categoria => (
            <div key={categoria.id} className="admin-categorias__card">
              <div className="admin-categorias__card-header">
                <div className="admin-categorias__card-icon">
                  <FiGrid />
                </div>
                <div className="admin-categorias__card-actions">
                  <button
                    className="admin-categorias__action-btn edit"
                    onClick={() => navigate(`/admin/categorias/editar/${categoria.id}`)}
                    title="Editar"
                    id={`btn-edit-cat-${categoria.id}`}
                  >
                    <FiEdit2 />
                  </button>
                  {isAdmin && (
                    <button
                      className="admin-categorias__action-btn delete"
                      onClick={() => setDeleteModal({ show: true, categoria })}
                      title="Eliminar"
                      id={`btn-delete-cat-${categoria.id}`}
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>
              </div>
              <h3 className="admin-categorias__card-name">{categoria.nombre}</h3>
              <p className="admin-categorias__card-desc">
                {categoria.descripcion || 'Sin descripción'}
              </p>
              {categoria.productos && (
                <span className="admin-categorias__card-count">
                  {categoria.productos.length} productos
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.show && (
        <div className="admin-modal-overlay" onClick={() => setDeleteModal({ show: false, categoria: null })}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__icon">
              <FiTrash2 />
            </div>
            <h3>¿Eliminar categoría?</h3>
            <p>
              Estás a punto de eliminar <strong>{deleteModal.categoria?.nombre}</strong>.
              Los productos asociados no serán eliminados.
            </p>
            <div className="admin-modal__actions">
              <button
                className="admin-modal__btn cancel"
                onClick={() => setDeleteModal({ show: false, categoria: null })}
                id="btn-cancel-delete-cat"
              >
                Cancelar
              </button>
              <button
                className="admin-modal__btn confirm"
                onClick={handleDelete}
                id="btn-confirm-delete-cat"
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

export default AdminCategorias;
