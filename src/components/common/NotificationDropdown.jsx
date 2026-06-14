import React, { useState, useEffect, useRef } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { formatarDataHora } from '../../utils/formatters';
// Substituir pelo serviço real quando criado
import api from '../../services/api';

export const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const op = useRef(null);

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/notificacoes/unread-count');
      const dataPayload = response.data?.data || {};
      setUnreadCount(dataPayload.unread_count || 0);
    } catch (error) {
      console.error('Erro ao buscar contagem de notificações', error);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await api.get('/notificacoes');
      const dataPayload = response.data?.data;
      // Trata caso a resposta seja paginada (dataPayload.data) ou lista direta
      const items = dataPayload?.data ? dataPayload.data : (Array.isArray(dataPayload) ? dataPayload : []);
      setNotifications(items);
      // Atualiza o contador após abrir
      fetchUnreadCount();
    } catch (error) {
      console.error('Erro ao buscar notificações', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notificacoes/${id}/lida`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
      fetchUnreadCount();
    } catch (error) {
      console.error('Erro ao marcar como lida', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post('/notificacoes/ler-todas');
      setNotifications(notifications.map(n => ({ ...n, read_at: new Date().toISOString() })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Erro ao marcar todas como lidas', error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    // Poderia configurar um intervalo (polling) ou WebSockets aqui
  }, []);

  const togglePanel = (e) => {
    op.current.toggle(e);
  };

  return (
    <>
      <div className="relative cursor-pointer flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={togglePanel}>
        <i className="pi pi-bell text-gray-600 dark:text-gray-300 text-xl"></i>
        {unreadCount > 0 && (
          <Badge 
            value={unreadCount} 
            severity="danger" 
            className="absolute -top-2 -right-3 text-[10px] min-w-[18px] h-[18px] leading-[18px]" 
          />
        )}
      </div>

      <OverlayPanel ref={op} className="w-80 sm:w-96 shadow-lg" onShow={fetchNotifications}>
        <div className="flex flex-col w-full">
          
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
            <h3 className="font-bold text-gray-800 dark:text-white text-lg">Notificações</h3>
            {notifications.some(n => !n.read_at) && (
              <Button label="Marcar todas como lidas" text size="small" className="text-xs p-0 text-primary" onClick={markAllAsRead} />
            )}
          </div>

          <div className="max-h-80 overflow-y-auto pr-1 custom-scrollbar">
            {loading ? (
              <div className="py-8 text-center text-gray-500">
                <i className="pi pi-spin pi-spinner text-2xl"></i>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center flex flex-col items-center">
                <i className="pi pi-bell text-4xl text-gray-300 dark:text-gray-600 mb-3"></i>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Nenhuma notificação por aqui.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {notifications.map(notif => (
                  <div 
                    key={notif.id} 
                    className={`p-3 rounded-lg border border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors flex gap-3 ${!notif.read_at ? 'bg-primary/5 border-primary/10 dark:bg-primary/10' : ''}`}
                    onClick={() => !notif.read_at && markAsRead(notif.id)}
                  >
                    <div className="mt-1">
                      <div className={`w-2 h-2 rounded-full ${!notif.read_at ? 'bg-primary' : 'bg-transparent'}`}></div>
                    </div>
                    <div className="flex-1 cursor-pointer">
                      <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{notif.data?.titulo || 'Aviso'}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                        {notif.data?.mensagem || 'Você tem uma nova atualização.'}
                      </p>
                      <span className="text-[10px] text-gray-400 block mt-2">
                        {formatarDataHora(notif.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </OverlayPanel>
    </>
  );
};
