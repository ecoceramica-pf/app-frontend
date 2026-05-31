import api from './api';

export const dashboardService = {
  getImpacto: async () => {
    const response = await api.get('/dashboard/impacto');
    return response.data;
  },
};
