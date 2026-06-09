import React from 'react';
import { Button } from 'primereact/button';
import { formatarDataHora } from '../../utils/formatters';

export const ProgressoColetaBlock = ({ oferta, handleConfirmarColeta, loadingAction }) => {
  return (
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
  );
};
