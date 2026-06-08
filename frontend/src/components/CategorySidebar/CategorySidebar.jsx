import React, { useState } from 'react';
import { HiOutlineCollection, HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi';
import { FaLayerGroup } from 'react-icons/fa';
import './CategorySidebar.css';

const CategorySidebar = ({ categorias, categoriaActiva, onCategoriaChange }) => {
  const [collapsed, setCollapsed] = useState(true);

  const handleToggle = () => setCollapsed(!collapsed);

  return (
    <aside className="category-sidebar" id="category-sidebar">
      <button
        className="category-sidebar-toggle"
        id="category-sidebar-toggle"
        onClick={handleToggle}
      >
        <FaLayerGroup />
        <span>Categorías</span>
        {collapsed ? <HiOutlineChevronDown /> : <HiOutlineChevronUp />}
      </button>

      <div className={`category-sidebar-content ${!collapsed ? 'category-sidebar-content--open' : ''}`}>
        <h3 className="category-sidebar-title">
          <HiOutlineCollection />
          Categorías
        </h3>

        <ul className="category-sidebar-list">
          <li>
            <button
              className={`category-sidebar-item ${!categoriaActiva ? 'category-sidebar-item--active' : ''}`}
              id="category-all"
              onClick={() => onCategoriaChange(null)}
            >
              <span className="category-sidebar-dot" />
              Todas las categorías
            </button>
          </li>
          {categorias.map((cat) => (
            <li key={cat.id}>
              <button
                className={`category-sidebar-item ${categoriaActiva === cat.id ? 'category-sidebar-item--active' : ''}`}
                id={`category-${cat.id}`}
                onClick={() => onCategoriaChange(cat.id)}
              >
                <span className="category-sidebar-dot" />
                {cat.nombre}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default CategorySidebar;
