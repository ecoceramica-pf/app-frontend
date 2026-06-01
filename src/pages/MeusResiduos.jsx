import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { ofertasService } from '../services/ofertasService';

export const MeusResiduos = () => {
  const navigate = useNavigate();
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);

  const toast = useRef(null);

  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        const response = await ofertasService.minhasOfertas();
        const dados = response.data ? response.data : response;
        setOfertas(Array.isArray(dados) ? dados : []);
      } catch (error) {
        console.error('Erro ao buscar ofertas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOfertas();
  }, []);

  const formatarData = (isoDate) => {
    if (!isoDate) return '';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: 'short', year: 'numeric'
    }).format(new Date(isoDate));
  };

  const formatarDataHora = (isoDate) => {
    if (!isoDate) return '';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(new Date(isoDate));
  };



  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      <Toast ref={toast} />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Meus Resíduos</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Gerencie as ofertas de resíduos publicadas pela sua fábrica.</p>
        </div>
        <Button 
          label="Oferecer Material" 
          icon="pi pi-plus" 
          onClick={() => navigate('/cadastrar-residuo')} 
          className="!bg-primary hover:!bg-primary/90 !border-none text-white shadow-md rounded-lg py-2" 
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
        </div>
      ) : ofertas.length === 0 ? (
        /* Empty State */
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center shadow-sm flex flex-col items-center">
          <i className="pi pi-inbox text-5xl text-gray-400 mb-4"></i>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Você ainda não publicou ofertas</h3>
          <p className="text-gray-500">Os materiais que você registrar para coleta aparecerão aqui.</p>
        </div>
      ) : (
        /* Grid de Ofertas */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ofertas.map(oferta => {
            const isCortante = oferta.material?.cortante;
            const isAltoVolume = (oferta.quantidade_cacamba > 0) || (oferta.quantidade_kg > 500);
            
            let qtdeStr = [];
            if (oferta.quantidade_kg) qtdeStr.push(`${oferta.quantidade_kg} kg`);
            if (oferta.quantidade_cacamba) qtdeStr.push(`${oferta.quantidade_cacamba} caçamba(s)`);
            const quantidadeFinal = qtdeStr.join(' + ') || 'Não especificada';

            return (
              <div key={oferta.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full border-l-4 border-l-primary">
                
                {/* Card Header */}
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

                {/* Card Body */}
                <div className="p-5 pt-0 flex-1 flex flex-col gap-4">
                  <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400 mt-2">
                    <i className="pi pi-map-marker mt-0.5 text-sm"></i>
                    <p className="text-sm line-clamp-2">
                      {oferta.endereco 
                        ? [oferta.endereco.bairro, oferta.endereco.cidade].filter(Boolean).join(', ') || 'Endereço incompleto'
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

                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 mt-auto flex gap-2">
                  <Button 
                    label="Gerenciar" 
                    icon="pi pi-cog" 
                    iconPos="right"
                    outlined
                    className="w-full text-sm font-bold border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    onClick={() => navigate(`/meus-residuos/${oferta.id}/gerenciar`)}
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
