import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

export const GerenciarColetaModal = ({
  coletaSelecionada,
  fecharModal,
  loadingAction,
  handleCancelar,
  handleConfirmar,
  getStatusClass
}) => {
  const formatarDataHora = (isoDate) => {
    if (!isoDate) return '';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(new Date(isoDate));
  };

  return (
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

          {coletaSelecionada.observacoes && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/50 mt-4">
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                <i className="pi pi-info-circle"></i>
                Observações enviadas por você
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                "{coletaSelecionada.observacoes}"
              </p>
            </div>
          )}

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
  );
};
