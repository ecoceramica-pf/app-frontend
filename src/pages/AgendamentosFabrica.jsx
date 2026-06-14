import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { Paginator } from 'primereact/paginator';
import { Badge } from 'primereact/badge';
import { coletasService } from '../services/coletasService';
import { formatarDataCurta, formatarDataHora } from '../utils/formatters';

export const AgendamentosFabrica = () => {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('agendado');
  const [first, setFirst] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const toast = useRef(null);

  const tabs = [
    { label: 'Pendentes', value: 'pendente', icon: 'pi pi-clock', color: 'text-yellow-600 border-yellow-500', bg: 'bg-yellow-50' },
    { label: 'Agendados', value: 'agendado', icon: 'pi pi-calendar', color: 'text-blue-600 border-blue-500', bg: 'bg-blue-50' },
    { label: 'Concluídos', value: 'concluido', icon: 'pi pi-check-circle', color: 'text-green-600 border-green-500', bg: 'bg-green-50' },
  ];

  const fetchAgendamentos = async (page = 1, status = filtroStatus) => {
    setLoading(true);
    try {
      // Usamos a nova rota separada para o perfil de Fábrica
      const response = await coletasService.coletasFabrica({ page, status });
      const dados = response.data ? response.data : response;
      const coletasData = Array.isArray(dados) ? dados : [];
      
      setAgendamentos(coletasData);
      if (response.meta) {
        setTotalRecords(response.meta.total);
      }
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar os agendamentos.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFirst(0);
    fetchAgendamentos(1, filtroStatus);
  }, [filtroStatus]);

  const onPageChange = (event) => {
    setFirst(event.first);
    fetchAgendamentos(event.page + 1);
  };

  const getStatusSeverity = (status) => {
    switch(status) {
      case 'pendente': return 'warning';
      case 'agendado': return 'info';
      case 'concluido': return 'success';
      case 'cancelado': return 'danger';
      default: return 'neutral';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'pendente': return 'Aguardando Aprovação';
      case 'agendado': return 'Coleta Agendada';
      case 'concluido': return 'Coleta Concluída';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 animate-fade-in">
      <Toast ref={toast} />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <i className="pi pi-calendar-plus text-primary text-2xl"></i>
            Agendamentos de Coleta
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Gerencie as coletas agendadas para os seus resíduos.</p>
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-px overflow-x-auto custom-scrollbar">
        {tabs.map((tab) => {
          const isActive = filtroStatus === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setFiltroStatus(tab.value)}
              className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all border-b-2 whitespace-nowrap
                ${isActive 
                  ? `${tab.color} bg-white dark:bg-gray-900` 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
                }
              `}
            >
              <i className={`${tab.icon} ${isActive ? '' : 'text-gray-400'}`}></i>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Lista de Agendamentos */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
        </div>
      ) : agendamentos.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 text-center flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <i className="pi pi-folder-open text-3xl text-gray-400"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Nenhuma coleta encontrada</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Não há registros com o status "{tabs.find(t => t.value === filtroStatus)?.label}" no momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agendamentos.map((coleta) => {
            const oferta = coleta.oferta_residuo;
            if (!oferta) return null;
            
            return (
              <div key={coleta.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group">
                {/* Header Card (No Image) */}
                <div className="p-5 pb-4 flex flex-col gap-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight uppercase tracking-wider">{oferta.material?.nome || 'Material Indefinido'}</h3>
                      
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        {oferta.quantidade_kg > 0 && (
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2.5 py-1 rounded-md flex items-center">
                            <i className="pi pi-box mr-2 text-primary"></i> 
                            {oferta.quantidade_kg} kg
                          </p>
                        )}
                        
                        {oferta.quantidade_cacamba > 0 && (
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2.5 py-1 rounded-md flex items-center">
                            <i className="pi pi-truck mr-2 text-primary"></i> 
                            {oferta.quantidade_cacamba} {oferta.quantidade_cacamba === 1 ? 'Caçamba' : 'Caçambas'}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge value={getStatusLabel(coleta.status)} severity={getStatusSeverity(coleta.status)} className="shadow-sm font-semibold tracking-wide" />
                  </div>
                </div>

                {/* Body Card */}
                <div className="p-5 flex-1 flex flex-col gap-4">
                  {coleta ? (
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 flex flex-col gap-3 border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                          <i className="pi pi-truck text-xl"></i>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Empresa Coletora</p>
                          <p className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">{coleta.coletor?.nome || 'Não identificada'}</p>
                        </div>
                      </div>
                      
                      <div className="h-px w-full bg-gray-200 dark:bg-gray-700"></div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Agendado para</span>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            <i className="pi pi-calendar-clock mr-1 text-primary"></i> 
                            {coleta.data_agendamento ? formatarDataCurta(coleta.data_agendamento) : 'A definir'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-orange-50 dark:bg-orange-900/10 rounded-xl p-4 text-center border border-orange-100 dark:border-orange-900/30">
                      <p className="text-sm text-orange-600 dark:text-orange-400">Detalhes da coleta não disponíveis.</p>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="mt-auto pt-2">
                    <Button 
                      label="Gerenciar Agendamento" 
                      icon="pi pi-arrow-right" 
                      iconPos="right"
                      className="w-full p-button-outlined p-button-secondary hover:bg-gray-50 dark:hover:bg-gray-800" 
                      onClick={() => navigate(`/meus-residuos/${oferta.id}/gerenciar`)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Paginator */}
      {totalRecords > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <Paginator 
            first={first} 
            rows={9} 
            totalRecords={totalRecords} 
            onPageChange={onPageChange}
            className="border-none"
          />
        </div>
      )}
    </div>
  );
};
