import React from 'react';
import { Button } from 'primereact/button';

export const OfertaCard = ({ oferta }) => {
  // Map status to styles and icons
  const getStatusProps = (status) => {
    switch(status) {
      case 'Disponivel': return { bg: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-800 dark:text-green-300', icon: 'pi-box', iconBg: 'bg-green-50 dark:bg-green-900/30' };
      case 'EmProcesso': return { bg: 'bg-yellow-100 dark:bg-yellow-900/40', text: 'text-yellow-800 dark:text-yellow-300', icon: 'pi-sync', iconBg: 'bg-yellow-50 dark:bg-yellow-900/30' };
      case 'Concluido': return { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-800 dark:text-gray-300', icon: 'pi-check-circle', iconBg: 'bg-gray-50 dark:bg-gray-800' };
      default: return { bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-800 dark:text-blue-300', icon: 'pi-info-circle', iconBg: 'bg-blue-50 dark:bg-blue-900/30' };
    }
  };

  const { bg, text, icon, iconBg } = getStatusProps(oferta.status);
  
  // Format date if available
  const dateStr = oferta.criado_em 
    ? new Date(oferta.criado_em).toLocaleDateString('pt-BR') 
    : oferta.data_criacao 
      ? new Date(oferta.data_criacao).toLocaleDateString('pt-BR') 
      : '';

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors gap-4">
      <div className="flex items-center space-x-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg} ${text}`}>
          <i className={`pi ${icon} text-lg`}></i>
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            {oferta.material?.nome || 'Material não especificado'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {oferta.quantidade_kg} kg {dateStr ? `· ${dateStr}` : ''}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${bg} ${text}`}>
          {oferta.status}
        </span>
        <Button icon="pi pi-search" rounded text aria-label="Detalhes" className="text-gray-500 hover:text-primary dark:text-gray-400" />
      </div>
    </div>
  );
};
