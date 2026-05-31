import api from './api';

export const materiaisService = {
  listar: async () => {
    const response = await api.get('/materiais');
    return response.data;
  }
};
