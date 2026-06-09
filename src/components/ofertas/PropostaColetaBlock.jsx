import React from 'react';
import { Button } from 'primereact/button';
import { formatarDataHora } from '../../utils/formatters';

export const PropostaColetaBlock = ({ oferta, handleAprovar, handleRecusar, loadingAction }) => {
  return (
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
  );
};
