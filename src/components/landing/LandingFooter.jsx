import React from 'react';

export const LandingFooter = () => {
  return (
    <>
      <section id="contato" className="relative py-20 px-6 overflow-hidden bg-primary dark:bg-primary/90 text-white transition-colors duration-300">
        <div className="absolute inset-0 z-0 opacity-10">
          <img alt="Background Pattern" className="w-full h-full object-cover" src="/imagens/bg-ceramica.webp" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto text-center animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
          <h2 className="text-3xl font-bold mb-10">Contato</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-10">
            <div className="flex items-center gap-3">
              <i className="pi pi-envelope text-3xl text-blue-300"></i>
              <span className="text-lg">contato@ecoceramicapf.com.br</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="w-full py-8 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-950 text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="text-sm text-center md:text-left font-medium">
          © 2026 EcoCerâmica PF. Fundada por alunos da FATEC de DSM de Porto Ferreira.
        </div>
        <div className="flex items-center">
          <a className="hover:text-primary dark:hover:text-primary/80 hover:underline transition-all text-sm font-medium" href="#">Privacidade</a>
        </div>
      </footer>
    </>
  );
};
