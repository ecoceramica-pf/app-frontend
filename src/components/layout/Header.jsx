import React, { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';

export const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const menu = useRef(null);
  const navigate = useNavigate();

  const items = [
    {
      label: 'Opções',
      items: [
        {
          label: 'Meu Perfil',
          icon: 'pi pi-user',
          command: () => navigate('/perfil')
        },
        {
          label: 'Sair',
          icon: 'pi pi-sign-out',
          command: () => logout()
        }
      ]
    }
  ];

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Espaço para um título de página dinâmico no futuro, se necessário */}
      </div>

      <div className="flex items-center gap-4">
        
        <div 
          className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
          onClick={(e) => menu.current.toggle(e)}
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-800 dark:text-white leading-tight">
              {user?.nome || 'Usuário'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {user?.tipo_perfil || 'Perfil'}
            </p>
          </div>
          <Avatar 
            label={user?.nome ? user.nome.charAt(0).toUpperCase() : 'U'} 
            shape="circle" 
            className="bg-primary text-white font-bold"
          />
        </div>
        <Menu 
          model={items} 
          popup 
          ref={menu} 
          id="popup_menu" 
          pt={{
            action: { className: 'text-gray-700 dark:text-white/80 transition-shadow duration-200 rounded-none hover:text-gray-700 dark:hover:text-white/80 hover:bg-gray-200 dark:hover:bg-gray-800/80' },
            content: { className: 'bg-transparent' }
          }}
        />
      </div>
    </header>
  );
};
