import api from './api';

export const enderecosService = {
  listar: async () => {
    const response = await api.get('/enderecos');
    return response.data;
  },
  criar: async (data) => {
    const response = await api.post('/enderecos', data);
    return response.data;
  }
};
