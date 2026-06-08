import api from './api';

const getAll = () => {
  return api.get('/logs-acceso');
};

const logsService = {
  getAll,
};

export default logsService;
