import React from 'react';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';

const DIAS_SEMANA = [
  { label: 'Domingo', value: 0 },
  { label: 'Segunda-feira', value: 1 },
  { label: 'Terça-feira', value: 2 },
  { label: 'Quarta-feira', value: 3 },
  { label: 'Quinta-feira', value: 4 },
  { label: 'Sexta-feira', value: 5 },
  { label: 'Sábado', value: 6 }
];

const DURACAO_OPCOES = [
  { label: '30 Minutos', value: 30 },
  { label: '1 Hora', value: 60 },
  { label: '2 Horas', value: 120 },
  { label: 'Dia Inteiro', value: null }
];

export const ConfigGeralForm = ({
  diasSelecionados,
  onDiaChange,
  duracao,
  setDuracao,
  antecedencia,
  setAntecedencia,
  maxColetas,
  setMaxColetas,
  salvarGeral,
  salvando
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col h-full">
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white"><i className="pi pi-cog mr-2"></i>Configurações Gerais</h3>
      
      <div className="mb-5">
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Dias de Operação da Fábrica</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {DIAS_SEMANA.map((dia) => (
            <div key={dia.value} className="flex items-center">
              <Checkbox 
                inputId={`dia-${dia.value}`} 
                name="dia" 
                value={dia.value} 
                onChange={onDiaChange} 
                checked={diasSelecionados.includes(dia.value)} 
              />
              <label htmlFor={`dia-${dia.value}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">{dia.label}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Duração Aproximada por Coleta</label>
        <Dropdown 
          value={duracao} 
          options={DURACAO_OPCOES} 
          onChange={(e) => setDuracao(e.value)} 
          placeholder="Selecione a duração"
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col">
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Antecedência Mínima (dias)</label>
          <InputNumber 
            value={antecedencia} 
            onValueChange={(e) => setAntecedencia(e.value)} 
            min={0} 
            max={90}
            useGrouping={false}
            showButtons
            className="w-full" 
            inputClassName="w-full text-center" 
          />
          <small className="text-gray-500 mt-1">0 = Permite agendar p/ hoje (Máx: 90 dias)</small>
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Máx Coletas / Dia</label>
          <InputNumber 
            value={maxColetas} 
            onValueChange={(e) => setMaxColetas(e.value)} 
            min={1} 
            max={50}
            useGrouping={false}
            showButtons
            className="w-full" 
            inputClassName="w-full text-center" 
          />
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
        <Button label="Salvar Configurações Gerais" icon="pi pi-save" onClick={salvarGeral} loading={salvando} className="w-full theme-btn-primary text-white" />
      </div>
    </div>
  );
};
