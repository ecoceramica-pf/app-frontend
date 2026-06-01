import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';
import { ofertasService } from '../services/ofertasService';
import { coletasService } from '../services/coletasService';
import { disponibilidadeService } from '../services/disponibilidadeService';

export const MuralOfertas = () => {
  const navigate = useNavigate();
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ofertaSelecionada, setOfertaSelecionada] = useState(null);
  
  // States para o Agendamento
  const [agendamentoStep, setAgendamentoStep] = useState(0); // 0 = Detalhes, 1 = Selecionar Data/Slot
  const [dataDesejada, setDataDesejada] = useState(null);
  const [buscandoSlots, setBuscandoSlots] = useState(false);
  const [slotsData, setSlotsData] = useState(null);
  const [mensagemSlot, setMensagemSlot] = useState('');
  const [slotSelecionado, setSlotSelecionado] = useState(null);
  const [agendando, setAgendando] = useState(false);

  const toast = useRef(null);

  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        const response = await ofertasService.listarOfertas();
        const dados = response.data ? response.data : response;
        setOfertas(Array.isArray(dados) ? dados : []);
      } catch (error) {
        console.error('Erro ao buscar ofertas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOfertas();
  }, []);

  const minDate = new Date();
  minDate.setHours(0, 0, 0, 0);

  const formatarData = (isoDate) => {
    if (!isoDate) return '';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: 'short', year: 'numeric'
    }).format(new Date(isoDate));
  };

  const abrirModal = (oferta) => {
    setOfertaSelecionada(oferta);
    setAgendamentoStep(0);
    setDataDesejada(null);
    setSlotsData(null);
    setMensagemSlot('');
    setSlotSelecionado(null);
  };

  const fecharModal = () => {
    setOfertaSelecionada(null);
  };

  // Buscar slots sempre que a dataDesejada mudar
  useEffect(() => {
    if (agendamentoStep === 1 && dataDesejada && ofertaSelecionada) {
      const fetchSlots = async () => {
        setBuscandoSlots(true);
        setSlotsData(null);
        setSlotSelecionado(null);
        try {
          // timezone offset correction para yyyy-mm-dd
          const dataStr = new Date(dataDesejada.getTime() - (dataDesejada.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
          const res = await disponibilidadeService.getSlotsDisponiveis(ofertaSelecionada.id, dataStr);
          
          setSlotsData(res.data);
          setMensagemSlot(res.message || '');
        } catch (err) {
          setSlotsData({ slots: [] });
          setMensagemSlot(err.response?.data?.message || 'Erro ao buscar disponibilidade.');
        } finally {
          setBuscandoSlots(false);
        }
      };
      fetchSlots();
    }
  }, [dataDesejada, agendamentoStep, ofertaSelecionada]);

  const handleAgendarColeta = async () => {
    if (!ofertaSelecionada || !dataDesejada || !slotSelecionado) return;
    
    setAgendando(true);
    try {
      // Formar o YYYY-MM-DDTHH:mm:00
      const dataStr = new Date(dataDesejada.getTime() - (dataDesejada.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      const dataHoraFim = `${dataStr}T${slotSelecionado.hora_inicio}:00`;

      await coletasService.reservarColeta(ofertaSelecionada.id, dataHoraFim);
      toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Coleta agendada com sucesso!', life: 4000 });
      setOfertas(ofertas.filter(o => o.id !== ofertaSelecionada.id));
      fecharModal();
    } catch (error) {
      console.error(error);
      let erroMsg = 'Falha ao agendar coleta. Tente novamente.';
      if (error.response?.status === 422) {
        erroMsg = 'Os dados informados para o agendamento são inválidos.';
      } else if (error.response?.data?.message && !error.response.data.message.includes('field must be')) {
        erroMsg = error.response.data.message;
      }
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: erroMsg, life: 4000 });
    } finally {
      setAgendando(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      <Toast ref={toast} />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Resíduos Disponíveis</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Veja os materiais disponíveis para coleta na sua região.</p>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
        </div>
      ) : ofertas.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center shadow-sm flex flex-col items-center">
          <i className="pi pi-inbox text-5xl text-gray-400 mb-4"></i>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Nenhuma oferta disponível no momento</h3>
          <p className="text-gray-500">Não há resíduos listados na plataforma atualmente. Volte mais tarde ou seja o primeiro a publicar uma nova oferta.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ofertas.map(oferta => {
            const isCortante = oferta.material?.cortante;
            const isAltoVolume = (oferta.quantidade_cacamba > 0) || (oferta.quantidade_kg > 500);
            
            let qtdeStr = [];
            if (oferta.quantidade_kg) qtdeStr.push(`${oferta.quantidade_kg} kg`);
            if (oferta.quantidade_cacamba) qtdeStr.push(`${oferta.quantidade_cacamba} caçamba(s)`);
            const quantidadeFinal = qtdeStr.join(' + ') || 'Não especificada';

            return (
              <div key={oferta.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full border-l-4 border-l-primary">
                <div className="p-5 pb-3 flex justify-between items-start gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">{oferta.material?.nome || 'Material Desconhecido'}</span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                      {quantidadeFinal}
                    </h3>
                  </div>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                    {formatarData(oferta.data_publicacao)}
                  </span>
                </div>
                <div className="p-5 pt-0 flex-1 flex flex-col gap-4">
                  <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400 mt-2">
                    <i className="pi pi-map-marker mt-0.5 text-sm"></i>
                    <p className="text-sm line-clamp-2">
                      {oferta.endereco 
                        ? [oferta.endereco.bairro, oferta.endereco.cidade].filter(Boolean).join(', ') || 'Endereço incompleto'
                        : 'Endereço não informado'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <i className="pi pi-building text-sm"></i>
                    <span className="text-sm truncate font-medium">Por: {oferta.usuario?.name || 'Fábrica parceira'}</span>
                  </div>
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
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 mt-auto">
                  <Button 
                    label="Ver Detalhes" 
                    icon="pi pi-arrow-right" 
                    iconPos="right"
                    outlined
                    className="w-full text-sm font-bold border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    onClick={() => abrirModal(oferta)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Detalhes e Agendamento */}
      <Dialog 
        visible={!!ofertaSelecionada} 
        onHide={fecharModal}
        header={<span className="text-xl font-bold text-gray-800 dark:text-white">
          {agendamentoStep === 0 ? 'Detalhes do Resíduo' : 'Agendar Coleta'}
        </span>}
        style={{ width: '95vw', maxWidth: '600px' }}
        draggable={false}
        resizable={false}
        modal
      >
        {ofertaSelecionada && agendamentoStep === 0 && (
          <div className="flex flex-col gap-6 pt-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-primary mb-1">
                  {ofertaSelecionada.material?.nome}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  {[
                    ofertaSelecionada.quantidade_kg ? `${ofertaSelecionada.quantidade_kg} kg` : null,
                    ofertaSelecionada.quantidade_cacamba ? `${ofertaSelecionada.quantidade_cacamba} caçamba(s)` : null
                  ].filter(Boolean).join(' + ')}
                </p>
              </div>
              <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold px-3 py-1 rounded-full uppercase">
                {ofertaSelecionada.status}
              </span>
            </div>

            <hr className="border-gray-100 dark:border-gray-800" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Fábrica</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  <i className="pi pi-building mr-2 text-gray-400"></i>
                  {ofertaSelecionada.usuario?.name || 'Fábrica Parceira'}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Localização</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  <i className="pi pi-map-marker mr-2 text-gray-400"></i>
                  {ofertaSelecionada.endereco 
                    ? [ofertaSelecionada.endereco.bairro, ofertaSelecionada.endereco.cidade].filter(Boolean).join(', ')
                    : 'Endereço não informado'}
                </p>
                {ofertaSelecionada.endereco?.logradouro && (
                  <p className="text-xs text-gray-500 mt-1 ml-6">
                    {ofertaSelecionada.endereco.logradouro}{ofertaSelecionada.endereco.numero ? `, ${ofertaSelecionada.endereco.numero}` : ''}
                  </p>
                )}
              </div>
            </div>

            {ofertaSelecionada.observacoes && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/50">
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                  <i className="pi pi-info-circle"></i>
                  Observações
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                  "{ofertaSelecionada.observacoes}"
                </p>
              </div>
            )}

            <div className="flex gap-3 mt-4 justify-end">
              <Button label="Cancelar" icon="pi pi-times" outlined onClick={fecharModal} className="p-button-secondary text-sm" />
              <Button label="Agendar Coleta" icon="pi pi-calendar" onClick={() => setAgendamentoStep(1)} className="theme-btn-primary text-white text-sm px-6" />
            </div>
          </div>
        )}

        {ofertaSelecionada && agendamentoStep === 1 && (
          <div className="flex flex-col gap-5 pt-2">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Selecione uma Data</label>
                <Calendar 
                  value={dataDesejada} 
                  onChange={(e) => setDataDesejada(e.value)} 
                  dateFormat="dd/mm/yy" 
                  inline
                  className="w-full"
                />
              </div>
              <div className="flex-1 flex flex-col border-l border-gray-200 dark:border-gray-700 pl-4">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Horários Disponíveis</label>
                
                {!dataDesejada ? (
                  <div className="flex-1 flex items-center justify-center text-center text-sm text-gray-500 italic">
                    Escolha uma data no calendário ao lado.
                  </div>
                ) : buscandoSlots ? (
                  <div className="flex-1 flex items-center justify-center">
                    <ProgressSpinner style={{width: '30px', height: '30px'}} strokeWidth="4" />
                  </div>
                ) : slotsData && slotsData.slots && slotsData.slots.length > 0 ? (
                  <div className="flex flex-col gap-2 overflow-y-auto max-h-64">
                    {slotsData.slots.map((s, idx) => (
                      <Button
                        key={idx}
                        label={s.tipo === 'dia_inteiro' ? 'Qualquer horário (Dia Inteiro)' : `${s.hora_inicio} às ${s.hora_fim}`}
                        outlined={slotSelecionado !== s}
                        className={`w-full text-sm py-2 ${slotSelecionado === s ? 'theme-btn-primary text-white' : 'text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        onClick={() => setSlotSelecionado(s)}
                      />
                    ))}
                    {slotsData.coletas_restantes && (
                       <p className="text-xs text-center text-gray-500 mt-2">Vagas restantes da fábrica hoje: {slotsData.coletas_restantes}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <i className="pi pi-calendar-times text-3xl text-gray-400 mb-2"></i>
                    <p className="text-sm text-gray-500 font-medium">
                      {mensagemSlot || 'Nenhum horário disponível para esta data.'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-2 justify-between">
              <Button label="Voltar" icon="pi pi-arrow-left" text onClick={() => setAgendamentoStep(0)} className="text-sm" />
              <div className="flex gap-2">
                <Button label="Cancelar" outlined onClick={fecharModal} className="p-button-secondary text-sm" />
                <Button 
                  label="Confirmar Reserva" 
                  icon="pi pi-check" 
                  loading={agendando}
                  disabled={!slotSelecionado}
                  onClick={handleAgendarColeta} 
                  className="theme-btn-primary text-white text-sm px-6" 
                />
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};
