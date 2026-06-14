import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ofertasService } from '../services/ofertasService';
import { coletasService } from '../services/coletasService';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { formatarDataHora } from '../utils/formatters';

export const Historico = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 uppercase font-semibold text-xs border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4">Material</th>
                  <th className="px-6 py-4">Quantidade</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {items.map((item) => {
                  const data = item.data_reserva || item.data_agendamento || item.data_publicacao || item.created_at;
                  const material = user?.tipo_perfil === 'fabrica' ? item.material?.nome : item.oferta_residuo?.material?.nome;
                  const qtdKg = user?.tipo_perfil === 'fabrica' ? item.quantidade_kg : item.oferta_residuo?.quantidade_kg;
                  const qtdCacamba = user?.tipo_perfil === 'fabrica' ? item.quantidade_cacamba : item.oferta_residuo?.quantidade_cacamba;
                  const quantidadeFinal = [
                    qtdKg ? `${qtdKg} kg` : null,
                    qtdCacamba ? `${qtdCacamba} caçamba(s)` : null
                  ].filter(Boolean).join(' + ') || 'Não especificada';

                  return (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">{formatarDataHora(data)}</td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{material || '-'}</td>
                      <td className="px-6 py-4">{quantidadeFinal}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${getStatusClass(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          icon="pi pi-eye" 
                          rounded 
                          text 
                          aria-label="Ver" 
                          onClick={() => {
                            if (user?.tipo_perfil === 'fabrica') {
                              navigate(`/meus-residuos/${item.id}/gerenciar`);
                            } else {
                              // Se coletor, pode ir ver no mural ou se tivermos gerenciar
                              navigate('/minhas-coletas');
                            }
                          }}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
