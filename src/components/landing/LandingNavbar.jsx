import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const LandingNavbar = ({ scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleScroll = (e, id) => {
    scrollToSection(e, id);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="flex justify-between items-center px-6 md:px-12 py-4">
        <div className="flex items-center gap-2">
          <img alt="EcoCerâmica PF" className="h-10 w-auto cursor-pointer" onClick={(e) => handleScroll(e, '#')} src="/logo-color.svg" />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a className="text-primary font-bold border-b-2 border-primary pb-1 text-base cursor-pointer" onClick={(e) => handleScroll(e, '#')}>Início</a>
          <a className="text-gray-600 hover:text-primary transition-colors text-base cursor-pointer" onClick={(e) => handleScroll(e, '#beneficios')}>Benefícios</a>
          <a className="text-gray-600 hover:text-primary transition-colors text-base cursor-pointer" onClick={(e) => handleScroll(e, '#como-funciona')}>Como Funciona</a>
          <a className="text-gray-600 hover:text-primary transition-colors text-base cursor-pointer" onClick={(e) => handleScroll(e, '#contato')}>Contato</a>
        </div>

        <div className="hidden md:flex gap-4">
          <Link to="/login" className="bg-white text-primary border-2 border-primary px-6 py-2 rounded-lg font-bold hover:bg-primary/5 transition-colors">
            Entrar
          </Link>
          <Link to="/register" className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-sm">
            Cadastrar
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600 hover:text-primary focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i className={`pi ${isMenuOpen ? 'pi-times' : 'pi-bars'} text-2xl`}></i>
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg py-4 px-6 flex flex-col gap-4 animate-fade-in">
          <a className="text-primary font-bold text-lg cursor-pointer" onClick={(e) => handleScroll(e, '#')}>Início</a>
          <a className="text-gray-600 font-medium text-lg cursor-pointer" onClick={(e) => handleScroll(e, '#beneficios')}>Benefícios</a>
          <a className="text-gray-600 font-medium text-lg cursor-pointer" onClick={(e) => handleScroll(e, '#como-funciona')}>Como Funciona</a>
          <a className="text-gray-600 font-medium text-lg cursor-pointer" onClick={(e) => handleScroll(e, '#contato')}>Contato</a>
          <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-100">
            <Link to="/login" className="w-full text-center bg-white text-primary border-2 border-primary px-6 py-3 rounded-lg font-bold hover:bg-primary/5 transition-colors">
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
