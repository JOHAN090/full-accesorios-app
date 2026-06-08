import api from './api';

const rolesService = {
  getAll: () => {
    return api.get('/roles');
  },
};

export default rolesService;
