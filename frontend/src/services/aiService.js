import api from './api';

const sendMessage = (message) => {
  return api.post('/ai/chat', { message });
};

const aiService = {
  sendMessage,
};

export default aiService;
