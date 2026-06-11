export const formatarDataHora = (isoDate) => {
  if (!isoDate) return '';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(new Date(isoDate));
};

export const formatarData = (isoDate) => {
  if (!isoDate) return '';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  }).format(new Date(isoDate));
};

export const formatarDataCurta = (isoDate) => {
  if (!isoDate) return '';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric'
  }).format(new Date(isoDate));
};

export const unmask = (val) => val ? val.replace(/\D/g, '') : '';
