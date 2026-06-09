import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressSpinner } from 'primereact/progressspinner';

export const AgendamentoColetaModal = ({
  ofertaSelecionada,
  agendamentoStep,
  setAgendamentoStep,
  dataDesejada,
  setDataDesejada,
  horaDesejada,
  setHoraDesejada,
  buscandoSlots,
  slotsData,
  mensagemSlot,
  observacoes,
  setObservacoes,
  agendando,
  handleAgendarColeta,
  fecharModal,
  minDate
}) => {
  return (
    <Dialog 
      visible={!!ofertaSelecionada} 
      onHide={fecharModal}
      header={<span className="text-xl font-bold text-gray-800 dark:text-white">
        {agendamentoStep === 0 ? 'Detalhes do Resíduo' : 'Agendar Coleta'}
      </span>}
      style={{ width: '95vw', maxWidth: '750px' }}
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
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col md:flex-row gap-4 md:gap-6">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Selecione uma Data</label>
              <Calendar 
                value={dataDesejada} 
                onChange={(e) => setDataDesejada(e.value)} 
                dateFormat="dd/mm/yy" 
                minDate={minDate}
                inline
                className="w-full"
              />
            </div>
            <div className="flex-1 flex flex-col border-l border-gray-200 dark:border-gray-700 pl-4">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Seu Horário de Chegada</label>
              
              {!dataDesejada ? (
                <div className="flex-1 flex items-center justify-center text-center text-sm text-gray-500 italic">
                  Escolha uma data no calendário ao lado.
                </div>
              ) : buscandoSlots ? (
                <div className="flex-1 flex items-center justify-center">
                  <ProgressSpinner style={{width: '30px', height: '30px'}} strokeWidth="4" />
                </div>
              ) : slotsData && slotsData.slots && slotsData.slots.length > 0 ? (
                <div className="flex flex-col gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800/50">
                    <p className="text-xs font-bold text-blue-700 dark:text-blue-300 mb-2">Horários de Atendimento da Fábrica:</p>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 list-disc list-inside">
                      {slotsData.slots.map((s, idx) => (
                        <li key={idx}>
                          {s.tipo === 'dia_inteiro' ? 'Qualquer horário (Dia Inteiro)' : `${s.hora_inicio} às ${s.hora_fim}`}
                        </li>
                      ))}
                    </ul>
                    {slotsData.coletas_restantes !== undefined && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-semibold">
                        Vagas da fábrica neste dia: {slotsData.coletas_restantes}
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Que horas você chegará?
                    </label>
                    <Calendar 
                      value={horaDesejada} 
                      onChange={(e) => setHoraDesejada(e.value)} 
                      timeOnly 
                      hourFormat="24"
                      placeholder="Ex: 14:30"
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">O horário deve estar dentro das faixas de atendimento acima.</p>
                  </div>

                  <div className="mt-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Observações (Opcional)
                    </label>
                    <InputTextarea 
                      value={observacoes} 
                      onChange={(e) => setObservacoes(e.target.value)} 
                      rows={2} 
                      placeholder="Ex: Chegarei com caminhão de grande porte" 
                      className="w-full"
                      maxLength={1000}
                    />
                  </div>
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
                disabled={!horaDesejada || !dataDesejada}
                onClick={handleAgendarColeta} 
                className="theme-btn-primary text-white text-sm px-6" 
              />
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
};
