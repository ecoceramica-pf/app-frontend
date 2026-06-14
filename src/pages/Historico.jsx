import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ofertasService } from '../services/ofertasService';
import { coletasService } from '../services/coletasService';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useNavigate } from 'react-router-dom';
import { formatarDataHora } from '../utils/formatters';

export const Historico = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    fetchHistorico();
  }, [user]);

  const fetchHistorico = async () => {
    setLoading(true);
    try {
      if (user?.tipo_perfil === 'fabrica') {
        const response = await ofertasService.minhasOfertas();
        const dados = Array.isArray(response) ? response : (response.data || []);
        // Filtra apenas concluídos ou cancelados
        const historico = dados.filter(d => ['concluido', 'cancelado'].includes(d.status?.toLowerCase()));
        setItems(historico);
      } else if (user?.tipo_perfil === 'coletor') {
        const response = await coletasService.minhasColetas();
        const dados = Array.isArray(response) ? response : (response.data || []);
        // Filtra apenas concluídos ou cancelados/recusados
        const historico = dados.filter(d => ['concluido', 'cancelado', 'recusado'].includes(d.status?.toLowerCase()));
        setItems(historico);
      }
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    return {
      'concluido': 'bg-green-100 text-green-800 border-green-200',
      'cancelado': 'bg-red-100 text-red-800 border-red-200',
      'recusado': 'bg-red-100 text-red-800 border-red-200'
    }[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Histórico</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Registro de todas as suas operações finalizadas.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center shadow-sm flex flex-col items-center">
          <i className="pi pi-history text-5xl text-gray-400 mb-4"></i>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Seu histórico está vazio</h3>
          <p className="text-gray-500 mb-6">Nenhuma operação foi concluída ou cancelada ainda.</p>
          <Button label="Voltar para Dashboard" outlined onClick={() => navigate('/dashboard')} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const dataStr = item.data_reserva || item.data_agendamento || item.data_publicacao || item.created_at;
            const dataObj = new Date(dataStr);
            const dataStrFormatted = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(dataObj);
            
            const isFabrica = user?.tipo_perfil === 'fabrica';
            const material = isFabrica ? item.material?.nome : item.oferta_residuo?.material?.nome;
            const qtdKg = isFabrica ? item.quantidade_kg : item.oferta_residuo?.quantidade_kg;
            const qtdCacamba = isFabrica ? item.quantidade_cacamba : item.oferta_residuo?.quantidade_cacamba;
            const quantidadeFinal = [
              qtdKg > 0 ? `${qtdKg} kg` : null,
              qtdCacamba > 0 ? `${qtdCacamba} caçamba(s)` : null
            ].filter(Boolean).join(' + ') || 'Qtd. não especificada';

            const enderecoObj = isFabrica ? item.endereco : item.oferta_residuo?.endereco;
            const endereco = enderecoObj 
              ? `${enderecoObj.bairro}, ${enderecoObj.cidade}` 
              : 'Endereço não informado';

            const pessoaEnvolvida = isFabrica 
              ? (item.coleta?.coletor?.nome || 'Coletor não definido')
              : (item.oferta_residuo?.usuario?.razao_social || item.oferta_residuo?.usuario?.nome || 'Fábrica não definida');
            const labelPessoa = isFabrica ? 'Coletor:' : 'Fábrica:';

            const statusLower = item.status?.toLowerCase() || '';
            let statusColorClass = 'border-l-gray-400';
            let badgeBg = 'bg-gray-100 text-gray-700';
            let badgeIcon = 'pi-info-circle';
            
            if (statusLower === 'concluido') {
              statusColorClass = 'border-l-[#417616]'; 
              badgeBg = 'bg-[#a3e635] text-[#3f6212]'; 
              badgeIcon = 'pi-check-circle';
            } else if (statusLower === 'cancelado' || statusLower === 'recusado') {
              statusColorClass = 'border-l-red-600';
              badgeBg = 'bg-red-100 text-red-700';
              badgeIcon = 'pi-times-circle';
            } else {
              statusColorClass = 'border-l-[#1e3a8a]'; 
              badgeBg = 'bg-blue-100 text-blue-700';
              badgeIcon = 'pi-clock';
            }

            return (
              <div key={item.id} className={`bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 border-l-8 ${statusColorClass} p-5 flex flex-col gap-4 transition-all hover:shadow-md`}>
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                    <i className="pi pi-box text-[#1e3a8a] dark:text-blue-400 text-xl"></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#1e3a8a] dark:text-blue-400 text-lg leading-tight">
                      {material}
                    </h4>
                    <p className="font-semibold text-gray-700 dark:text-gray-300 mt-1">
                      {quantidadeFinal}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                      <i className="pi pi-map-marker mr-1"></i> {endereco}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 sm:px-4 flex flex-col justify-between items-start gap-3 mt-auto">
                  <div className="flex justify-between w-full items-start">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      <i className="pi pi-calendar mr-1.5 text-gray-400"></i>
                      Em {dataStrFormatted}
                    </span>
                    <div className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold flex items-center gap-1 ${badgeBg}`}>
                      <i className={`pi ${badgeIcon} text-[10px]`}></i> 
                      <span>{statusLower}</span>
                    </div>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">
                    <i className="pi pi-truck mr-1.5 text-gray-400"></i>
                    {labelPessoa} {pessoaEnvolvida}
                  </span>
                </div>

                <div className="flex justify-end mt-1">
                  <Button 
                    label="Ver Detalhes" 
                    icon="pi pi-arrow-right" 
                    iconPos="right" 
                    className="p-0 font-bold text-[#1e3a8a] dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300" 
                    text
                    onClick={() => {
                      setSelectedItem(item);
                      setDialogVisible(true);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dialog de Detalhes */}
      <Dialog 
        header={<span className="text-xl font-bold text-gray-900 dark:text-white">Detalhes do Histórico</span>}
        visible={dialogVisible} 
        onHide={() => {
          setDialogVisible(false);
          setSelectedItem(null);
        }}
        style={{ width: '40rem' }}
        breakpoints={{ '960px': '75vw', '640px': '90vw' }}
        modal
      >
        {selectedItem && (() => {
          const isFabrica = user?.tipo_perfil === 'fabrica';
          const oferta = isFabrica ? selectedItem : selectedItem.oferta_residuo;
          const coleta = isFabrica ? selectedItem.coleta : selectedItem;

          const materialNome = oferta?.material?.nome || 'Desconhecido';
          const qtdKg = oferta?.quantidade_kg;
          const qtdCacamba = oferta?.quantidade_cacamba;
          const quantidadeFinal = [
            qtdKg > 0 ? `${qtdKg} kg` : null,
            qtdCacamba > 0 ? `${qtdCacamba} caçamba(s)` : null
          ].filter(Boolean).join(' + ') || 'Não especificada';
          
          const enderecoObj = oferta?.endereco;
          const endereco = enderecoObj 
            ? `${enderecoObj.logradouro}, ${enderecoObj.numero} - ${enderecoObj.bairro}, ${enderecoObj.cidade} - ${enderecoObj.estado}` 
            : 'Endereço não informado';

          const pessoaEnvolvida = isFabrica 
            ? (coleta?.coletor?.nome || 'Coletor não definido')
            : (oferta?.usuario?.razao_social || oferta?.usuario?.nome || 'Fábrica não definida');
          const labelPessoa = isFabrica ? 'Coletor' : 'Fábrica';

          return (
            <div className="flex flex-col gap-5 text-gray-800 dark:text-gray-200 mt-2">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <p className="font-bold text-lg capitalize text-gray-900 dark:text-white">
                    {selectedItem.status || 'Indefinido'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Data Final</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatarDataHora(selectedItem.data_reserva || selectedItem.data_agendamento || selectedItem.created_at)}
                  </p>
                </div>
              </div>

              <div>
                <h5 className="font-bold mb-2 flex items-center text-gray-900 dark:text-gray-100">
                  <i className="pi pi-box mr-2 text-primary"></i> Material
                </h5>
                <p className="text-gray-700 dark:text-gray-300 ml-6">
                  {materialNome} <br />
                  <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-sm text-primary mt-1 inline-block">
                    {quantidadeFinal}
                  </span>
                </p>
              </div>

              <div>
                <h5 className="font-bold mb-2 flex items-center text-gray-900 dark:text-gray-100">
                  <i className="pi pi-map-marker mr-2 text-primary"></i> Local
                </h5>
                <p className="text-gray-700 dark:text-gray-300 ml-6">{endereco}</p>
              </div>

              <div>
                <h5 className="font-bold mb-2 flex items-center text-gray-900 dark:text-gray-100">
                  <i className="pi pi-users mr-2 text-primary"></i> Envolvidos
                </h5>
                <p className="text-gray-700 dark:text-gray-300 ml-6">
                  <span className="text-gray-500">{labelPessoa}:</span> {pessoaEnvolvida}
                </p>
              </div>
              
              {coleta?.observacoes && (
                <div>
                  <h5 className="font-bold mb-2 flex items-center text-gray-900 dark:text-gray-100">
                    <i className="pi pi-align-left mr-2 text-primary"></i> Observações
                  </h5>
                  <p className="text-gray-700 dark:text-gray-300 ml-6 bg-gray-50 dark:bg-gray-800/50 p-3 rounded italic border-l-2 border-primary">
                    "{coleta.observacoes}"
                  </p>
                </div>
              )}
            </div>
          );
        })()}
      </Dialog>
    </div>
  );
};
