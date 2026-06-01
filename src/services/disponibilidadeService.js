import api from './api';

export const disponibilidadeService = {
  // Geral
  getDisponibilidade: async () => {
    const response = await api.get('/disponibilidade');
    return response.data;
  },
  upsertDisponibilidade: async (dados) => {
    const response = await api.put('/disponibilidade', dados);
    return response.data;
  },

  // Faixas Horárias
  listarFaixas: async () => {
    const response = await api.get('/disponibilidade/faixas-horarios');
    return response.data;
  },
  adicionarFaixa: async (dados) => {
    const response = await api.post('/disponibilidade/faixas-horarios', dados);
    return response.data;
  },
  removerFaixa: async (id) => {
    const response = await api.delete(`/disponibilidade/faixas-horarios/${id}`);
    return response.data;
  },

  // Bloqueios
  listarBloqueios: async () => {
    const response = await api.get('/disponibilidade/bloqueios');
    return response.data;
  },
  adicionarBloqueio: async (dados) => {
    const response = await api.post('/disponibilidade/bloqueios', dados);
    return response.data;
  },
  removerBloqueio: async (id) => {
    const response = await api.delete(`/disponibilidade/bloqueios/${id}`);
    return response.data;
  },

  // Para Coletores - Consultar Vagas
  getSlotsDisponiveis: async (ofertaId, dataStr) => {
    const response = await api.get(`/ofertas/${ofertaId}/slots-disponiveis?data=${dataStr}`);
    return response.data;
  }
};
