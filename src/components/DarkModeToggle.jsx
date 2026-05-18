import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';

/**
 * DarkModeToggle — Botão elegante para alternar dark/light mode.
 *
 * Funcionalidades:
 *   • Persiste a preferência no localStorage
 *   • Detecta prefers-color-scheme no primeiro acesso
 *   • Transição animada suave ao trocar de tema
 *   • Usa o Button do PrimeReact com ícones PrimeIcons
 */
export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Inicializa a partir do localStorage ou preferência do sistema
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (saved === 'dark' || (!saved && prefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;

    // Ativa transição suave temporária
    html.classList.add('theme-transition');

    if (isDark) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }

    // Remove a classe de transição após a animação
    setTimeout(() => html.classList.remove('theme-transition'), 500);
  };

  return (
    <div className="fixed top-5 right-5 z-50">
      <Button
        icon={isDark ? 'pi pi-sun' : 'pi pi-moon'}
        rounded
        text
        severity="secondary"
        aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
        tooltip={isDark ? 'Modo Claro' : 'Modo Escuro'}
        tooltipOptions={{ position: 'left' }}
        onClick={toggleDarkMode}
        className="
          !w-12 !h-12 !text-lg
          !bg-white/80 dark:!bg-gray-800/80
          !backdrop-blur-xl
          !border !border-gray-200/60 dark:!border-gray-600/50
          !shadow-lg hover:!shadow-xl
          hover:!scale-110 active:!scale-95
          !transition-all !duration-300
          dark:!text-gray-100
        "
      />
    </div>
  );
}