import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Menu } from 'primereact/menu';

export const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path) => {
    navigate(path);
    if (setIsOpen) setIsOpen(false);
  };

  const getMenuItems = () => {
    const items = [
      {
        label: 'Geral',
        items: [
          {
            label: 'Painel',
            icon: 'pi pi-home',
            command: () => handleNav('/dashboard'),
            className: location.pathname === '/dashboard' ? 'bg-primary/10 text-primary font-bold border-r-4 border-primary' : ''
          },
          ...(user?.tipo_perfil === 'fabrica' ? [{
            label: 'Agendamentos',
            icon: 'pi pi-calendar',
            command: () => handleNav('/agendamentos'),
            className: location.pathname === '/agendamentos' ? 'bg-primary/10 text-primary font-bold border-r-4 border-primary' : ''
          }] : []),
          {
            label: 'Histórico',
            icon: 'pi pi-history',
            command: () => handleNav('/historico'),
            className: location.pathname === '/historico' ? 'bg-primary/10 text-primary font-bold border-r-4 border-primary' : ''
          },
          {
            label: 'Meu Impacto',
            icon: 'pi pi-chart-line',
            command: () => handleNav('/meu-impacto'),
            className: location.pathname === '/meu-impacto' ? 'bg-primary/10 text-primary font-bold border-r-4 border-primary' : ''
          }
        ]
      },
      {
        label: 'Mural',
        items: user?.tipo_perfil === 'fabrica' ? [
          {
            label: 'Meus Resíduos',
            icon: 'pi pi-list',
            command: () => handleNav('/meus-residuos'),
            className: location.pathname === '/meus-residuos' ? 'bg-primary/10 text-primary font-bold border-r-4 border-primary' : ''
          },
          {
            label: 'Cadastrar Resíduos',
            icon: 'pi pi-plus',
            command: () => handleNav('/cadastrar-residuo'),
            className: location.pathname === '/cadastrar-residuo' ? 'bg-primary/10 text-primary font-bold border-r-4 border-primary' : ''
          },
          {
            label: 'Configurar Disponibilidade',
            icon: 'pi pi-calendar-times',
            command: () => handleNav('/disponibilidade'),
            className: location.pathname === '/disponibilidade' ? 'bg-primary/10 text-primary font-bold border-r-4 border-primary' : ''
          }
        ] : [
          {
            label: 'Resíduos Disponíveis',
            icon: 'pi pi-list',
            command: () => handleNav('/mural'),
            className: location.pathname === '/mural' ? 'bg-primary/10 text-primary font-bold border-r-4 border-primary' : ''
          },
          {
            label: 'Minhas Coletas',
            icon: 'pi pi-truck',
            command: () => handleNav('/minhas-coletas'),
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
            command: () => handleNav('/materiais'),
            className: location.pathname === '/materiais' ? 'bg-primary/10 text-primary font-bold border-r-4 border-primary' : ''
          }
        ]
      });
    }

    return items;
  };

  return (
    <aside className={`w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen fixed left-0 top-0 shadow-sm z-30 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-black text-primary dark:text-white tracking-tight flex items-center gap-2">
          <i className="pi pi-leaf text-2xl"></i>
          EcoCerâmica PF
        </h1>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3 custom-sidebar-menu">
        <Menu 
          model={getMenuItems()} 
          className="w-full border-none bg-transparent focus:outline-none"
          tabIndex={-1}
          pt={{
            root: { className: 'focus:outline-none' },
            menu: { className: 'focus:outline-none' },
            menuitem: { className: 'rounded-lg mb-1 overflow-hidden focus:outline-none' },
            content: { className: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:bg-transparent focus:outline-none' },
            action: { className: 'p-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:bg-transparent' },
            icon: { className: 'text-gray-500 dark:text-gray-400 mr-3' },
            label: { className: 'font-medium' },
            submenuHeader: { className: 'bg-transparent text-xs font-bold uppercase tracking-wider text-gray-400 mt-4 mb-2 focus:outline-none' }
          }}
        />
      </div>
    </aside>
  );
};
