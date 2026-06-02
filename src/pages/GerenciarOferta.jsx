import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { ofertasService } from '../services/ofertasService';
import { coletasService } from '../services/coletasService';

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

  const formatarDataHora = (isoDate) => {
    if (!isoDate) return '';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(new Date(isoDate));
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
      
      {/* Header Elegante e Moderno */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-start gap-4">
          <Button icon="pi pi-arrow-left" rounded text aria-label="Voltar" className="text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 mt-1 flex-shrink-0" onClick={() => navigate('/meus-residuos')} />
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
              Gerenciar Resíduo
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-primary/10 text-primary text-sm font-semibold">
                <i className="pi pi-tag text-xs"></i>
                {oferta.material?.nome}
              </span>
              <span className="text-gray-400 dark:text-gray-600 hidden sm:inline">•</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium flex items-center gap-1.5">
                <i className="pi pi-box text-xs opacity-70"></i>
                {[
                  oferta.quantidade_kg ? `${oferta.quantidade_kg} kg` : null,
                  oferta.quantidade_cacamba ? `${oferta.quantidade_cacamba} caçamba(s)` : null
                ].filter(Boolean).join(' + ')}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col w-full md:w-auto items-stretch md:items-end gap-4">
          <div className="flex items-center justify-between md:justify-end gap-3 bg-gray-50 dark:bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-100 dark:border-gray-800 w-full">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status Atual</span>
            <div className="flex items-center gap-2">
              {oferta.status === 'disponivel' && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>}
              <span className={`text-sm font-bold uppercase tracking-wider
                ${oferta.status === 'disponivel' ? 'text-green-600 dark:text-green-400' : 
                  oferta.status === 'concluido' ? 'text-blue-600 dark:text-blue-400' :
                  oferta.status === 'cancelado' ? 'text-red-600 dark:text-red-400' :
                  'text-gray-600 dark:text-gray-300'
                }`}>
                {oferta.status}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto justify-end">
            {oferta.status !== 'concluido' && oferta.status !== 'cancelado' && (
              <>
                <Button icon="pi pi-times" size="small" severity="danger" text label="Cancelar" onClick={() => handleAlterarStatus('cancelado')} loading={loadingAction} className="px-4" />
                <Button icon="pi pi-check" size="small" severity="success" label="Concluir" onClick={() => handleAlterarStatus('concluido')} loading={loadingAction} className="px-6 font-bold shadow-sm" />
              </>
            )}
            {(oferta.status === 'concluido' || oferta.status === 'cancelado') && (
              <Button icon="pi pi-refresh" size="small" severity="info" outlined label="Tornar Disponível" onClick={() => handleAlterarStatus('disponivel')} loading={loadingAction} />
            )}
          </div>
        </div>
      </div>

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
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 dark:bg-amber-900/50 p-3 rounded-full">
                    <i className="pi pi-clock text-amber-600 dark:text-amber-400 text-xl"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-1">Nova Proposta de Coleta</h3>
                    <p className="text-amber-800 dark:text-amber-200/80 mb-4">
                      O coletor <strong>{oferta.coleta.coletor?.name || 'Parceiro'}</strong> deseja realizar a retirada do material.
                    </p>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-5 border border-amber-100 dark:border-gray-700">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Horário Sugerido:</p>
                      <p className="font-bold text-gray-900 dark:text-white text-lg">
                        {formatarDataHora(oferta.coleta.data_agendamento)}
                      </p>
                    </div>

                    {oferta.coleta.observacoes && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/50 mb-5">
                        <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                          <i className="pi pi-info-circle"></i>
                          Observações do Coletor
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                          "{oferta.coleta.observacoes}"
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                      <Button 
                        label="Aprovar Proposta" 
                        icon="pi pi-check" 
                        className="bg-green-600 hover:bg-green-700 border-none text-white font-bold px-6 py-2"
                        loading={loadingAction}
                        onClick={handleAprovar}
                      />
                      <Button 
                        label="Recusar Horário" 
                        icon="pi pi-times" 
                        severity="danger" 
                        outlined 
                        className="font-bold px-6 py-2"
                        loading={loadingAction}
                        onClick={handleRecusar}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bloco de Coleta em Andamento (Agendado/Concluído) */}
            {['agendado', 'concluido'].includes(oferta.coleta.status) && (
              <div className="flex flex-col gap-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Detalhes do Agendamento</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Coletor Responsável</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                      {oferta.coleta.coletor?.name || 'Coletor Parceiro'}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Data e Hora da Retirada</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                      {formatarDataHora(oferta.coleta.data_agendamento)}
                    </p>
                  </div>
                </div>

                {oferta.coleta.observacoes && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/50">
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                      <i className="pi pi-info-circle"></i>
                      Observações do Coletor
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                      "{oferta.coleta.observacoes}"
                    </p>
                  </div>
                )}

                {/* Timeline / Status */}
                <div className="mt-4 p-6 border border-gray-200 dark:border-gray-700 rounded-xl">
                  <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-4">Progresso da Coleta</h4>
                  
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                        <i className="pi pi-check font-bold"></i>
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 dark:text-gray-200">Agendamento Aprovado</p>
                        <p className="text-sm text-gray-500">A fábrica aceitou a proposta do coletor.</p>
                      </div>
                    </div>

                    <div className="w-0.5 h-6 bg-gray-200 dark:bg-gray-700 ml-4"></div>

                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${oferta.coleta.confirmacao_coletor ? 'bg-green-100 text-green-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                        <i className={oferta.coleta.confirmacao_coletor ? 'pi pi-check font-bold' : 'pi pi-truck'}></i>
                      </div>
                      <div>
                        <p className={`font-bold ${oferta.coleta.confirmacao_coletor ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400'}`}>Confirmação do Coletor</p>
                        <p className="text-sm text-gray-500">
                          {oferta.coleta.confirmacao_coletor ? 'O coletor confirmou que recolheu o material.' : 'Aguardando o coletor chegar e confirmar a retirada.'}
                        </p>
                      </div>
                    </div>

                    <div className="w-0.5 h-6 bg-gray-200 dark:bg-gray-700 ml-4"></div>

                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${oferta.coleta.confirmacao_fabrica ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.3)]'}`}>
                        <i className={oferta.coleta.confirmacao_fabrica ? 'pi pi-check font-bold' : 'pi pi-home'}></i>
                      </div>
                      <div>
                        <p className={`font-bold ${oferta.coleta.confirmacao_fabrica ? 'text-gray-800 dark:text-gray-200' : 'text-blue-600 dark:text-blue-400'}`}>Sua Confirmação (Fábrica)</p>
                        <p className="text-sm text-gray-500">
                          {oferta.coleta.confirmacao_fabrica ? 'Você confirmou a entrega do material.' : 'Você precisa confirmar que entregou o material para o coletor.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Ação da Fábrica se estiver agendado e não confirmado por ela */}
                  {oferta.coleta.status === 'agendado' && !oferta.coleta.confirmacao_fabrica && (
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <p className="text-gray-600 dark:text-gray-400 text-sm max-w-sm">
                        No momento da retirada, entregue o material ao coletor e clique no botão ao lado.
                      </p>
                      <Button 
                        label="Confirmar Entrega Física" 
                        icon="pi pi-check-circle" 
                        size="large"
                        className="bg-primary hover:bg-primary/90 border-none w-full sm:w-auto"
                        loading={loadingAction}
                        onClick={handleConfirmarColeta}
                      />
                    </div>
                  )}

                  {oferta.coleta.status === 'concluido' && (
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg flex items-center gap-3">
                        <i className="pi pi-check-circle text-green-500 text-2xl"></i>
                        <div>
                          <p className="font-bold text-green-800 dark:text-green-400">Coleta Concluída com Sucesso!</p>
                          <p className="text-sm text-green-700 dark:text-green-500 mt-1">O ciclo deste material foi finalizado. Agradecemos por contribuir com a reciclagem.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
          </div>
        )}
      </div>
    </div>
  );
};
