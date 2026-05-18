import { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { InputSwitch } from 'primereact/inputswitch';
import { Rating } from 'primereact/rating';
import { Slider } from 'primereact/slider';
import { DarkModeToggle } from './components/DarkModeToggle';

function App() {
  // Hooks para guardar os estados dos componentes
  const [date, setDate] = useState(null);
  const [text, setText] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [checked, setChecked] = useState(false);
  const [ratingValue, setRatingValue] = useState(3);
  const [sliderValue, setSliderValue] = useState(50);

  // Referência para o utilitário de exibir notificações (Toast)
  const toast = useRef(null);

  // Lista de mock para o Dropdown
  const cities = [
      { name: 'São Paulo', code: 'SP' },
      { name: 'Rio de Janeiro', code: 'RJ' },
      { name: 'Belo Horizonte', code: 'BH' },
      { name: 'Curitiba', code: 'CT' },
  ];

  // Dispara o popup de notificação (Toast)
  const showSuccess = () => {
      toast.current.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Ação conectada com Tailwind executada!',
        life: 3000
      });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-6 md:p-8 flex flex-col items-center font-sans text-slate-800 dark:text-gray-100 transition-colors duration-300">
      {/* O componente Toast precisa estar na árvore do DOM para poder flutuar na tela */}
      <Toast ref={toast} />

      {/* Toggle de tema flutuante */}
      <DarkModeToggle />

      <div className="max-w-6xl w-full">
        {/* Cabeçalho */}
        <header className="mb-12 mt-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight transition-colors">
            EcoCerâmica UI Sandbox
          </h1>
          <p className="text-lg text-slate-500 dark:text-gray-400 font-medium max-w-2xl mx-auto transition-colors">
            Integração limpa entre as funcionalidades complexas do PrimeReact e o Tailwind CSS v4 — agora com Dark Mode elegante.
          </p>
        </header>

        {/* Grid Principal de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* 1. Card: Botões */}
          <Card
            title="Ações Básicas"
            subTitle="Diferentes pesos visuais de botões"
            className="shadow-lg dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700/50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full bg-white dark:bg-gray-800/80"
          >
            <div className="flex flex-wrap gap-3">
              <Button label="Primário" onClick={showSuccess} />
              <Button label="Secundário" severity="secondary" outlined />
              <Button label="Perigo" severity="danger" />
              <Button label="Alerta" severity="warning" text />
            </div>
          </Card>

          {/* 2. Card: Formulários */}
          <Card
            title="Campos de Texto"
            subTitle="Inputs e caixas de seleção fluidas"
            className="shadow-lg dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700/50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full bg-white dark:bg-gray-800/80"
          >
            <div className="flex flex-col gap-4">
              <InputText
                placeholder="Digite algo bacana..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full"
              />

              <Dropdown
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.value)}
                options={cities}
                optionLabel="name"
                placeholder="Escolha uma cidade"
                className="w-full"
              />
            </div>
          </Card>

          {/* 3. Card: Datas e Interações */}
          <Card
            title="Seletores Interativos"
            subTitle="Coletores de data e chaves lógicas"
            className="shadow-lg dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700/50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full bg-white dark:bg-gray-800/80"
          >
            <div className="flex flex-col gap-5">
              <Calendar
                value={date}
                onChange={(e) => setDate(e.value)}
                placeholder="Selecione uma data"
                className="w-full"
                dateFormat="dd/mm/yy"
              />

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-gray-700/40 border border-slate-200/50 dark:border-gray-600/30 transition-colors">
                 <InputSwitch checked={checked} onChange={(e) => setChecked(e.value)} />
                 <span className="text-sm font-medium text-slate-700 dark:text-gray-300">
                   {checked ? '🌿 Modo Sustentável (ON)' : '⚙️ Padrão Verde (OFF)'}
                 </span>
              </div>
            </div>
          </Card>

          {/* 4. Card: Sliders e Avaliações (Ocupa 3 colunas em telas grandes) */}
          <Card
            title="Gama de Valores e Avaliação"
            subTitle="Componentes para coletar feedbacks em tempo real"
            className="shadow-lg dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700/50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 lg:col-span-3 bg-white dark:bg-gray-800/80"
          >
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="flex flex-col gap-3">
                 <p className="text-sm font-semibold text-slate-700 dark:text-gray-300">Pesquisa de Qualidade dos Produtos</p>
                 <Rating value={ratingValue} onChange={(e) => setRatingValue(e.value)} cancel={false} />
               </div>

               <div className="flex flex-col gap-3 pr-2">
                 <div className="flex justify-between items-center mb-1">
                   <p className="text-sm font-semibold text-slate-700 dark:text-gray-300">Nível de Porosidade da Cerâmica</p>
                   <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/40 rounded-full border border-emerald-200/60 dark:border-emerald-700/40">
                     {sliderValue}%
                   </span>
                 </div>
                 <Slider value={sliderValue} onChange={(e) => setSliderValue(e.value)} className="w-full" />
               </div>
             </div>
          </Card>

        </div>

        {/* Footer */}
        <footer className="mt-16 mb-8 text-center">
          <p className="text-xs text-slate-400 dark:text-gray-500 font-medium">
            EcoCerâmica &middot; PrimeReact Unstyled + Tailwind CSS v4 &middot; Dark Mode
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
