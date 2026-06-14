import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Paginator } from 'primereact/paginator';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { ofertasService } from '../services/ofertasService';
import { coletasService } from '../services/coletasService';
import { disponibilidadeService } from '../services/disponibilidadeService';
import { MapaOfertas } from '../components/common/MapaOfertas';
import { MuralOfertaCard } from '../components/ofertas/MuralOfertaCard';
import { AgendamentoColetaModal } from '../components/ofertas/AgendamentoColetaModal';
import { formatarDataCurta } from '../utils/formatters';

export const MuralOfertas = () => {
  const navigate = useNavigate();
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ofertaSelecionada, setOfertaSelecionada] = useState(null);
  const [first, setFirst] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const location = useLocation();
  const [viewMode, setViewMode] = useState(location.state?.tab || 'lista'); // 'lista' ou 'mapa'
  
  // States para o Agendamento
  const [agendamentoStep, setAgendamentoStep] = useState(0); // 0 = Detalhes, 1 = Selecionar Data/Slot
  const [dataDesejada, setDataDesejada] = useState(null);
  const [horaDesejada, setHoraDesejada] = useState(null);
  const [buscandoSlots, setBuscandoSlots] = useState(false);
  const [slotsData, setSlotsData] = useState(null);
  const [mensagemSlot, setMensagemSlot] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [agendando, setAgendando] = useState(false);

  const toast = useRef(null);

  const fetchOfertas = async (page = 1) => {
    setLoading(true);
    try {
      const response = await ofertasService.listarOfertas({ page });
      const dados = response.data ? response.data : response;
      setOfertas(Array.isArray(dados) ? dados : []);
      if (response.meta) {
        setTotalRecords(response.meta.total);
      }
    } catch (error) {
      console.error('Erro ao buscar ofertas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfertas(1);
  }, []);

  const onPageChange = (event) => {
    setFirst(event.first);
    fetchOfertas(event.page + 1);
  };

  const minDate = new Date();
  minDate.setHours(0, 0, 0, 0);


  const abrirModal = (oferta) => {
    setOfertaSelecionada(oferta);
    setAgendamentoStep(0);
    setDataDesejada(null);
    setHoraDesejada(null);
    setSlotsData(null);
    setMensagemSlot('');
    setObservacoes('');
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
        setHoraDesejada(null);
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
    if (!ofertaSelecionada || !dataDesejada || !horaDesejada) return;
    
    setAgendando(true);
    try {
      // Formar o YYYY-MM-DDTHH:mm:00
      const dataStr = new Date(dataDesejada.getTime() - (dataDesejada.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      const h = horaDesejada.getHours().toString().padStart(2, '0');
      const m = horaDesejada.getMinutes().toString().padStart(2, '0');
      const dataHoraFim = `${dataStr}T${h}:${m}:00`;

      await coletasService.reservarColeta(ofertaSelecionada.id, dataHoraFim, observacoes);
      toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Sua proposta de coleta foi enviada e está aguardando aprovação da fábrica!', life: 4000 });
      setOfertas(ofertas.filter(o => o.id !== ofertaSelecionada.id));
      fecharModal();
    } catch (error) {
      console.error(error);
      let erroMsg = 'Falha ao agendar coleta. Tente novamente.';
      if (error.response?.status === 422) {
        erroMsg = error.response.data.message || 'Os dados informados para o agendamento são inválidos.';
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
        <div className="flex items-center bg-gray-100/80 dark:bg-gray-800/80 p-1.5 rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-inner">
          <button
            onClick={() => setViewMode('lista')}
            className={`flex items-center justify-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
              viewMode === 'lista'
                ? 'bg-white dark:bg-gray-700 text-primary shadow ring-1 ring-black/5 dark:ring-white/10 scale-100'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 scale-95'
            }`}
          >
            <i className="pi pi-list"></i>
            Lista
          </button>
          <button
            onClick={() => setViewMode('mapa')}
            className={`flex items-center justify-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
              viewMode === 'mapa'
                ? 'bg-white dark:bg-gray-700 text-primary shadow ring-1 ring-black/5 dark:ring-white/10 scale-100'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 scale-95'
            }`}
          >
            <i className="pi pi-map-marker"></i>
            Mapa
          </button>
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
        <div className="flex flex-col gap-6">
          {viewMode === 'mapa' ? (
            <MapaOfertas ofertas={ofertas} onAgendarClick={abrirModal} />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ofertas.map(oferta => (
                  <MuralOfertaCard key={oferta.id} oferta={oferta} onDetalhes={abrirModal} />
                ))}
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden mt-4">
            <Paginator 
              first={first} 
              rows={9} 
              totalRecords={totalRecords} 
              onPageChange={onPageChange} 
              className="bg-transparent border-none py-3"
            />
          </div>
            </>
          )}
        </div>
      )}

      {/* Modal de Detalhes e Agendamento */}
      <AgendamentoColetaModal 
        ofertaSelecionada={ofertaSelecionada}
        agendamentoStep={agendamentoStep}
        setAgendamentoStep={setAgendamentoStep}
        dataDesejada={dataDesejada}
        setDataDesejada={setDataDesejada}
        horaDesejada={horaDesejada}
        setHoraDesejada={setHoraDesejada}
        buscandoSlots={buscandoSlots}
        slotsData={slotsData}
        mensagemSlot={mensagemSlot}
        observacoes={observacoes}
        setObservacoes={setObservacoes}
        agendando={agendando}
        handleAgendarColeta={handleAgendarColeta}
        fecharModal={fecharModal}
        minDate={minDate}
      />
    </div>
  );
};
