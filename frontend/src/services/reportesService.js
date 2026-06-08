import api from './api';
import { saveAs } from 'file-saver';

const reportesService = {
  downloadInventarioPDF: async () => {
    const response = await api.get('/reportes/inventario', {
      responseType: 'blob',
    });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    saveAs(blob, `inventario_${new Date().toISOString().split('T')[0]}.pdf`);
    return true;
  },
};

export default reportesService;
