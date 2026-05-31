import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  register: async (userData) => {
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
};
