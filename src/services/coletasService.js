import api from './api';

export const coletasService = {
  reservarColeta: async (ofertaId, dataAgendamento) => {
    const response = await api.post(`/ofertas/${ofertaId}/reservar`, {
      data_agendamento: dataAgendamento
    });
    return response.data;
  },
  minhasColetas: async () => {
    const response = await api.get('/minhas-coletas');
    return response.data;
  },
  detalharColeta: async (id) => {
    const response = await api.get(`/coletas/${id}`);
    return response.data;
  },
  cancelarColeta: async (id) => {
    const response = await api.post(`/coletas/${id}/cancelar`);
    return response.data;
  },
  aprovarColeta: async (id) => {
    const response = await api.post(`/coletas/${id}/aprovar`);
    return response.data;
  },
  recusarColeta: async (id) => {
    const response = await api.post(`/coletas/${id}/recusar`);
    return response.data;
  },
  confirmarFabrica: async (id) => {
    const response = await api.post(`/coletas/${id}/confirmar-fabrica`);
    return response.data;
  },
  confirmarColetor: async (id) => {
    const response = await api.post(`/coletas/${id}/confirmar-coletor`);
    return response.data;
  },
};
