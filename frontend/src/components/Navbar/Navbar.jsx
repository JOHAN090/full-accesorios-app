import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { FaBolt } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { path: '/', label: 'Inicio' },
    { path: '/ofertas', label: 'Ofertas' },
    { path: '/tienda', label: 'Tienda' },
    { path: '/contacto', label: 'Contáctanos' },
  ];

  // Don't show navbar on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" id="navbar-logo" onClick={closeMenu}>
          <FaBolt className="navbar-logo-icon" />
          <span className="navbar-logo-text">
            FULL <span className="navbar-logo-accent">Accesorios</span>
          </span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'navbar-links--open' : ''}`}>
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `navbar-link ${isActive ? 'navbar-link--active' : ''}`
              }
              id={`nav-link-${link.label.toLowerCase().replace(/á/g, 'a').replace(/é/g, 'e')}`}
              onClick={closeMenu}
              end={link.path === '/'}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <button
          className="navbar-toggle"
          id="navbar-toggle"
          onClick={toggleMenu}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {menuOpen ? <HiOutlineX /> : <HiOutlineMenu />}
        </button>
      </div>

      {menuOpen && <div className="navbar-overlay" onClick={closeMenu} />}
    </nav>
  );
};

export default Navbar;
