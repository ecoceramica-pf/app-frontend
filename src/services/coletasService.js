import api from './api';

export const coletasService = {
  reservarColeta: async (ofertaId) => {
    const response = await api.post(`/ofertas/${ofertaId}/reservar`);
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
  confirmarFabrica: async (id) => {
    const response = await api.post(`/coletas/${id}/confirmar-fabrica`);
    return response.data;
  },
  confirmarColetor: async (id) => {
    const response = await api.post(`/coletas/${id}/confirmar-coletor`);
    return response.data;
  },
};
