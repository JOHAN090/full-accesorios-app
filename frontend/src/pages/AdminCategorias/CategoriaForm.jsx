import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiX, FiArrowLeft } from 'react-icons/fi';
import categoriasService from '../../services/categoriasService';
import { toast } from 'react-toastify';
import './CategoriaForm.css';

function CategoriaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      fetchCategoria();
    }
  }, [id]);

  const fetchCategoria = async () => {
    setLoading(true);
    try {
      const response = await categoriasService.getById(id);
      const categoria = response.data;
      setForm({
        nombre: categoria.nombre || '',
        descripcion: categoria.descripcion || '',
      });
    } catch (error) {
      toast.error('Error al cargar la categoría');
      navigate('/admin/categorias');
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

  const validate = () => {
    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      if (isEditing) {
        await categoriasService.update(id, form);
        toast.success('Categoría actualizada correctamente');
      } else {
        await categoriasService.create(form);
        toast.success('Categoría creada correctamente');
      }
      navigate('/admin/categorias');
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al guardar la categoría';
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="categoria-form__loading">
        <div className="categoria-form__spinner"></div>
        <p>Cargando categoría...</p>
      </div>
    );
  }

  return (
    <div className="categoria-form">
      <div className="categoria-form__header">
        <button
          className="categoria-form__back-btn"
          onClick={() => navigate('/admin/categorias')}
          id="btn-back-categorias"
        >
          <FiArrowLeft /> Volver
        </button>
        <h1 id="categoria-form-title">
          {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="categoria-form__body">
        <div className="categoria-form__card">
          <h2 className="categoria-form__card-title">Información de la Categoría</h2>

          <div className="categoria-form__field">
            <label htmlFor="cat-nombre">Nombre de la categoría *</label>
            <input
              type="text"
              id="cat-nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Auriculares, Cables, Cargadores..."
              className={errors.nombre ? 'error' : ''}
            />
            {errors.nombre && <span className="categoria-form__error">{errors.nombre}</span>}
          </div>

          <div className="categoria-form__field">
            <label htmlFor="cat-descripcion">Descripción</label>
            <textarea
              id="cat-descripcion"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Descripción breve de la categoría..."
              rows={4}
            />
          </div>
        </div>

        <div className="categoria-form__actions">
          <button
            type="button"
            className="categoria-form__btn cancel"
            onClick={() => navigate('/admin/categorias')}
            id="btn-cancel-categoria"
          >
            <FiX /> Cancelar
          </button>
          <button
            type="submit"
            className="categoria-form__btn save"
            disabled={saving}
            id="btn-save-categoria"
          >
            <FiSave /> {saving ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear Categoría'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CategoriaForm;
