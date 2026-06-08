import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/* Public Pages */
import Home from './pages/Home/Home';
import Tienda from './pages/Tienda/Tienda';
import Ofertas from './pages/Ofertas/Ofertas';
import Contacto from './pages/Contacto/Contacto';
import ProductoDetalle from './pages/ProductoDetalle/ProductoDetalle';

/* Admin Pages */
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import AdminProductos from './pages/AdminProductos/AdminProductos';
import ProductoForm from './pages/AdminProductos/ProductoForm';
import AdminCategorias from './pages/AdminCategorias/AdminCategorias';
import CategoriaForm from './pages/AdminCategorias/CategoriaForm';
import AdminUsuarios from './pages/AdminUsuarios/AdminUsuarios';
import UsuarioForm from './pages/AdminUsuarios/UsuarioForm';
import AdminOfertas from './pages/AdminOfertas/AdminOfertas';
import AdminLogs from './pages/AdminLogs/AdminLogs';

/* Components */
import ChatWidget from './components/ChatWidget/ChatWidget';

/* Layout & Route Protection */
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import AdminLayout from './components/AdminLayout/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

/* Styles */
import './styles/variables.css';
import './styles/global.css';

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="main-content">{children}</main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* ─── Public Routes ─── */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/tienda" element={<PublicLayout><Tienda /></PublicLayout>} />
            <Route path="/ofertas" element={<PublicLayout><Ofertas /></PublicLayout>} />
            <Route path="/contacto" element={<PublicLayout><Contacto /></PublicLayout>} />
            <Route path="/producto/:id" element={<PublicLayout><ProductoDetalle /></PublicLayout>} />

            {/* ─── Admin Login (no layout) ─── */}
            <Route path="/admin/login" element={<Login />} />

            {/* ─── Protected Admin Routes ─── */}
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="productos" element={<AdminProductos />} />
              <Route path="productos/nuevo" element={<ProductoForm />} />
              <Route path="productos/editar/:id" element={<ProductoForm />} />
              <Route path="categorias" element={<AdminCategorias />} />
              <Route path="categorias/nueva" element={<CategoriaForm />} />
              <Route path="categorias/editar/:id" element={<CategoriaForm />} />
              <Route path="ofertas" element={<AdminOfertas />} />
              <Route path="logs" element={<AdminLogs />} />
              {/* Default Admin redirect */}
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="usuarios" element={<AdminUsuarios />} />
              <Route path="usuarios/nuevo" element={<UsuarioForm />} />
              <Route path="usuarios/editar/:id" element={<UsuarioForm />} />
            </Route>
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          <ChatWidget />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
