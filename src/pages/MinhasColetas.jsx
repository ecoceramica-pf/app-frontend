import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Paginator } from 'primereact/paginator';
import { coletasService } from '../services/coletasService';
import { ColetaCard } from '../components/coletas/ColetaCard';
import { GerenciarColetaModal } from '../components/coletas/GerenciarColetaModal';

export const MinhasColetas = () => {
  const navigate = useNavigate();
  const [coletas, setColetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [first, setFirst] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  
  const toast = useRef(null);
  const [coletaSelecionada, setColetaSelecionada] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);

  const fetchColetas = async (page = 1) => {
    setLoading(true);
    try {
      const response = await coletasService.minhasColetas({ page });
      const dados = response.data ? response.data : response;
      setColetas(Array.isArray(dados) ? dados : []);
      if (response.meta) {
        setTotalRecords(response.meta.total);
      }
    } catch (error) {
      console.error('Erro ao buscar coletas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColetas(1);
  }, []);

  const onPageChange = (event) => {
    setFirst(event.first);
    fetchColetas(event.page + 1);
  };

  const getStatusClass = (status) => {
    return {
      'pendente': 'bg-yellow-100 text-yellow-800',
      'agendado': 'bg-blue-100 text-blue-800',
      'concluido': 'bg-green-100 text-green-800',
      'cancelado': 'bg-red-100 text-red-800',
      'recusado': 'bg-red-100 text-red-800'
    }[status] || 'bg-gray-100 text-gray-800';
  };

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

  const abrirModal = (coleta) => {
    setColetaSelecionada(coleta);
  };

  const fecharModal = () => {
    setColetaSelecionada(null);
  };

  const handleCancelar = async () => {
    if (!coletaSelecionada) return;
    setLoadingAction(true);
    try {
      await coletasService.cancelarColeta(coletaSelecionada.id);
      toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Coleta cancelada.' });
      fecharModal();
      fetchColetas();
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: error.response?.data?.message || 'Falha ao cancelar.' });
    } finally {
      setLoadingAction(false);
    }
  };

  const handleConfirmar = async () => {
    if (!coletaSelecionada) return;
    setLoadingAction(true);
    try {
      await coletasService.confirmarColetor(coletaSelecionada.id);
      toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Retirada confirmada.' });
      fecharModal();
      fetchColetas();
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: error.response?.data?.message || 'Falha ao confirmar.' });
    } finally {
      setLoadingAction(false);
    }
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
        <div className="flex flex-col gap-6">
          {/* Grid de Coletas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coletas.map(coleta => (
              <ColetaCard 
                key={coleta.id} 
                coleta={coleta} 
                onGerenciar={abrirModal} 
                getStatusClass={getStatusClass} 
              />
            ))}
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden mt-4">
            <Paginator 
              first={first} 
              rows={9} 
              totalRecords={totalRecords} 
              onPageChange={onPageChange} 
              className="bg-transparent border-none py-3"
            />
          </div>
        </div>
      )}
      {/* Modal de Gerenciamento */}
      <GerenciarColetaModal 
        coletaSelecionada={coletaSelecionada}
        fecharModal={fecharModal}
        loadingAction={loadingAction}
        handleCancelar={handleCancelar}
        handleConfirmar={handleConfirmar}
        getStatusClass={getStatusClass}
      />
    </div>
  );
};
