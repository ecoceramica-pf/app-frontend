import React, { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { disponibilidadeService } from '../services/disponibilidadeService';
import { ConfigGeralForm } from '../components/configuracao/ConfigGeralForm';
import { FaixasHorarioTable } from '../components/configuracao/FaixasHorarioTable';
import { BloqueiosTable } from '../components/configuracao/BloqueiosTable';

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
      <button className="p-button p-component p-button-icon-only p-button-danger p-button-rounded p-button-outlined" onClick={() => removerFaixaItem(rowData.id)}>
        <span className="p-button-icon p-c pi pi-trash"></span>
      </button>
    );
  };

  const actionTemplateBloqueio = (rowData) => {
    return (
      <button className="p-button p-component p-button-icon-only p-button-danger p-button-rounded p-button-outlined" onClick={() => removerBloqueioItem(rowData.id)}>
        <span className="p-button-icon p-c pi pi-trash"></span>
      </button>
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
        <ConfigGeralForm 
          diasSelecionados={diasSelecionados}
          onDiaChange={onDiaChange}
          duracao={duracao}
          setDuracao={setDuracao}
          antecedencia={antecedencia}
          setAntecedencia={setAntecedencia}
          maxColetas={maxColetas}
          setMaxColetas={setMaxColetas}
          salvarGeral={salvarGeral}
          salvando={salvando}
        />

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
              <FaixasHorarioTable 
                faixas={faixas}
                novaHoraInicio={novaHoraInicio}
                setNovaHoraInicio={setNovaHoraInicio}
                novaHoraFim={novaHoraFim}
                setNovaHoraFim={setNovaHoraFim}
                addFaixa={addFaixa}
                actionTemplateFaixa={actionTemplateFaixa}
              />

              {/* Bloqueios */}
              <BloqueiosTable 
                bloqueios={bloqueios}
                novaDataBloqueio={novaDataBloqueio}
                setNovaDataBloqueio={setNovaDataBloqueio}
                novoMotivo={novoMotivo}
                setNovoMotivo={setNovoMotivo}
                addBloqueio={addBloqueio}
                actionTemplateBloqueio={actionTemplateBloqueio}
              />
            </>
          )}
        </div>

      </div>
    </div>
  );
};
