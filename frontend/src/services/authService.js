import api from './api';

const authService = {
  getCaptcha: async () => {
    const response = await api.get('/auth/captcha');
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const data = response.data;
    // Backend returns { access_token, user }
    const token = data.access_token || data.token;
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  logout: async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await api.post('/auth/logout');
      }
    } catch (error) {
      // Silently fail logout API call
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },
};

export default authService;
