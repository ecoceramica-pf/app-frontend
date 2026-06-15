import React, { useEffect, useState, useContext } from 'react';
import { Chart } from 'primereact/chart';
import { dashboardService } from '../services/dashboardService';
import { AuthContext } from '../context/AuthContext';

export const MeuImpacto = () => {
  const { user } = useContext(AuthContext);
  const [impactData, setImpactData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Chart options
  const [lineOptions, setLineOptions] = useState({});
  const [pieOptions, setPieOptions] = useState({});

  useEffect(() => {
    fetchData();
    
    // Setup chart options for PrimeReact Chart (chart.js)
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color') || '#495057';
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-color-secondary') || '#6c757d';
    const surfaceBorder = documentStyle.getPropertyValue('--p-surface-border') || '#dfe7ef';

    setLineOptions({
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: { labels: { color: textColor } }
      },
      scales: {
        x: {
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder }
        },
        y: {
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder }
        }
      }
    });

    setPieOptions({
      plugins: {
        legend: { labels: { usePointStyle: true, color: textColor } }
      }
    });
  }, []);

  const fetchData = async () => {
    try {
      const data = await dashboardService.meuImpacto();
      setImpactData(data);
    } catch (error) {
      console.error('Erro ao buscar dados de impacto', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <span className="text-xl text-gray-500">Carregando estatísticas...</span>
      </div>
    );
  }

  // Format YYYY-MM to Month/Year
  const formatMonth = (lbl) => {
    if (!lbl) return '';
    const [year, month] = lbl.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).replace('.', '');
  };

  // Formatting chart data
  const lineData = {
    labels: impactData?.historico_meses?.map(m => formatMonth(m.label)) || [],
    datasets: [
      {
        label: 'Kg Reutilizado por Mês',
        data: impactData?.historico_meses?.map(m => m.kg) || [],
        fill: true,
        borderColor: '#10b981', // green-500
        tension: 0.4,
        backgroundColor: 'rgba(16, 185, 129, 0.2)'
      }
    ]
  };

  const pieData = {
    labels: impactData?.historico_materiais?.map(m => m.label) || [],
    datasets: [
      {
        data: impactData?.historico_materiais?.map(m => m.kg) || [],
        backgroundColor: [
          '#10b981', // secondary (green)
          '#3b82f6', // primary (blue)
          '#f59e0b', // detail (orange)
          '#8b5cf6', // purple
          '#ec4899', // pink
        ],
        hoverBackgroundColor: [
          '#059669',
          '#2563eb',
          '#d97706',
          '#7c3aed',
          '#db2777',
        ]
      }
    ]
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Meu Impacto Ambiental</h1>
          <p className="text-lg opacity-90 max-w-2xl">
            Acompanhe o volume de resíduos que você ajudou a reciclar e veja o impacto positivo das suas ações ao longo do tempo.
          </p>
        </div>
        <i className="pi pi-globe absolute right-4 -bottom-4 text-9xl opacity-10"></i>
      </section>

      {/* Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border-l-4 border-l-secondary p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 hover:-translate-y-1 transition-transform">
          <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-full text-secondary">
            <i className="pi pi-sync text-2xl"></i>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total de Kg</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">{impactData?.total_kg?.toLocaleString('pt-BR') || 0}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border-l-4 border-l-primary p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 hover:-translate-y-1 transition-transform">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-full text-primary">
            <i className="pi pi-box text-2xl"></i>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Caçambas</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">{impactData?.total_cacambas?.toLocaleString('pt-BR') || 0}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border-l-4 border-l-detail p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 hover:-translate-y-1 transition-transform">
          <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-full text-detail">
            <i className="pi pi-truck text-2xl"></i>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Coletas Realizadas</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">{impactData?.total_concluidas || 0}</p>
          </div>
        </div>
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Evolução Mensal (Kg)</h2>
          {impactData?.historico_meses?.length > 0 ? (
            <div className="h-80 w-full">
               <Chart type="line" data={lineData} options={lineOptions} style={{ height: '100%', width: '100%' }} />
            </div>
          ) : (
            <div className="flex h-80 items-center justify-center text-gray-400">Sem dados suficientes no momento</div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Materiais Reciclados</h2>
          {impactData?.historico_materiais?.length > 0 ? (
            <div className="flex-1 flex items-center justify-center h-80 w-full relative">
               <Chart type="doughnut" data={pieData} options={pieOptions} className="w-full md:w-3/4" />
            </div>
          ) : (
            <div className="flex h-80 items-center justify-center text-gray-400">Sem dados suficientes no momento</div>
          )}
        </div>
      </section>
    </div>
  );
};
