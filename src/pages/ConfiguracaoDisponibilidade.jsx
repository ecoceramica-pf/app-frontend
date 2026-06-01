import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import { disponibilidadeService } from '../services/disponibilidadeService';

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

export const ConfiguracaoDisponibilidade = () => {
  const toast = useRef(null);
  
  // States Gerais
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [configExiste, setConfigExiste] = useState(false);
  
  // States do Form Principal
  const [diasSelecionados, setDiasSelecionados] = useState([]);
  const [duracao, setDuracao] = useState(null);
  const [antecedencia, setAntecedencia] = useState(1);
  const [maxColetas, setMaxColetas] = useState(5);

  // States de Faixas Horárias
  const [faixas, setFaixas] = useState([]);
  const [novaHoraInicio, setNovaHoraInicio] = useState('');
  const [novaHoraFim, setNovaHoraFim] = useState('');

  // States de Bloqueios
  const [bloqueios, setBloqueios] = useState([]);
  const [novaDataBloqueio, setNovaDataBloqueio] = useState(null);
  const [novoMotivo, setNovoMotivo] = useState('');

  const loadData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const response = await disponibilidadeService.getDisponibilidade();
      const disp = response.data ? response.data : response;
      if (disp && disp.id) {
        setConfigExiste(true);
        setDiasSelecionados(disp.dias_semana || []);
        setDuracao(disp.duracao_coleta_min);
        setAntecedencia(disp.antecedencia_minima_dias);
        setMaxColetas(disp.max_coletas_dia);
        setFaixas(disp.faixas_horarios || []);
        setBloqueios(disp.bloqueios || []);
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar configurações.' });
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onDiaChange = (e) => {
    let _dias = [...diasSelecionados];
    if (e.checked) _dias.push(e.value);
    else _dias = _dias.filter(d => d !== e.value);
    setDiasSelecionados(_dias.sort());
  };

  const salvarGeral = async () => {
    if (diasSelecionados.length === 0) {
      return toast.current?.show({ severity: 'warn', summary: 'Atenção', detail: 'Selecione pelo menos um dia da semana.' });
    }
    setSalvando(true);
    try {
      const payload = {
        dias_semana: diasSelecionados,
        duracao_coleta_min: duracao,
        antecedencia_minima_dias: antecedencia,
        max_coletas_dia: maxColetas
      };
      await disponibilidadeService.upsertDisponibilidade(payload);
      toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Configurações gerais salvas!' });
      loadData(false);
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao salvar as configurações.' });
    } finally {
      setSalvando(false);
    }
  };

  const addFaixa = async () => {
    if (!novaHoraInicio || !novaHoraFim) {
      toast.current?.show({ severity: 'warn', summary: 'Aviso', detail: 'Preencha Início e Fim antes de adicionar.' });
      return;
    }
    try {
      const inicioFmt = novaHoraInicio.substring(0, 5);
      const fimFmt = novaHoraFim.substring(0, 5);
      await disponibilidadeService.adicionarFaixa({ hora_inicio: inicioFmt, hora_fim: fimFmt });
      toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Faixa adicionada.' });
      setNovaHoraInicio('');
      setNovaHoraFim('');
      loadData(false);
    } catch (error) {
      let erroMsg = 'Falha ao adicionar faixa.';
      if (error.response?.status === 422) {
        erroMsg = 'Horário inválido. Certifique-se de que o "Fim" seja maior que o "Início".';
      }
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: erroMsg });
    }
  };

  const removerFaixaItem = async (id) => {
    try {
      await disponibilidadeService.removerFaixa(id);
      toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Faixa removida.' });
      loadData(false);
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao remover faixa.' });
    }
  };

  const addBloqueio = async () => {
    if (!novaDataBloqueio) {
      toast.current?.show({ severity: 'warn', summary: 'Aviso', detail: 'Selecione uma Data no calendário antes de adicionar.' });
      return;
    }
    try {
      const year = novaDataBloqueio.getFullYear();
      const month = String(novaDataBloqueio.getMonth() + 1).padStart(2, '0');
      const day = String(novaDataBloqueio.getDate()).padStart(2, '0');
      const isoDate = `${year}-${month}-${day}`;

      await disponibilidadeService.adicionarBloqueio({ data_bloqueio: isoDate, motivo: novoMotivo });
      toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Bloqueio adicionado.' });
      setNovaDataBloqueio(null);
      setNovoMotivo('');
      loadData(false);
    } catch (error) {
      let erroMsg = 'Falha ao adicionar bloqueio.';
      if (error.response?.status === 422) {
        erroMsg = 'Data inválida. Você não pode bloquear uma data que já passou.';
      }
      toast.current?.show({ severity: 'error', summary: 'Erro de Validação', detail: erroMsg });
    }
  };

  const removerBloqueioItem = async (id) => {
    try {
      await disponibilidadeService.removerBloqueio(id);
      toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Bloqueio removido.' });
      loadData(false);
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao remover bloqueio.' });
    }
  };

  const actionTemplateFaixa = (rowData) => {
    return (
      <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => removerFaixaItem(rowData.id)} />
    );
  };

  const actionTemplateBloqueio = (rowData) => {
    return (
      <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => removerBloqueioItem(rowData.id)} />
    );
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Carregando configurações...</div>;
  }

  const minDate = new Date();
  minDate.setHours(0, 0, 0, 0);

  return (
    <div className="flex flex-col gap-6">
      <Toast ref={toast} />
      
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Disponibilidade e Agendamento</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Configure os dias e horários que você aceita receber coletas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bloco Geral */}
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

        {/* Blocos de Tempo (Só mostra se já tem a config geral salva) */}
        <div className="flex flex-col gap-6">
          {!configExiste ? (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800 text-center flex-1 flex flex-col justify-center items-center">
              <i className="pi pi-info-circle text-4xl text-blue-500 mb-3"></i>
              <h4 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-2">Configure o Geral Primeiro</h4>
              <p className="text-sm text-blue-600 dark:text-blue-400">Para adicionar faixas de horários e datas bloqueadas, salve as configurações gerais ao lado primeiro.</p>
            </div>
          ) : (
            <>
              {/* Faixas de Horário */}
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

              {/* Bloqueios */}
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
            </>
          )}
        </div>

      </div>
    </div>
  );
};
