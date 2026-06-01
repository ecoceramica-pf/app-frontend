import api from './api';

export const authService = {
  initCsrf: async () => {
    // Busca o cookie CSRF da raiz, não do /api
    const url = api.defaults.baseURL.replace(/\/api\/?$/, '') + '/sanctum/csrf-cookie';
    await api.get(url);
  },

  login: async (email, password) => {
    await authService.initCsrf();
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  register: async (userData) => {
    await authService.initCsrf();
    const response = await api.post('/register', userData);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/me');
    return response.data;
  },

  updateMe: async (userData) => {
    const response = await api.put('/me', userData);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  }
};
