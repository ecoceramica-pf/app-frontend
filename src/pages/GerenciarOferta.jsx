import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { ofertasService } from '../services/ofertasService';
import { coletasService } from '../services/coletasService';
import { formatarDataHora } from '../utils/formatters';
import { GerenciarOfertaHeader } from '../components/ofertas/GerenciarOfertaHeader';
import { PropostaColetaBlock } from '../components/ofertas/PropostaColetaBlock';
import { ProgressoColetaBlock } from '../components/ofertas/ProgressoColetaBlock';

export const GerenciarOferta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useRef(null);
  
  const [oferta, setOferta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    fetchOferta();
  }, [id]);

  const fetchOferta = async () => {
    try {
      const response = await ofertasService.detalharOferta(id);
      setOferta(response.data ? response.data : response);
    } catch (error) {
      console.error('Erro ao buscar oferta:', error);
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar os dados da oferta.' });
    } finally {
      setLoading(false);
    }
  };

  const handleAlterarStatus = async (novoStatus) => {
    setLoadingAction(true);
    try {
      await ofertasService.alterarStatus(id, novoStatus);
      toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: `Status alterado para ${novoStatus}.` });
      fetchOferta();
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: error.response?.data?.message || 'Falha ao alterar status.' });
    } finally {
      setLoadingAction(false);
    }
  };

  const handleAprovar = async () => {
    if (!oferta?.coleta) return;
    setLoadingAction(true);
    try {
      await coletasService.aprovarColeta(oferta.coleta.id);
      toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Proposta aprovada!' });
      fetchOferta();
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: error.response?.data?.message || 'Falha ao aprovar.' });
    } finally {
      setLoadingAction(false);
    }
  };

  const handleRecusar = async () => {
    if (!oferta?.coleta) return;
    setLoadingAction(true);
    try {
      await coletasService.recusarColeta(oferta.coleta.id);
      toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Proposta recusada.' });
      fetchOferta();
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: error.response?.data?.message || 'Falha ao recusar.' });
    } finally {
      setLoadingAction(false);
    }
  };

  const handleConfirmarColeta = async () => {
    if (!oferta?.coleta) return;
    setLoadingAction(true);
    try {
      await coletasService.confirmarFabrica(oferta.coleta.id);
      toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Retirada confirmada.' });
      fetchOferta();
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: error.response?.data?.message || 'Falha ao confirmar.' });
    } finally {
      setLoadingAction(false);
    }
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
      </div>
    );
  }

  if (!oferta) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm text-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Oferta não encontrada</h2>
        <Button label="Voltar para Meus Resíduos" className="mt-4" onClick={() => navigate('/meus-residuos')} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <Toast ref={toast} />
      
      <GerenciarOfertaHeader 
        oferta={oferta}
        navigate={navigate}
        handleAlterarStatus={handleAlterarStatus}
        loadingAction={loadingAction}
      />

      {/* Conteúdo Principal */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
        
        {!oferta.coleta || oferta.coleta.status === 'recusado' || oferta.coleta.status === 'cancelado' ? (
          <div className="flex flex-col items-center justify-center py-12 text-center w-full">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
              <i className="pi pi-inbox text-3xl text-blue-500"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Aguardando Propostas</h3>
            <p className="text-gray-500 dark:text-gray-400 w-full md:w-2/3 lg:w-1/2 mx-auto px-4 mt-2">
              Sua oferta está visível no mural. Quando um coletor parceiro tiver interesse e sugerir um horário, a proposta aparecerá aqui para sua aprovação.
            </p>
            
            
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            
            {/* Bloco de Aprovação (se estiver pendente) */}
            {oferta.coleta.status === 'pendente' && (
              <PropostaColetaBlock 
                oferta={oferta}
                handleAprovar={handleAprovar}
                handleRecusar={handleRecusar}
                loadingAction={loadingAction}
              />
            )}

            {/* Bloco de Coleta em Andamento (Agendado/Concluído) */}
            {['agendado', 'concluido'].includes(oferta.coleta.status) && (
              <ProgressoColetaBlock 
                oferta={oferta}
                handleConfirmarColeta={handleConfirmarColeta}
                loadingAction={loadingAction}
              />
            )}
            
          </div>
        )}
      </div>
    </div>
  );
};
