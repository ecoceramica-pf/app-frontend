import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Menu } from 'primereact/menu';

export const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const getMenuItems = () => {
    const items = [
      {
        label: 'Geral',
        items: [
          {
            label: 'Painel',
            icon: 'pi pi-home',
            command: () => navigate('/dashboard'),
            className: location.pathname === '/dashboard' ? 'bg-primary/10 text-primary font-bold border-r-4 border-primary' : ''
          }
        ]
      },
      {
        label: 'Mural',
        items: user?.tipo_perfil === 'fabrica' ? [
          {
            label: 'Meus Resíduos',
            icon: 'pi pi-list',
            command: () => navigate('/meus-residuos'),
            className: location.pathname === '/meus-residuos' ? 'bg-primary/10 text-primary font-bold border-r-4 border-primary' : ''
          },
          {
            label: 'Cadastrar Resíduos',
            icon: 'pi pi-plus',
            command: () => navigate('/cadastrar-residuo'),
            className: location.pathname === '/cadastrar-residuo' ? 'bg-primary/10 text-primary font-bold border-r-4 border-primary' : ''
          },
          {
            label: 'Configurar Disponibilidade',
            icon: 'pi pi-calendar-times',
            command: () => navigate('/disponibilidade'),
            className: location.pathname === '/disponibilidade' ? 'bg-primary/10 text-primary font-bold border-r-4 border-primary' : ''
          }
        ] : [
          {
            label: 'Resíduos Disponíveis',
            icon: 'pi pi-list',
            command: () => navigate('/mural'),
            className: location.pathname === '/mural' ? 'bg-primary/10 text-primary font-bold border-r-4 border-primary' : ''
          },
          {
            label: 'Minhas Coletas',
            icon: 'pi pi-truck',
            command: () => navigate('/minhas-coletas'),
            className: location.pathname === '/minhas-coletas' ? 'bg-primary/10 text-primary font-bold border-r-4 border-primary' : ''
          }
        ]
      }
    ];

    if (user?.tipo_perfil === 'admin') {
      items.push({
        label: 'Administração',
        items: [
          {
            label: 'Materiais',
            icon: 'pi pi-box',
            command: () => navigate('/materiais'),
            className: location.pathname === '/materiais' ? 'bg-primary/10 text-primary font-bold border-r-4 border-primary' : ''
          }
        ]
      });
    }

    return items;
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 hidden md:flex flex-col h-screen fixed left-0 top-0 shadow-sm z-20">
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-black text-primary dark:text-white tracking-tight flex items-center gap-2">
          <i className="pi pi-leaf text-2xl"></i>
          Ecocerâmica
        </h1>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3 custom-sidebar-menu">
        <Menu 
          model={getMenuItems()} 
          className="w-full border-none bg-transparent"
          pt={{
            menuitem: { className: 'rounded-lg mb-1 overflow-hidden' },
            content: { className: 'hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors' },
            action: { className: 'p-3 text-gray-700 dark:text-gray-300' },
            icon: { className: 'text-gray-500 dark:text-gray-400 mr-3' },
            label: { className: 'font-medium' },
            submenuHeader: { className: 'bg-transparent text-xs font-bold uppercase tracking-wider text-gray-400 mt-4 mb-2' }
          }}
        />
      </div>
    </aside>
  );
};
