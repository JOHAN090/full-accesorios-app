import api from './api';

const categoriasService = {
  getAll: () => {
    return api.get('/categorias');
  },

  getById: (id) => {
    return api.get(`/categorias/${id}`);
  },

  create: (data) => {
    return api.post('/categorias', data);
  },

  update: (id, data) => {
    return api.put(`/categorias/${id}`, data);
  },

  remove: (id) => {
    return api.delete(`/categorias/${id}`);
  },
};

export default categoriasService;
