import api from './api';

const productosService = {
  getAll: (params = {}) => {
    return api.get('/productos', { params });
  },

  getById: (id) => {
    return api.get(`/productos/${id}`);
  },

  create: (formData) => {
    return api.post('/productos', formData);
  },

  update: (id, formData) => {
    return api.put(`/productos/${id}`, formData);
  },

  remove: (id) => {
    return api.delete(`/productos/${id}`);
  },

  updateOferta: (id, data) => {
    return api.patch(`/productos/${id}/oferta`, data);
  },
};

export default productosService;
