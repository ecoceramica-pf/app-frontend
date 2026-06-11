import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const LandingNavbar = ({ scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleScroll = (e, id) => {
    scrollToSection(e, id);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">
      <div className="flex justify-between items-center px-6 md:px-12 py-4">
        <div className="flex items-center gap-2">
          <img alt="EcoCerâmica PF" className="h-10 w-auto cursor-pointer" onClick={(e) => handleScroll(e, '#')} src="/logo-color.svg" />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a className="text-primary dark:text-primary/90 font-bold border-b-2 border-primary dark:border-primary/90 pb-1 text-base cursor-pointer" onClick={(e) => handleScroll(e, '#')}>Início</a>
          <a className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary/80 transition-colors text-base cursor-pointer" onClick={(e) => handleScroll(e, '#beneficios')}>Benefícios</a>
          <a className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary/80 transition-colors text-base cursor-pointer" onClick={(e) => handleScroll(e, '#como-funciona')}>Como Funciona</a>
          <a className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary/80 transition-colors text-base cursor-pointer" onClick={(e) => handleScroll(e, '#contato')}>Contato</a>
        </div>

        <div className="hidden md:flex gap-4">
          <Link to="/login" className="bg-white dark:bg-gray-900 text-primary dark:text-blue-400 border-2 border-primary dark:border-blue-400 px-6 py-2 rounded-lg font-bold hover:bg-primary/5 dark:hover:bg-blue-400/10 transition-colors">
            Entrar
          </Link>
          <Link to="/register" className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-sm">
            Cadastrar
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600 dark:text-gray-300 hover:text-primary focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i className={`pi ${isMenuOpen ? 'pi-times' : 'pi-bars'} text-2xl`}></i>
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-lg py-4 px-6 flex flex-col gap-4 animate-fade-in transition-colors duration-300">
          <a className="text-primary dark:text-primary/90 font-bold text-lg cursor-pointer" onClick={(e) => handleScroll(e, '#')}>Início</a>
          <a className="text-gray-600 dark:text-gray-300 font-medium text-lg cursor-pointer" onClick={(e) => handleScroll(e, '#beneficios')}>Benefícios</a>
          <a className="text-gray-600 dark:text-gray-300 font-medium text-lg cursor-pointer" onClick={(e) => handleScroll(e, '#como-funciona')}>Como Funciona</a>
          <a className="text-gray-600 dark:text-gray-300 font-medium text-lg cursor-pointer" onClick={(e) => handleScroll(e, '#contato')}>Contato</a>
          <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Link to="/login" className="w-full text-center bg-white dark:bg-gray-800 text-primary dark:text-blue-400 border-2 border-primary dark:border-blue-400 px-6 py-3 rounded-lg font-bold hover:bg-primary/5 dark:hover:bg-blue-400/10 transition-colors">
              Entrar
            </Link>
            <Link to="/register" className="w-full text-center bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-sm">
              Cadastrar
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
