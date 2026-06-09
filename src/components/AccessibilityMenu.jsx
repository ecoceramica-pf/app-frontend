import { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Slider } from 'primereact/slider';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { Accessibility, RefreshCw } from 'lucide-react';

/**
 * AccessibilityMenu — Menu flutuante de acessibilidade
 * Substitui o antigo DarkModeToggle adicionando mais recursos.
 */
export function AccessibilityMenu() {
  const [visible, setVisible] = useState(false);
  const menuRef = useRef(null);

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('accessibility_settings');
    if (saved) {
      return JSON.parse(saved);
    }
    // Caso não exista, migra o tema antigo ou pega a preferência do sistema
    const oldTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = oldTheme === 'dark' || (!oldTheme && prefersDark) ? 'dark' : 'light';
    
    return {
      theme: initialTheme,
      fontSize: 16,
      highContrast: false,
      daltonism: 'none'
    };
  });

  // Aplica as configurações ao DOM sempre que mudam
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('theme-transition');

    // 1. Tema Escuro
    if (settings.theme === 'dark') {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    // 2. Tamanho da Fonte (usando rem no Tailwind, alterar no html afeta tudo)
    html.style.fontSize = `${settings.fontSize}px`;

    // 3. Alto Contraste & Daltonismo via CSS filters
    let filterString = '';
    
    if (settings.highContrast) {
      html.classList.add('high-contrast');
      filterString += settings.theme === 'dark' ? 'contrast(150%) saturate(150%) ' : 'contrast(125%) saturate(150%) ';
    } else {
      html.classList.remove('high-contrast');
    }

    if (settings.daltonism !== 'none') {
      filterString += `url('#${settings.daltonism}') `;
    }

    html.style.filter = filterString.trim();

    // Persiste as configurações gerais
    localStorage.setItem('accessibility_settings', JSON.stringify(settings));

    setTimeout(() => html.classList.remove('theme-transition'), 500);
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Fechar o menu ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setVisible(false);
      }
    };
    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [visible]);

  const daltonismOptions = [
    { label: 'Nenhum', value: 'none' },
    { label: 'Protanopia (vermelho/verde)', value: 'protanopia' },
    { label: 'Deuteranopia (verde/vermelho)', value: 'deuteranopia' },
    { label: 'Tritanopia (azul/amarelo)', value: 'tritanopia' },
  ];

  return (
    <>
      <div className="fixed bottom-5 left-5 z-[9999]" ref={menuRef}>
        
        {/* Menu Pop-up */}
        {visible && (
          <div className="absolute bottom-[calc(100%+12px)] left-0 w-[320px] bg-white dark:bg-gray-900 shadow-2xl rounded-xl border border-gray-200 dark:border-gray-700 p-3 origin-bottom-left transition-all animate-fade-in">
            <div className="flex flex-col gap-5 text-gray-800 dark:text-gray-100">
              
              {/* Header do Menu */}
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Accessibility size={20} />
                  Acessibilidade
                </h3>
                <button 
                  onClick={() => setVisible(false)}
                  className="text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                  <i className="pi pi-times"></i>
                </button>
              </div>

              {/* Tema */}
              <div className="flex items-center justify-between px-1">
                <span className="font-medium flex items-center gap-2">
                  <i className="pi pi-moon"></i>
                  Modo Escuro
                </span>
                <InputSwitch 
                  checked={settings.theme === 'dark'} 
                  onChange={(e) => updateSetting('theme', e.value ? 'dark' : 'light')} 
                />
              </div>

              {/* Alto Contraste */}
              <div className="flex items-center justify-between px-1">
                <span className="font-medium flex items-center gap-2">
                  <i className="pi pi-eye"></i>
                  Alto Contraste
                </span>
                <InputSwitch 
                  checked={settings.highContrast} 
                  onChange={(e) => updateSetting('highContrast', e.value)} 
                />
              </div>

              {/* Tamanho da Fonte */}
              <div className="flex flex-col gap-3 px-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium flex items-center gap-2">
                    <i className="pi pi-search-plus"></i>
                    Tamanho da Fonte
                  </span>
                  <span className="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                    {settings.fontSize}px
                  </span>
                </div>
                <Slider 
                  value={settings.fontSize} 
                  onChange={(e) => updateSetting('fontSize', e.value)} 
                  min={12} 
                  max={24} 
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>A</span>
                  <span className="text-lg">A</span>
                </div>
              </div>

              {/* Daltonismo */}
              <div className="flex flex-col gap-2 px-1">
                <span className="font-medium flex items-center gap-2">
                  <i className="pi pi-palette"></i>
                  Filtro de Cores
                </span>
                <Dropdown 
                  value={settings.daltonism} 
                  onChange={(e) => updateSetting('daltonism', e.value)} 
                  options={daltonismOptions} 
                  className="w-full"
                  placeholder="Selecione um filtro"
                />
              </div>
              
              {/* Botão de Reset */}
              <div className="mt-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                <Button 
                  text 
                  className="w-full flex items-center justify-center gap-2 !text-gray-500 hover:!bg-gray-100 dark:hover:!bg-gray-800 py-2 rounded-md transition-colors"
                  onClick={() => {
                    setSettings({
                      theme: 'light',
                      fontSize: 16,
                      highContrast: false,
                      daltonism: 'none'
                    });
                  }} 
                >
                  <RefreshCw size={16} />
                  <span className="font-semibold text-sm">Restaurar Padrões</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Botão Flutuante */}
        <Button
          rounded
          aria-label="Menu de Acessibilidade"
          tooltip="Acessibilidade"
          tooltipOptions={{ position: 'right' }}
          onClick={() => setVisible(!visible)}
          className="
            !w-14 !h-14 
            flex items-center justify-center
            !bg-primary dark:!bg-primary/90
            !text-white
            !border-none
            !shadow-lg hover:!shadow-xl
            hover:!scale-110 active:!scale-95
            !transition-all !duration-300
          "
        >
          <Accessibility size={28} />
        </Button>
      </div>

      {/* SVG Filters for Color Blindness */}
      <svg className="hidden h-0 w-0 absolute">
        <defs>
          <filter id="protanopia">
            <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0  0.558, 0.442, 0, 0, 0  0, 0.242, 0.758, 0, 0  0, 0, 0, 1, 0" />
          </filter>
          <filter id="deuteranopia">
            <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0  0.7, 0.3, 0, 0, 0  0, 0.3, 0.7, 0, 0  0, 0, 0, 1, 0" />
          </filter>
          <filter id="tritanopia">
            <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0  0, 0.433, 0.567, 0, 0  0, 0.475, 0.525, 0, 0  0, 0, 0, 1, 0" />
          </filter>
        </defs>
      </svg>
    </>
  );
}
