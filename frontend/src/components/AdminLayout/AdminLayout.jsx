import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import './AdminLayout.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="admin-layout" id="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="admin-layout-main">
        <header className="admin-layout-header">
          <button
            className="admin-layout-toggle"
            id="admin-sidebar-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <span className="admin-layout-toggle-bar" />
            <span className="admin-layout-toggle-bar" />
            <span className="admin-layout-toggle-bar" />
          </button>
          <div className="admin-layout-header-title">
            <span className="admin-layout-header-badge">Admin Panel</span>
          </div>
        </header>

        <main className="admin-layout-content">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && (
        <div className="admin-layout-overlay" onClick={closeSidebar} />
      )}
    </div>
  );
};

export default AdminLayout;
