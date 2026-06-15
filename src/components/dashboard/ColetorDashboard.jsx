import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paginator } from 'primereact/paginator';
import { ofertasService } from '../../services/ofertasService';
import { coletasService } from '../../services/coletasService';
import { AuthContext } from '../../context/AuthContext';
import { Button } from 'primereact/button';

export const ColetorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [ofertasDisponiveis, setOfertasDisponiveis] = useState([]);
  const [minhasColetas, setMinhasColetas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const [first, setFirst] = useState(0);
  const rows = 3;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ofertasData, coletasData] = await Promise.all([
        ofertasService.listarOfertas({ status: 'disponivel' }),
        coletasService.minhasColetas()
      ]);
      
      setOfertasDisponiveis(Array.isArray(ofertasData) ? ofertasData : (ofertasData?.data || []));
      setMinhasColetas(Array.isArray(coletasData) ? coletasData : (coletasData?.data || []));
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalOfertas = ofertasDisponiveis.length;
  const coletasAtivas = minhasColetas.filter(c => ['agendado', 'pendente'].includes(c.status?.toLowerCase())).length;
  const kgColetados = minhasColetas.filter(c => c.status?.toLowerCase() === 'concluido').reduce((acc, curr) => acc + (Number(curr.oferta_residuo?.quantidade_kg) || 0), 0);
  const displayUserName = user?.nome || user?.name || 'Coletor';

  // Get current page items
  const displayedColetas = minhasColetas.slice(first, first + rows);

  const getStatusClass = (status) => {
    return {
      'Pendente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Em Processo': 'bg-blue-100 text-blue-800 border-blue-200',
      'Agendado': 'bg-blue-100 text-blue-800 border-blue-200',
      'Concluido': 'bg-green-100 text-green-800 border-green-200',
      'Cancelado': 'bg-red-100 text-red-800 border-red-200'
    }[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatarData = (isoDate) => {
    if (!isoDate) return '';
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(isoDate));
  };

  const formatarDataHora = (isoDate) => {
    if (!isoDate) return '';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    }).format(new Date(isoDate)).replace(',', ' às');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white p-8 pb-20 rounded-2xl relative shadow-lg">
         <p className="text-lg opacity-90 mb-2">Bem-vindo(a) de volta,</p>
         <h1 className="text-3xl md:text-4xl font-bold mb-4">{displayUserName}</h1>
         <p className="text-xl opacity-90">Pronto para mais um dia transformando resíduos em oportunidades?</p>
      </section>

      {/* Quick Actions */}
      <section className="-mt-16 px-4 md:px-8 relative z-10">
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Action 1 */}
            <div 
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:-translate-y-1 hover:border-primary transition-all duration-200 group flex flex-col items-start cursor-pointer"
              onClick={() => navigate('/mural')}
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors mb-4">
                <i className="pi pi-search text-xl"></i>
              </div>
              <span className="font-semibold text-gray-800 dark:text-gray-100">Procurar Resíduos</span>
            </div>
            
            {/* Action 2 */}
            <div 
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:-translate-y-1 hover:border-secondary transition-all duration-200 group flex flex-col items-start cursor-pointer"
              onClick={() => navigate('/minhas-coletas')}
            >
              <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors mb-4">
                <i className="pi pi-truck text-xl"></i>
              </div>
              <span className="font-semibold text-gray-800 dark:text-gray-100">Minhas Coletas</span>
            </div>

            {/* Action 3 */}
            <div 
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:-translate-y-1 hover:border-detail transition-all duration-200 group flex flex-col items-start cursor-pointer"
              onClick={() => navigate('/mural', { state: { tab: 'mapa' } })}
            >
              <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-detail group-hover:bg-detail group-hover:text-white transition-colors mb-4">
                <i className="pi pi-map text-xl"></i>
              </div>
              <span className="font-semibold text-gray-800 dark:text-gray-100">Mapa da Região</span>
            </div>

            {/* Action 4 */}
            <div 
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:-translate-y-1 hover:border-primary transition-all duration-200 group flex flex-col items-start cursor-pointer"
              onClick={() => navigate('/meu-impacto')}
            >
              <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors mb-4">
                <i className="pi pi-chart-line text-xl"></i>
              </div>
              <span className="font-semibold text-gray-800 dark:text-gray-100">Meu Impacto</span>
            </div>
         </div>
      </section>

      {/* Metrics & Activities */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
         {/* Metrics Column */}
         <div className="lg:col-span-1 space-y-6">
            {/* Metric 1 */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 border-l-4 border-l-primary p-6 shadow-sm flex items-center justify-between">
               <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Ofertas Disponíveis</p>
                  <p className="text-3xl font-bold text-primary">{totalOfertas}</p>
               </div>
               <i className="pi pi-inbox text-primary text-4xl opacity-20"></i>
            </div>

            {/* Metric 2 */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 border-l-4 border-l-secondary p-6 shadow-sm flex items-center justify-between">
               <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Coletas Ativas</p>
                  <p className="text-3xl font-bold text-secondary">{coletasAtivas}</p>
               </div>
               <i className="pi pi-truck text-secondary text-4xl opacity-20"></i>
            </div>

            {/* Metric 3 */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 border-l-4 border-l-secondary p-6 shadow-sm flex items-center justify-between">
               <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Coletado (kg)</p>
                  <p className="text-3xl font-bold text-secondary">{kgColetados}</p>
               </div>
               <i className="pi pi-sync text-secondary text-4xl opacity-20"></i>
            </div>
         </div>

         {/* Activities Column - Card List */}
         <div className="lg:col-span-2 flex flex-col h-full">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm flex-grow">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Minhas Coletas Recentes</h2>
              </div>
              
              {loading ? (
                <div className="text-center py-8 text-gray-500 flex justify-center">
                  <i className="pi pi-spin pi-spinner text-2xl"></i>
                </div>
              ) : minhasColetas.length === 0 ? (
                <div className="text-center py-8 text-gray-500 flex flex-col items-center">
                   <i className="pi pi-info-circle text-4xl mb-3 opacity-50"></i>
                   <p>Você ainda não reservou nenhuma coleta.</p>
                   <Button label="Ver Ofertas Disponíveis" link onClick={() => navigate('/mural')} />
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-4">
                    {displayedColetas.map((coleta) => (
                      <div key={coleta.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-5 flex flex-col gap-4 border-l-4 border-l-secondary cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/minhas-coletas')}>
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-secondary uppercase tracking-wider">{coleta.oferta_residuo?.material?.nome || 'Material Desconhecido'}</span>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                              {[
                                coleta.oferta_residuo?.quantidade_kg ? `${coleta.oferta_residuo.quantidade_kg} kg` : null,
                                coleta.oferta_residuo?.quantidade_cacamba ? `${coleta.oferta_residuo.quantidade_cacamba} caçamba(s)` : null
                              ].filter(Boolean).join(' + ') || 'Não especificada'}
                            </h3>
                          </div>
                          <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${getStatusClass(coleta.status)}`}>
                            {coleta.status}
                          </span>
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <i className="pi pi-building text-sm"></i>
                            <span className="text-sm truncate font-medium">De: {coleta.oferta_residuo?.usuario?.razao_social || coleta.oferta_residuo?.usuario?.name || 'Fábrica Parceira'}</span>
                          </div>
                          <div className="flex justify-between items-end">
                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-gray-500">
                                Reservado em {formatarData(coleta.data_reserva)}
                              </span>
                              {coleta.data_agendamento && (
                                <span className="text-xs font-bold text-primary">
                                  Agendado: {formatarDataHora(coleta.data_agendamento)}
                                </span>
                              )}
                            </div>
                            <div>
                              <Button icon="pi pi-angle-right" rounded text severity="secondary" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {minhasColetas.length > rows && (
                    <div className="mt-6 border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-center">
                      <Paginator 
                        first={first} 
                        rows={rows} 
                        totalRecords={minhasColetas.length} 
                        onPageChange={(e) => setFirst(e.first)} 
                        className="bg-transparent border-none p-0"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
         </div>
      </section>
    </div>
  );
};
