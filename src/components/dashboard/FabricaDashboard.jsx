import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paginator } from 'primereact/paginator';
import { ofertasService } from '../../services/ofertasService';
import { AuthContext } from '../../context/AuthContext';
import { OfertaCard } from './OfertaCard';

export const FabricaDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const [first, setFirst] = useState(0);
  const rows = 3;

  useEffect(() => {
    fetchOfertas();
  }, []);

  const fetchOfertas = async () => {
    try {
      const data = await ofertasService.minhasOfertas();
      setOfertas(Array.isArray(data) ? data : (data?.data || []));
    } catch (error) {
      console.error('Erro ao buscar ofertas:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalOfertas = ofertas.length;
  const coletasConcluidas = ofertas.filter(o => o.status?.toLowerCase() === 'concluido').length;
  const kgReutilizados = ofertas.filter(o => o.status?.toLowerCase() === 'concluido').reduce((acc, curr) => acc + (Number(curr.quantidade_kg) || 0), 0);
  const displayUserName = user?.razao_social || user?.nome || user?.name || 'Fábrica';

  // Get current page items
  const displayedOfertas = ofertas.slice(first, first + rows);

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white p-8 pb-20 rounded-2xl relative shadow-lg">
         <p className="text-lg opacity-90 mb-2">Bem-vindo(a) de volta,</p>
         <h1 className="text-3xl md:text-4xl font-bold mb-4">{displayUserName}</h1>
         <p className="text-xl opacity-90">O que você quer fazer hoje?</p>
      </section>

      {/* Quick Actions */}
      <section className="-mt-16 px-4 md:px-8 relative z-10">
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Action 1 */}
            <div 
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:-translate-y-1 hover:border-primary transition-all duration-200 group flex flex-col items-start cursor-pointer"
              onClick={() => navigate('/cadastrar-residuo')}
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors mb-4">
                <i className="pi pi-plus text-xl"></i>
              </div>
              <span className="font-semibold text-gray-800 dark:text-gray-100">Cadastrar Resíduos</span>
            </div>
            
            {/* Action 2 */}
            <div 
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:-translate-y-1 hover:border-secondary transition-all duration-200 group flex flex-col items-start cursor-pointer"
              onClick={() => navigate('/meus-residuos')}
            >
              <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors mb-4">
                <i className="pi pi-list text-xl"></i>
              </div>
              <span className="font-semibold text-gray-800 dark:text-gray-100">Resíduos Disponíveis</span>
            </div>

            {/* Action 3 */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:-translate-y-1 hover:border-detail transition-all duration-200 group flex flex-col items-start cursor-pointer"
              onClick={() => navigate('/agendamentos')}
            >
              <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-detail group-hover:bg-detail group-hover:text-white transition-colors mb-4">
                <i className="pi pi-calendar text-xl"></i>
              </div>
              <span className="font-semibold text-gray-800 dark:text-gray-100">Agendamentos de Coletas</span>
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
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Resíduos Publicados</p>
                  <p className="text-3xl font-bold text-primary">{totalOfertas}</p>
               </div>
               <i className="pi pi-box text-primary text-4xl opacity-20"></i>
            </div>

            {/* Metric 2 */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 border-l-4 border-l-secondary p-6 shadow-sm flex items-center justify-between">
               <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Coletas Concluídas</p>
                  <p className="text-3xl font-bold text-secondary">{coletasConcluidas}</p>
               </div>
               <i className="pi pi-truck text-secondary text-4xl opacity-20"></i>
            </div>

            {/* Metric 3 */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 border-l-4 border-l-secondary p-6 shadow-sm flex items-center justify-between">
               <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Kg Reutilizados</p>
                  <p className="text-3xl font-bold text-secondary">{kgReutilizados}</p>
               </div>
               <i className="pi pi-sync text-secondary text-4xl opacity-20"></i>
            </div>
         </div>

         {/* Activities Column - Card List */}
         <div className="lg:col-span-2 flex flex-col h-full">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm flex-grow">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Últimas Atividades</h2>
              </div>
              
              {loading ? (
                <div className="text-center py-8 text-gray-500">Carregando...</div>
              ) : ofertas.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Nenhuma oferta encontrada.</div>
              ) : (
                <>
                  <div className="flex flex-col gap-4">
                    {displayedOfertas.map((oferta) => (
                      <OfertaCard key={oferta.id} oferta={oferta} />
                    ))}
                  </div>
                  
                  {ofertas.length > rows && (
                    <div className="mt-6 border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-center">
                      <Paginator 
                        first={first} 
                        rows={rows} 
                        totalRecords={totalOfertas} 
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
