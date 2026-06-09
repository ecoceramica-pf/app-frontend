import React from 'react';
import { Button } from 'primereact/button';

export const MuralOfertaCard = ({ oferta, onDetalhes }) => {
  const formatarData = (isoDate) => {
    if (!isoDate) return '';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: 'short', year: 'numeric'
    }).format(new Date(isoDate));
  };

  const isCortante = oferta.material?.cortante;
  const isAltoVolume = (oferta.quantidade_cacamba > 0) || (oferta.quantidade_kg > 500);
  
  let qtdeStr = [];
  if (oferta.quantidade_kg) qtdeStr.push(`${oferta.quantidade_kg} kg`);
  if (oferta.quantidade_cacamba) qtdeStr.push(`${oferta.quantidade_cacamba} caçamba(s)`);
  const quantidadeFinal = qtdeStr.join(' + ') || 'Não especificada';

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full border-l-4 border-l-primary">
      <div className="p-5 pb-3 flex justify-between items-start gap-2">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">{oferta.material?.nome || 'Material Desconhecido'}</span>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
            {quantidadeFinal}
          </h3>
        </div>
        <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
          {formatarData(oferta.data_publicacao)}
        </span>
      </div>
      <div className="p-5 pt-0 flex-1 flex flex-col gap-4">
        <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400 mt-2">
          <i className="pi pi-map-marker mt-0.5 text-sm"></i>
          <p className="text-sm line-clamp-2">
            {oferta.endereco 
              ? [oferta.endereco.bairro, oferta.endereco.cidade].filter(Boolean).join(', ') || 'Endereço incompleto'
              : 'Endereço não informado'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <i className="pi pi-building text-sm"></i>
          <span className="text-sm truncate font-medium">Por: {oferta.usuario?.name || 'Fábrica parceira'}</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-auto pt-2">
          {Boolean(isCortante) && (
            <span className="text-[10px] font-bold bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-2 py-1 rounded">
              <i className="pi pi-exclamation-triangle mr-1 text-[10px]"></i> Cortante
            </span>
          )}
          {Boolean(isAltoVolume) && (
            <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
              <i className="pi pi-chart-line mr-1 text-[10px]"></i> Alto Volume
            </span>
          )}
        </div>
      </div>
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 mt-auto">
        <Button 
          label="Ver Detalhes" 
          icon="pi pi-arrow-right" 
          iconPos="right"
          outlined
          className="w-full text-sm font-bold border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          onClick={() => onDetalhes(oferta)}
        />
      </div>
    </div>
  );
};
