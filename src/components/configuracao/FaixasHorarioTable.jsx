import React from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export const FaixasHorarioTable = ({
  faixas,
  novaHoraInicio,
  setNovaHoraInicio,
  novaHoraFim,
  setNovaHoraFim,
  addFaixa,
  actionTemplateFaixa
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white"><i className="pi pi-clock mr-2"></i>Faixas de Horários</h3>
      <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:items-end">
        <div className="w-full sm:flex-1">
          <label className="block text-xs font-semibold mb-1 text-gray-600 dark:text-gray-400">Início</label>
          <InputText type="time" value={novaHoraInicio} onChange={(e) => setNovaHoraInicio(e.target.value)} className="w-full" />
        </div>
        <div className="w-full sm:flex-1">
          <label className="block text-xs font-semibold mb-1 text-gray-600 dark:text-gray-400">Fim</label>
          <InputText type="time" value={novaHoraFim} onChange={(e) => setNovaHoraFim(e.target.value)} className="w-full" />
        </div>
        <Button type="button" label="Adicionar" icon="pi pi-plus" onClick={addFaixa} className="theme-btn-primary text-white w-full sm:w-auto" />
      </div>
      
      {faixas.length > 0 ? (
        <DataTable value={faixas} emptyMessage="Nenhuma faixa cadastrada." size="small">
          <Column field="hora_inicio" header="Início" />
          <Column field="hora_fim" header="Fim" />
          <Column body={actionTemplateFaixa} style={{ width: '4rem' }} />
        </DataTable>
      ) : (
        <p className="text-sm text-gray-500 italic">Sem faixas cadastradas. Coletores só poderão selecionar "Dia Inteiro".</p>
      )}
    </div>
  );
};
