import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => observerRef.current.observe(el));

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (id === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.querySelector(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="bg-gray-50 text-gray-900 font-sans selection:bg-primary/20 overflow-x-hidden">
      {/* TopNavBar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="flex justify-between items-center px-6 md:px-12 py-4">
          <div className="flex items-center gap-2">
            <img alt="EcoCerâmica PF" className="h-10 w-auto cursor-pointer" onClick={(e) => scrollToSection(e, '#')} src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQiFVP6bXl-BRRtWPJumMStsM06Ld_vLcEMHkEaE-YDt6Dlqrylwov8vg1c7aOGEt7HpfAFEecKmZEOrxUc9CMzNKDVzKx_KcqFn9MkTnT6RtFFRH_mBiHXcCd7ifuloEdEOw-_vogyDsiJDBRr8-KVxL2zgIk6zplt8Njy2H3dsj2WN4N8ggmLktYQYlW9cWuoHp6VM6J1xECaCOEcYHXttMkKVZj0up1dsSB6hvO-fPb0ouU62ZHoVsE4hZ9YLzGRBkkDQm7Sg" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a className="text-primary font-bold border-b-2 border-primary pb-1 text-base cursor-pointer" onClick={(e) => scrollToSection(e, '#')}>Início</a>
            <a className="text-gray-600 hover:text-primary transition-colors text-base cursor-pointer" onClick={(e) => scrollToSection(e, '#beneficios')}>Benefícios</a>
            <a className="text-gray-600 hover:text-primary transition-colors text-base cursor-pointer" onClick={(e) => scrollToSection(e, '#como-funciona')}>Como Funciona</a>
            <a className="text-gray-600 hover:text-primary transition-colors text-base cursor-pointer" onClick={(e) => scrollToSection(e, '#contato')}>Contato</a>
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
            <a className="text-primary font-bold text-lg cursor-pointer" onClick={(e) => scrollToSection(e, '#')}>Início</a>
            <a className="text-gray-600 font-medium text-lg cursor-pointer" onClick={(e) => scrollToSection(e, '#beneficios')}>Benefícios</a>
            <a className="text-gray-600 font-medium text-lg cursor-pointer" onClick={(e) => scrollToSection(e, '#como-funciona')}>Como Funciona</a>
            <a className="text-gray-600 font-medium text-lg cursor-pointer" onClick={(e) => scrollToSection(e, '#contato')}>Contato</a>
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

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex px-6 md:px-12 py-16 overflow-hidden bg-cover bg-center items-center justify-center" style={{ backgroundImage: 'url("/imagens/bg-hero.webp")' }}>
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 max-w-5xl mx-auto w-full flex justify-center items-center pt-20">
            <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000 max-w-3xl w-full bg-white/30 backdrop-blur-xl border border-white/50 p-10 md:p-16 rounded-[2rem] flex flex-col items-center text-center shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
              <img alt="EcoCerâmica Logo" className="h-16 md:h-20 w-auto mb-6 brightness-0 drop-shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQiFVP6bXl-BRRtWPJumMStsM06Ld_vLcEMHkEaE-YDt6Dlqrylwov8vg1c7aOGEt7HpfAFEecKmZEOrxUc9CMzNKDVzKx_KcqFn9MkTnT6RtFFRH_mBiHXcCd7ifuloEdEOw-_vogyDsiJDBRr8-KVxL2zgIk6zplt8Njy2H3dsj2WN4N8ggmLktYQYlW9cWuoHp6VM6J1xECaCOEcYHXttMkKVZj0up1dsSB6hvO-fPb0ouU62ZHoVsE4hZ9YLzGRBkkDQm7Sg" />

              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-detail to-secondary drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">
                  EcoCerâmica PF
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-900 max-w-2xl font-bold tracking-wide mb-10 drop-shadow-sm">
                Transformando resíduos em oportunidades. Conectando fábricas e artesãos em Porto Ferreira.
              </p>

              <div className="pt-2 w-full flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/register" className="bg-gradient-to-r from-primary to-secondary text-white px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all shadow-lg hover:shadow-xl">
                  Começar a Impactar
                </Link>
                <a href="#beneficios" onClick={(e) => scrollToSection(e, '#beneficios')} className="px-10 py-4 bg-white/40 border border-white text-primary rounded-full font-bold text-lg hover:bg-white/60 transition-all shadow-sm">
                  Conhecer Mais
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Benefícios */}
        <section id="beneficios" className="py-20 px-6 md:px-12 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Benefícios para o Ecossistema</h2>
              <div className="h-1.5 w-24 bg-detail mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl border-l-[8px] border-detail hover:-translate-y-2 transition-all duration-300 border-y border-r border-gray-100">
                <div className="mb-6 text-5xl">🏭</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Para Fábricas</h3>
                <p className="text-gray-600 leading-relaxed">
                  Registre seus resíduos de forma fácil e ache coletores interessados em reutilizar materiais descartados.
                </p>
              </div>
              {/* Card 2 */}
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl border-l-[8px] border-secondary hover:-translate-y-2 transition-all duration-300 border-y border-r border-gray-100">
                <div className="mb-6 text-5xl">👷</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Para Coletores</h3>
                <p className="text-gray-600 leading-relaxed">
                  Encontre resíduos disponíveis próximos a você e ganhe renda ativa com a logística de reutilização.
                </p>
              </div>
              {/* Card 3 */}
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl border-l-[8px] border-primary hover:-translate-y-2 transition-all duration-300 border-y border-r border-gray-100">
                <div className="mb-6 text-5xl">🌱</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Para o Meio Ambiente</h3>
                <p className="text-gray-600 leading-relaxed">
                  Reduza drasticamente o desperdício em aterros e contribua diretamente para uma economia circular robusta.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Banner de Estatísticas */}
        <section className="bg-primary text-white py-20">
          <div className="max-w-7xl mx-auto px-6 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="space-y-3">
                <p className="text-5xl md:text-6xl font-extrabold text-blue-200">500+</p>
                <p className="text-sm md:text-base font-bold uppercase tracking-widest text-blue-100">resíduos reutilizados</p>
              </div>
              <div className="space-y-3">
                <p className="text-5xl md:text-6xl font-extrabold text-blue-200">150+</p>
                <p className="text-sm md:text-base font-bold uppercase tracking-widest text-blue-100">coletores ativos</p>
              </div>
              <div className="space-y-3">
                <p className="text-5xl md:text-6xl font-extrabold text-blue-200">80t</p>
                <p className="text-sm md:text-base font-bold uppercase tracking-widest text-blue-100">de impacto positivo</p>
              </div>
            </div>
          </div>
        </section>

        {/* Como Funciona */}
        <section id="como-funciona" className="py-20 px-6 md:px-12 bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-16">Como Funciona</h2>
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative">
              <div className="flex-1 text-center group">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors shadow-sm">
                  <i className="pi pi-file-edit text-3xl text-primary"></i>
                </div>
                <h4 className="text-xl font-bold mb-2 text-gray-900">1. Registre</h4>
                <p className="text-gray-600 px-4">Crie seu cadastro na plataforma</p>
              </div>
              <i className="hidden md:block pi pi-arrow-right text-3xl text-gray-300"></i>
              <div className="flex-1 text-center group">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors shadow-sm">
                  <i className="pi pi-upload text-3xl text-primary"></i>
                </div>
                <h4 className="text-xl font-bold mb-2 text-gray-900">2. Publique</h4>
                <p className="text-gray-600 px-4">Publique ou reserve materiais</p>
              </div>
              <i className="hidden md:block pi pi-arrow-right text-3xl text-gray-300"></i>
              <div className="flex-1 text-center group">
                <div className="w-20 h-20 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary/20 transition-colors shadow-sm">
                  <i className="pi pi-check-circle text-3xl text-secondary"></i>
                </div>
                <h4 className="text-xl font-bold mb-2 text-gray-900">3. Conclua</h4>
                <p className="text-gray-600 px-4">Finalize a entrega do resíduo</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 px-6 bg-white text-center">
          <div className="max-w-3xl mx-auto space-y-8 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
            <h2 className="text-4xl font-bold text-gray-900">Pronto para começar?</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Nascida em Porto Ferreira, a Capital da Cerâmica e Decoração, nossa plataforma conecta quem produz a quem transforma.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-4">
              <Link to="/login" className="w-full sm:w-auto px-10 py-4 rounded-lg border-2 border-primary text-primary font-bold text-lg hover:bg-primary/5 transition-colors">
                Fazer Login
              </Link>
              <Link to="/register" className="w-full sm:w-auto px-10 py-4 rounded-lg bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-opacity shadow-lg">
                Criar Conta
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <section id="contato" className="relative py-20 px-6 overflow-hidden bg-primary text-white">
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

      <footer className="w-full py-8 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 bg-white text-gray-600 border-t border-gray-200">
        <div className="text-sm text-center md:text-left font-medium">
          © 2026 EcoCerâmica PF. Fundada por alunos da FATEC de DSM de Porto Ferreira.
        </div>
        <div className="flex items-center">
          <a className="hover:text-primary hover:underline transition-all text-sm font-medium" href="#">Privacidade</a>
        </div>
      </footer>
    </div>
  );
};
