import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineChartBar, HiOutlineCube, HiOutlineCollection, HiOutlineLogout, HiOutlineUsers, HiOutlineFire, HiOutlineClock } from 'react-icons/hi';
import { FaBolt } from 'react-icons/fa';
import './AdminSidebar.css';

const AdminSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const userRol = user?.rol || '';
  const isAdmin = userRol === 'admin';

  const navItems = [
    { path: '/admin/dashboard', icon: <HiOutlineChartBar />, label: 'Dashboard' },
    { path: '/admin/productos', icon: <HiOutlineCube />, label: 'Productos' },
    { path: '/admin/categorias', icon: <HiOutlineCollection />, label: 'Categorías' },
  ];

  // Only show Usuarios, Ofertas, and Logs links for admin role
  if (isAdmin) {
    navItems.push({ path: '/admin/ofertas', icon: <HiOutlineFire />, label: 'Ofertas' });
    navItems.push({ path: '/admin/usuarios', icon: <HiOutlineUsers />, label: 'Usuarios' });
    navItems.push({ path: '/admin/logs', icon: <HiOutlineClock />, label: 'Logs de Acceso' });
  }

  const getRolLabel = (rol) => {
    if (rol === 'admin') return 'Administrador';
    if (rol === 'editor') return 'Editor';
    return rol || 'Usuario';
  };

  return (
    <aside className={`admin-sidebar ${isOpen ? 'admin-sidebar--open' : ''}`} id="admin-sidebar">
      <div className="admin-sidebar-header">
        <div className="admin-sidebar-logo">
          <FaBolt className="admin-sidebar-logo-icon" />
          <span className="admin-sidebar-logo-text">
            FULL <span className="admin-sidebar-logo-accent">Admin</span>
          </span>
        </div>
      </div>

      {user && (
        <div className="admin-sidebar-user">
          <div className="admin-sidebar-avatar">
            {(user.nombres || user.nombre || user.correo || 'A').charAt(0).toUpperCase()}
          </div>
          <div className="admin-sidebar-user-info">
            <span className="admin-sidebar-user-name">
              {user.nombres || user.nombre || user.correo || 'Admin'}
            </span>
            <span className="admin-sidebar-user-role">{getRolLabel(userRol)}</span>
          </div>
        </div>
      )}

      <nav className="admin-sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `admin-sidebar-link ${isActive ? 'admin-sidebar-link--active' : ''}`
            }
            id={`admin-nav-${item.label.toLowerCase()}`}
            onClick={onClose}
          >
            <span className="admin-sidebar-link-icon">{item.icon}</span>
            <span className="admin-sidebar-link-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <button
          className="admin-sidebar-link admin-sidebar-logout"
          id="admin-nav-logout"
          onClick={handleLogout}
        >
          <span className="admin-sidebar-link-icon"><HiOutlineLogout /></span>
          <span className="admin-sidebar-link-label">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
