import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiX, FiArrowLeft } from 'react-icons/fi';
import productosService from '../../services/productosService';
import categoriasService from '../../services/categoriasService';
import DropzoneImage from '../../components/DropzoneImage/DropzoneImage';
import { toast } from 'react-toastify';
import './ProductoForm.css';

function ProductoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [form, setForm] = useState({
    nombre: '',
    categoria_id: '',
    descripcion_corta: '',
    detalles_tecnicos: '',
    precio: '',
    stock: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategorias();
    if (isEditing) {
      fetchProducto();
    }
  }, [id]);

  const fetchCategorias = async () => {
    try {
      const response = await categoriasService.getAll();
      const data = Array.isArray(response.data) ? response.data : response.data.data || [];
      setCategorias(data);
    } catch (error) {
      toast.error('Error al cargar categorías');
    }
  };

  const fetchProducto = async () => {
    setLoading(true);
    try {
      const response = await productosService.getById(id);
      const producto = response.data;
      setForm({
        nombre: producto.nombre || '',
        categoria_id: producto.categoria_id || producto.categoria?.id || '',
        descripcion_corta: producto.descripcion_corta || '',
        detalles_tecnicos: producto.detalles_tecnicos || '',
        precio: producto.precio || '',
        stock: producto.stock || '',
      });
      if (producto.imagen_url) {
        const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:3001/api').replace('/api', '');
        const currentImageUrl = producto.imagen_url.startsWith('http') 
          ? producto.imagen_url 
          : `${API_BASE}${producto.imagen_url.startsWith('/') ? '' : '/'}${producto.imagen_url}`;
        setImagePreview(currentImageUrl);
      }
    } catch (error) {
      toast.error('Error al cargar el producto');
      navigate('/admin/productos');
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

  const handleImageDrop = (file) => {
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!form.categoria_id) newErrors.categoria_id = 'Selecciona una categoría';
    if (!form.precio || parseFloat(form.precio) < 0) newErrors.precio = 'El precio debe ser mayor o igual a 0';
    if (form.stock === '' || parseInt(form.stock) < 0) newErrors.stock = 'El stock debe ser mayor o igual a 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('nombre', form.nombre);
      formData.append('categoria_id', form.categoria_id);
      formData.append('descripcion_corta', form.descripcion_corta);
      formData.append('detalles_tecnicos', form.detalles_tecnicos);
      formData.append('precio', form.precio);
      formData.append('stock', form.stock);

      if (imageFile) {
        formData.append('imagen', imageFile);
      }

      if (isEditing) {
        await productosService.update(id, formData);
        toast.success('Producto actualizado correctamente');
      } else {
        await productosService.create(formData);
        toast.success('Producto creado correctamente');
      }

      navigate('/admin/productos');
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al guardar el producto';
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="producto-form__loading">
        <div className="producto-form__spinner"></div>
        <p>Cargando producto...</p>
      </div>
    );
  }

  return (
    <div className="producto-form">
      <div className="producto-form__header">
        <button
          className="producto-form__back-btn"
          onClick={() => navigate('/admin/productos')}
          id="btn-back-productos"
        >
          <FiArrowLeft /> Volver
        </button>
        <h1 id="producto-form-title">
          {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="producto-form__body">
        <div className="producto-form__grid">
          {/* Left Column - Main Info */}
          <div className="producto-form__main">
            <div className="producto-form__card">
              <h2 className="producto-form__card-title">Información del Producto</h2>

              <div className="producto-form__field">
                <label htmlFor="nombre">Nombre del producto *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Auriculares Bluetooth 5.0"
                  className={errors.nombre ? 'error' : ''}
                />
                {errors.nombre && <span className="producto-form__error">{errors.nombre}</span>}
              </div>

              <div className="producto-form__field">
                <label htmlFor="categoria_id">Categoría *</label>
                <select
                  id="categoria_id"
                  name="categoria_id"
                  value={form.categoria_id}
                  onChange={handleChange}
                  className={errors.categoria_id ? 'error' : ''}
                >
                  <option value="">Seleccionar categoría...</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
                {errors.categoria_id && <span className="producto-form__error">{errors.categoria_id}</span>}
              </div>

              <div className="producto-form__field">
                <label htmlFor="descripcion_corta">Descripción corta</label>
                <textarea
                  id="descripcion_corta"
                  name="descripcion_corta"
                  value={form.descripcion_corta}
                  onChange={handleChange}
                  placeholder="Breve descripción del producto..."
                  rows={3}
                />
              </div>

              <div className="producto-form__field">
                <label htmlFor="detalles_tecnicos">Detalles técnicos (especificaciones)</label>
                <textarea
                  id="detalles_tecnicos"
                  name="detalles_tecnicos"
                  value={form.detalles_tecnicos}
                  onChange={handleChange}
                  placeholder='Ej: {"Conectividad": "Bluetooth 5.0", "Batería": "500mAh", "Peso": "250g"}'
                  rows={5}
                  className="producto-form__monospace"
                />
                <small className="producto-form__hint">
                  Puedes escribir especificaciones en formato JSON o texto libre
                </small>
              </div>
            </div>
          </div>

          {/* Right Column - Price, Stock, Image */}
          <div className="producto-form__sidebar">
            <div className="producto-form__card">
              <h2 className="producto-form__card-title">Precio y Stock</h2>

              <div className="producto-form__field">
                <label htmlFor="precio">Precio (Bs) *</label>
                <input
                  type="number"
                  id="precio"
                  name="precio"
                  value={form.precio}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={errors.precio ? 'error' : ''}
                />
                {errors.precio && <span className="producto-form__error">{errors.precio}</span>}
              </div>

              <div className="producto-form__field">
                <label htmlFor="stock">Stock *</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="1"
                  className={errors.stock ? 'error' : ''}
                />
                {errors.stock && <span className="producto-form__error">{errors.stock}</span>}
              </div>
            </div>

            <div className="producto-form__card">
              <h2 className="producto-form__card-title">Imagen del Producto</h2>
              <DropzoneImage
                onFileSelect={handleImageDrop}
                preview={imagePreview}
                onClear={() => { setImageFile(null); setImagePreview(null); }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="producto-form__actions">
          <button
            type="button"
            className="producto-form__btn cancel"
            onClick={() => navigate('/admin/productos')}
            id="btn-cancel-producto"
          >
            <FiX /> Cancelar
          </button>
          <button
            type="submit"
            className="producto-form__btn save"
            disabled={saving}
            id="btn-save-producto"
          >
            <FiSave /> {saving ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear Producto'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductoForm;
