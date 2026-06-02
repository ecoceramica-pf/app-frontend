import api from './api';

export const ofertasService = {
  listarOfertas: async (params) => {
    const response = await api.get('/ofertas', { params });
    return response.data;
  },
  minhasOfertas: async (params) => {
    const response = await api.get('/minhas-ofertas', { params });
    return response.data;
  },
  criarOferta: async (data) => {
    const response = await api.post('/ofertas', data);
    return response.data;
  },
  detalharOferta: async (id) => {
    const response = await api.get(`/ofertas/${id}`);
    return response.data;
  },
  atualizarOferta: async (id, data) => {
    const response = await api.put(`/ofertas/${id}`, data);
    return response.data;
  },
  excluirOferta: async (id) => {
    const response = await api.delete(`/ofertas/${id}`);
    return response.data;
  },
  alterarStatus: async (id, status) => {
    const response = await api.patch(`/ofertas/${id}/status`, { status });
    return response.data;
  },
  uploadImagens: async (uuid, formData) => {
    const response = await api.post(`/ofertas/${uuid}/imagens`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
