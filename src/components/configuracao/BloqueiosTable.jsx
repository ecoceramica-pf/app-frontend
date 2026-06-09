import React from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export const BloqueiosTable = ({
  bloqueios,
  novaDataBloqueio,
  setNovaDataBloqueio,
  novoMotivo,
  setNovoMotivo,
  addBloqueio,
  actionTemplateBloqueio
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white"><i className="pi pi-calendar-times mr-2"></i>Bloqueios (Feriados/Manutenções)</h3>
      <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:items-end">
        <div className="w-full sm:flex-[2]">
          <label className="block text-xs font-semibold mb-1 text-gray-600 dark:text-gray-400">Data</label>
          <Calendar 
            value={novaDataBloqueio} 
            onChange={(e) => setNovaDataBloqueio(e.value)} 
            dateFormat="dd/mm/yy" 
            className="w-full" 
            inputClassName="w-full"
            showIcon
          />
        </div>
        <div className="w-full sm:flex-[3]">
          <label className="block text-xs font-semibold mb-1 text-gray-600 dark:text-gray-400">Motivo (opcional)</label>
          <InputText value={novoMotivo} onChange={(e) => setNovoMotivo(e.target.value)} className="w-full" placeholder="Ex: Feriado" />
        </div>
        <Button type="button" label="Bloquear" icon="pi pi-plus" onClick={addBloqueio} className="theme-btn-primary text-white w-full sm:w-auto" />
      </div>

      {bloqueios.length > 0 ? (
        <DataTable value={bloqueios} emptyMessage="Nenhum bloqueio." size="small">
          <Column field="data_bloqueio" header="Data" body={(r) => {
            const [year, month, day] = r.data_bloqueio.substring(0, 10).split('-');
            return `${day}/${month}/${year}`;
          }} />
          <Column field="motivo" header="Motivo" />
          <Column body={actionTemplateBloqueio} style={{ width: '4rem' }} />
        </DataTable>
      ) : (
        <p className="text-sm text-gray-500 italic">Nenhuma data bloqueada.</p>
      )}
    </div>
  );
};
