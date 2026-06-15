import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

// Força a injeção do cabeçalho X-XSRF-TOKEN lendo manualmente dos cookies
api.interceptors.request.use((config) => {
  const match = document.cookie.match(new RegExp('(^|;\\s*)(XSRF-TOKEN)=([^;]*)'));
  if (match && match[3]) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(match[3]);
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 indica que o usuário não está logado (cookie de sessão inválido/ausente)
    if (error.response && error.response.status === 401) {
      // Dispara um evento global para que o AuthContext intercepte e faça o logout local
      window.dispatchEvent(new Event('auth-unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;
