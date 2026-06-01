import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { coletasService } from '../services/coletasService';

export const MinhasColetas = () => {
  const navigate = useNavigate();
  const [coletas, setColetas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const toast = useRef(null);
  const [coletaSelecionada, setColetaSelecionada] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);

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
                    onClick={() => abrirModal(coleta)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Modal de Gerenciamento */}
      <Dialog 
        visible={!!coletaSelecionada} 
        onHide={fecharModal}
        header={<span className="text-xl font-bold text-gray-800 dark:text-white">Gerenciar Coleta</span>}
        style={{ width: '95vw', maxWidth: '600px' }}
        modal
      >
        {coletaSelecionada && (
          <div className="flex flex-col gap-6 pt-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-secondary mb-1">
                  {coletaSelecionada.oferta_residuo?.material?.nome}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  Agendado para: <span className="text-gray-900 dark:text-gray-200">{formatarDataHora(coletaSelecionada.data_agendamento)}</span>
                </p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${getStatusClass(coletaSelecionada.status)}`}>
                {coletaSelecionada.status}
              </span>
            </div>

            <hr className="border-gray-100 dark:border-gray-800" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Fábrica (Local de Retirada)</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  <i className="pi pi-building mr-2 text-gray-400"></i>
                  {coletaSelecionada.oferta_residuo?.usuario?.razao_social || coletaSelecionada.oferta_residuo?.usuario?.name || 'Fábrica Parceira'}
                </p>
                {coletaSelecionada.oferta_residuo?.usuario?.telefone && (
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1">
                    <i className="pi pi-phone mr-2 text-gray-400"></i>
                    {coletaSelecionada.oferta_residuo.usuario.telefone}
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Endereço</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  <i className="pi pi-map-marker mr-2 text-gray-400"></i>
                  {coletaSelecionada.oferta_residuo?.endereco 
                    ? [coletaSelecionada.oferta_residuo.endereco.bairro, coletaSelecionada.oferta_residuo.endereco.cidade].filter(Boolean).join(', ')
                    : 'Endereço não informado'}
                </p>
                {coletaSelecionada.oferta_residuo?.endereco?.logradouro && (
                  <p className="text-xs text-gray-500 mt-1 ml-6">
                    {coletaSelecionada.oferta_residuo.endereco.logradouro}{coletaSelecionada.oferta_residuo.endereco.numero ? `, ${coletaSelecionada.oferta_residuo.endereco.numero}` : ''}
                  </p>
                )}
              </div>
            </div>

            {/* Status das Confirmações */}
            {coletaSelecionada.status === 'pendente' ? (
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg flex items-center gap-3">
                <i className="pi pi-clock text-amber-500 text-xl"></i>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Aguardando aprovação da fábrica. Assim que a fábrica aceitar seu horário, você poderá realizar a coleta.
                </p>
              </div>
            ) : coletaSelecionada.status === 'recusado' ? (
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg flex items-center gap-3">
                <i className="pi pi-times-circle text-red-500 text-xl"></i>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Infelizmente a fábrica recusou o seu agendamento para este horário. A oferta retornou ao mural.
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg flex flex-col gap-3">
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Status das Confirmações (Após Aprovação)</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Sua Confirmação (Coletor)</span>
                  {coletaSelecionada.confirmacao_coletor ? (
                    <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded"><i className="pi pi-check mr-1"></i> Confirmado</span>
                  ) : (
                    <span className="text-xs font-bold text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded"><i className="pi pi-clock mr-1"></i> Pendente</span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Confirmação da Fábrica</span>
                  {coletaSelecionada.confirmacao_fabrica ? (
                    <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded"><i className="pi pi-check mr-1"></i> Confirmado</span>
                  ) : (
                    <span className="text-xs font-bold text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded"><i className="pi pi-clock mr-1"></i> Pendente</span>
                  )}
                </div>
              </div>
            )}

            {/* Ações */}
            <div className="flex justify-between items-center mt-4">
              {['pendente', 'agendado'].includes(coletaSelecionada.status) ? (
                <Button 
                  label="Cancelar Coleta" 
                  icon="pi pi-times" 
                  severity="danger"
                  text
                  loading={loadingAction}
                  onClick={handleCancelar}
                  className="text-sm"
                />
              ) : <div></div>}
              
              <div className="flex gap-2">
                <Button label="Fechar" outlined onClick={fecharModal} className="p-button-secondary text-sm" />
                
                {coletaSelecionada.status === 'agendado' && !coletaSelecionada.confirmacao_coletor && (
                  <Button 
                    label="Confirmar Retirada" 
                    icon="pi pi-check" 
                    loading={loadingAction}
                    onClick={handleConfirmar}
                    className="!bg-secondary hover:!bg-secondary/90 !border-none text-white text-sm px-4" 
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};
