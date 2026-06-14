import React from 'react';
import { Button } from 'primereact/button';

export const GerenciarOfertaHeader = ({ oferta, navigate, handleAlterarStatus, loadingAction }) => {
  return (
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
            <span className="text-gray-400 dark:text-gray-600 hidden sm:inline">•</span>
            <span className="text-gray-600 dark:text-gray-400 text-sm font-medium flex items-center gap-1.5">
              <i className="pi pi-map-marker text-xs opacity-70"></i>
              {oferta.endereco ? `${oferta.endereco.logradouro}, ${oferta.endereco.numero} - ${oferta.endereco.bairro}` : 'Endereço não informado'}
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
  );
};
