import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiX, FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi';
import usuariosService from '../../services/usuariosService';
import rolesService from '../../services/rolesService';
import { toast } from 'react-toastify';
import './UsuarioForm.css';

function UsuarioForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    password: '',
    rol_id: '',
    estado: 'activo',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchRoles();
    if (isEditing) {
      fetchUsuario();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchRoles = async () => {
    try {
      const response = await rolesService.getAll();
      const data = Array.isArray(response.data) ? response.data : [];
      setRoles(data);
    } catch (error) {
      toast.error('Error al cargar roles');
    }
  };

  const fetchUsuario = async () => {
    setLoading(true);
    try {
      const response = await usuariosService.getById(id);
      const usuario = response.data;
      setForm({
        nombres: usuario.nombres || '',
        apellidos: usuario.apellidos || '',
        correo: usuario.correo || '',
        password: '',
        rol_id: usuario.rol_id || usuario.rol?.id || '',
        estado: usuario.estado || 'activo',
      });
    } catch (error) {
      toast.error('Error al cargar el usuario');
      navigate('/admin/usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Password strength calculation
  const calcPasswordStrength = (pass) => {
    if (!pass) return { level: 0, label: '', color: '' };
    if (pass.length < 8) return { level: 1, label: 'Débil', color: '#ef4444' };

    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNum = /[0-9]/.test(pass);
    const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(pass);

    if (!hasNum && !hasSpecial) return { level: 1, label: 'Débil', color: '#ef4444' };
    if (hasUpper && hasLower && hasNum && hasSpecial) return { level: 3, label: 'Fuerte', color: '#10b981' };
    if ((hasUpper || hasLower) && hasNum) return { level: 2, label: 'Intermedia', color: '#f59e0b' };
    return { level: 1, label: 'Débil', color: '#ef4444' };
  };

  const passwordStrength = calcPasswordStrength(form.password);

  const validate = () => {
    const newErrors = {};
    if (!form.nombres.trim()) newErrors.nombres = 'Los nombres son requeridos';
    if (!form.apellidos.trim()) newErrors.apellidos = 'Los apellidos son requeridos';
    if (!form.correo.trim()) newErrors.correo = 'El correo es requerido';
    else if (!/\S+@\S+\.\S+/.test(form.correo)) newErrors.correo = 'El correo no es válido';
    if (!form.rol_id) newErrors.rol_id = 'Selecciona un rol';
    if (!isEditing && !form.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (form.password && form.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const data = {
        nombres: form.nombres,
        apellidos: form.apellidos,
        correo: form.correo,
        rol_id: parseInt(form.rol_id),
        estado: form.estado,
      };
      if (form.password) {
        data.password = form.password;
      }

      if (isEditing) {
        await usuariosService.update(id, data);
        toast.success('Usuario actualizado correctamente');
      } else {
        await usuariosService.create(data);
        toast.success('Usuario creado correctamente');
      }
      navigate('/admin/usuarios');
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al guardar el usuario';
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="usuario-form__loading">
        <div className="usuario-form__spinner"></div>
        <p>Cargando usuario...</p>
      </div>
    );
  }

  return (
    <div className="usuario-form">
      <div className="usuario-form__header">
        <button
          className="usuario-form__back-btn"
          onClick={() => navigate('/admin/usuarios')}
          id="btn-back-usuarios"
        >
          <FiArrowLeft /> Volver
        </button>
        <h1 id="usuario-form-title">
          {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="usuario-form__body">
        <div className="usuario-form__grid">
          {/* Left Card - Personal Info */}
          <div className="usuario-form__card">
            <h2 className="usuario-form__card-title">Información Personal</h2>

            <div className="usuario-form__row">
              <div className="usuario-form__field">
                <label htmlFor="user-nombres">Nombres *</label>
                <input
                  type="text"
                  id="user-nombres"
                  name="nombres"
                  value={form.nombres}
                  onChange={handleChange}
                  placeholder="Ej: Juan Carlos"
                  className={errors.nombres ? 'error' : ''}
                />
                {errors.nombres && <span className="usuario-form__error">{errors.nombres}</span>}
              </div>

              <div className="usuario-form__field">
                <label htmlFor="user-apellidos">Apellidos *</label>
                <input
                  type="text"
                  id="user-apellidos"
                  name="apellidos"
                  value={form.apellidos}
                  onChange={handleChange}
                  placeholder="Ej: Rodríguez López"
                  className={errors.apellidos ? 'error' : ''}
                />
                {errors.apellidos && <span className="usuario-form__error">{errors.apellidos}</span>}
              </div>
            </div>

            <div className="usuario-form__field">
              <label htmlFor="user-correo">Correo electrónico *</label>
              <input
                type="email"
                id="user-correo"
                name="correo"
                value={form.correo}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                className={errors.correo ? 'error' : ''}
              />
              {errors.correo && <span className="usuario-form__error">{errors.correo}</span>}
            </div>
          </div>

          {/* Right Card - Security & Role */}
          <div className="usuario-form__card">
            <h2 className="usuario-form__card-title">Seguridad y Permisos</h2>

            <div className="usuario-form__field">
              <label htmlFor="user-password">
                Contraseña {isEditing ? '(dejar vacío para no cambiar)' : '*'}
              </label>
              <div className="usuario-form__password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="user-password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={isEditing ? '••••••••' : 'Mínimo 6 caracteres'}
                  className={errors.password ? 'error' : ''}
                />
                <button
                  type="button"
                  className="usuario-form__toggle-pass"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <span className="usuario-form__error">{errors.password}</span>}

              {/* Password Strength Indicator */}
              {form.password && (
                <div className="usuario-form__strength">
                  <div className="usuario-form__strength-bar">
                    <div
                      className="usuario-form__strength-fill"
                      style={{
                        width: `${(passwordStrength.level / 3) * 100}%`,
                        background: passwordStrength.color,
                      }}
                    />
                  </div>
                  <span
                    className="usuario-form__strength-label"
                    style={{ color: passwordStrength.color }}
                  >
                    {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>

            <div className="usuario-form__field">
              <label htmlFor="user-rol_id">Rol *</label>
              <select
                id="user-rol_id"
                name="rol_id"
                value={form.rol_id}
                onChange={handleChange}
                className={errors.rol_id ? 'error' : ''}
              >
                <option value="">Seleccionar rol...</option>
                {roles.map(rol => (
                  <option key={rol.id} value={rol.id}>
                    {rol.nombre === 'admin' ? 'Administrador' : rol.nombre === 'editor' ? 'Editor' : rol.nombre}
                    {rol.descripcion ? ` — ${rol.descripcion}` : ''}
                  </option>
                ))}
              </select>
              {errors.rol_id && <span className="usuario-form__error">{errors.rol_id}</span>}
              <small className="usuario-form__hint">
                <strong>Administrador:</strong> Acceso total (CRUD + eliminar + usuarios).<br />
                <strong>Editor:</strong> Puede agregar/editar productos y ver reportes, pero no eliminar ni gestionar usuarios.
              </small>
            </div>

            {isEditing && (
              <div className="usuario-form__field">
                <label htmlFor="user-estado">Estado</label>
                <select
                  id="user-estado"
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="usuario-form__actions">
          <button
            type="button"
            className="usuario-form__btn cancel"
            onClick={() => navigate('/admin/usuarios')}
            id="btn-cancel-usuario"
          >
            <FiX /> Cancelar
          </button>
          <button
            type="submit"
            className="usuario-form__btn save"
            disabled={saving}
            id="btn-save-usuario"
          >
            <FiSave /> {saving ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear Usuario'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UsuarioForm;
