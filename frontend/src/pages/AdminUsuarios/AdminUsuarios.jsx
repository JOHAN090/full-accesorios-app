import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiUsers, FiAlertCircle, FiShield, FiSearch } from 'react-icons/fi';
import usuariosService from '../../services/usuariosService';
import { toast } from 'react-toastify';
import './AdminUsuarios.css';

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState({ show: false, usuario: null });

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const response = await usuariosService.getAll();
      const data = Array.isArray(response.data) ? response.data : response.data.data || [];
      setUsuarios(data);
    } catch (error) {
      console.error('Error fetching usuarios:', error);
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleDelete = async () => {
    if (!deleteModal.usuario) return;
    try {
      await usuariosService.remove(deleteModal.usuario.id);
      toast.success('Usuario eliminado correctamente');
      setDeleteModal({ show: false, usuario: null });
      fetchUsuarios();
    } catch (error) {
      toast.error('Error al eliminar usuario');
    }
  };

  const filteredUsuarios = usuarios.filter(u => {
    const term = searchTerm.toLowerCase();
    return (
      (u.nombres || '').toLowerCase().includes(term) ||
      (u.apellidos || '').toLowerCase().includes(term) ||
      (u.correo || '').toLowerCase().includes(term)
    );
  });

  const getRolBadge = (rol) => {
    const rolName = typeof rol === 'object' ? rol?.nombre : rol;
    if (rolName === 'admin') return { label: 'Administrador', className: 'badge-admin' };
    if (rolName === 'editor') return { label: 'Editor', className: 'badge-editor' };
    return { label: rolName || 'Sin rol', className: 'badge-default' };
  };

  const getEstadoBadge = (estado) => {
    if (estado === 'activo') return { label: 'Activo', className: 'badge-activo' };
    return { label: 'Inactivo', className: 'badge-inactivo' };
  };

  return (
    <div className="admin-usuarios">
      <div className="admin-usuarios__header">
        <div className="admin-usuarios__title-section">
          <FiUsers className="admin-usuarios__icon" />
          <div>
            <h1 id="admin-usuarios-title">Gestión de Usuarios</h1>
            <p className="admin-usuarios__subtitle">{usuarios.length} usuarios registrados</p>
          </div>
        </div>
        <Link to="/admin/usuarios/nuevo" className="admin-usuarios__add-btn" id="btn-add-usuario">
          <FiPlus /> Nuevo Usuario
        </Link>
      </div>

      {/* Search */}
      <div className="admin-usuarios__search-wrapper">
        <FiSearch className="admin-usuarios__search-icon" />
        <input
          type="text"
          className="admin-usuarios__search"
          id="search-usuarios"
          placeholder="Buscar por nombre, apellido o correo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="admin-usuarios__loading">
          <div className="admin-usuarios__spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      ) : filteredUsuarios.length === 0 ? (
        <div className="admin-usuarios__empty">
          <FiAlertCircle size={48} />
          <h3>{searchTerm ? 'No se encontraron resultados' : 'No hay usuarios registrados'}</h3>
          <p>{searchTerm ? 'Intenta con otro término de búsqueda.' : 'Crea un nuevo usuario para empezar.'}</p>
        </div>
      ) : (
        <div className="admin-usuarios__table-wrapper">
          <table className="admin-usuarios__table" id="usuarios-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Creado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsuarios.map(usuario => {
                const rolBadge = getRolBadge(usuario.rol);
                const estadoBadge = getEstadoBadge(usuario.estado);
                return (
                  <tr key={usuario.id}>
                    <td>
                      <div className="admin-usuarios__user-cell">
                        <div className="admin-usuarios__avatar">
                          {(usuario.nombres || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="admin-usuarios__name">{usuario.nombres} {usuario.apellidos}</span>
                        </div>
                      </div>
                    </td>
                    <td className="admin-usuarios__email">{usuario.correo}</td>
                    <td>
                      <span className={`admin-usuarios__badge ${rolBadge.className}`}>
                        <FiShield size={12} /> {rolBadge.label}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-usuarios__badge ${estadoBadge.className}`}>
                        {estadoBadge.label}
                      </span>
                    </td>
                    <td className="admin-usuarios__date">
                      {usuario.created_at ? new Date(usuario.created_at).toLocaleDateString('es-BO') : '-'}
                    </td>
                    <td>
                      <div className="admin-usuarios__actions">
                        <button
                          className="admin-usuarios__action-btn edit"
                          onClick={() => window.location.href = `/admin/usuarios/editar/${usuario.id}`}
                          title="Editar"
                          id={`btn-edit-user-${usuario.id}`}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="admin-usuarios__action-btn delete"
                          onClick={() => setDeleteModal({ show: true, usuario })}
                          title="Eliminar"
                          id={`btn-delete-user-${usuario.id}`}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.show && (
        <div className="admin-modal-overlay" onClick={() => setDeleteModal({ show: false, usuario: null })}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__icon delete">
              <FiTrash2 />
            </div>
            <h3>¿Eliminar usuario?</h3>
            <p>
              Estás a punto de eliminar a <strong>{deleteModal.usuario?.nombres} {deleteModal.usuario?.apellidos}</strong>.
              Esta acción se puede revertir (eliminación lógica).
            </p>
            <div className="admin-modal__actions">
              <button
                className="admin-modal__btn cancel"
                onClick={() => setDeleteModal({ show: false, usuario: null })}
                id="btn-cancel-delete-user"
              >
                Cancelar
              </button>
              <button
                className="admin-modal__btn confirm"
                onClick={handleDelete}
                id="btn-confirm-delete-user"
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

export default AdminUsuarios;
