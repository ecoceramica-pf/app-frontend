import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { coletasService } from '../services/coletasService';

export const MinhasColetas = () => {
  const navigate = useNavigate();
  const [coletas, setColetas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchColetas();
  }, []);

  const fetchColetas = async () => {
    try {
      const response = await coletasService.minhasColetas();
      const dados = response.data ? response.data : response;
      setColetas(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error('Erro ao buscar coletas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    return {
      'Pendente': 'bg-yellow-100 text-yellow-800',
      'Em Processo': 'bg-blue-100 text-blue-800',
      'Agendado': 'bg-blue-100 text-blue-800',
      'Concluido': 'bg-green-100 text-green-800',
      'Cancelado': 'bg-red-100 text-red-800'
    }[status] || 'bg-gray-100 text-gray-800';
  };

  const formatarData = (isoDate) => {
    if (!isoDate) return '';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: 'short', year: 'numeric'
    }).format(new Date(isoDate));
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Minhas Coletas</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Gerencie as suas reservas de materiais.</p>
        </div>
        <Button 
          label="Procurar Resíduos" 
          icon="pi pi-search" 
          onClick={() => navigate('/mural')} 
          className="!bg-primary hover:!bg-primary/90 !border-none text-white shadow-md rounded-lg py-2" 
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
        </div>
      ) : coletas.length === 0 ? (
        /* Empty State */
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center shadow-sm flex flex-col items-center">
          <i className="pi pi-truck text-5xl text-gray-400 mb-4"></i>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Nenhuma coleta registrada</h3>
          <p className="text-gray-500 mb-6">Você ainda não reservou nenhum resíduo no mural.</p>
          <Button label="Ver Ofertas Disponíveis" outlined onClick={() => navigate('/mural')} />
        </div>
      ) : (
        /* Grid de Coletas */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coletas.map(coleta => {
            const isCortante = coleta.oferta_residuo?.material?.cortante;
            const isAltoVolume = (coleta.oferta_residuo?.quantidade_cacamba > 0) || (coleta.oferta_residuo?.quantidade_kg > 500);
            
            let qtdeStr = [];
            if (coleta.oferta_residuo?.quantidade_kg) qtdeStr.push(`${coleta.oferta_residuo.quantidade_kg} kg`);
            if (coleta.oferta_residuo?.quantidade_cacamba) qtdeStr.push(`${coleta.oferta_residuo.quantidade_cacamba} caçamba(s)`);
            const quantidadeFinal = qtdeStr.join(' + ') || 'Não especificada';

            return (
              <div key={coleta.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full border-l-4 border-l-secondary">
                
                {/* Card Header */}
                <div className="p-5 pb-3 flex justify-between items-start gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-secondary uppercase tracking-wider">{coleta.oferta_residuo?.material?.nome || 'Material Desconhecido'}</span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                      {quantidadeFinal}
                    </h3>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${getStatusClass(coleta.status)}`}>
                    {coleta.status}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 pt-0 flex-1 flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-2">
                    <i className="pi pi-building text-sm"></i>
                    <span className="text-sm truncate font-medium">De: {coleta.oferta_residuo?.usuario?.razao_social || coleta.oferta_residuo?.usuario?.name || 'Fábrica Parceira'}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                    <i className="pi pi-map-marker mt-0.5 text-sm"></i>
                    <p className="text-sm line-clamp-2">
                      {coleta.oferta_residuo?.endereco 
                        ? [coleta.oferta_residuo.endereco.bairro, coleta.oferta_residuo.endereco.cidade].filter(Boolean).join(', ') || 'Endereço incompleto'
                        : 'Endereço não informado'}
                    </p>
                  </div>
                  
                  {/* Badges */}
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

                {/* Card Footer */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 mt-auto flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-500">
                    Reservado em {formatarData(coleta.data_reserva)}
                  </span>
                  <Button 
                    label="Gerenciar" 
                    icon="pi pi-cog" 
                    iconPos="right"
                    outlined
                    className="text-sm font-bold border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 py-1"
                    onClick={() => {/* Implementar navegação depois */}}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
