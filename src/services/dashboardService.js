import api from './api';

export const dashboardService = {
  getImpacto: async () => {
    const response = await api.get('/dashboard/impacto');
    return response.data;
  },
  meuImpacto: async () => {
    const response = await api.get('/dashboard/meu-impacto');
    return response.data;
  },
};
