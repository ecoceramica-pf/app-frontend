import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { InputMask } from 'primereact/inputmask';
import { authService } from '../services/authService';

export const Register = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
    tipo_perfil: { name: 'Coletor/Artesão', code: 'coletor' },
    documento: '',
    telefone: ''
  });
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const toast = useRef(null);

  const perfis = [
    { name: 'Coletor/Artesão', code: 'coletor' },
    { name: 'Fábrica/Gerador', code: 'fabrica' }
  ];

  const unmask = (val) => val ? val.replace(/\D/g, '') : '';

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email || !formData.password || !formData.confirmPassword || !formData.tipo_perfil || !formData.documento || !formData.telefone) {
      toast.current.show({ severity: 'warn', summary: 'Aviso', detail: 'Preencha todos os campos obrigatórios.' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.current.show({ severity: 'warn', summary: 'Aviso', detail: 'As senhas não coincidem.' });
      return;
    }

    try {
      setLoading(true);
      const payload = {
        nome: formData.nome,
        email: formData.email,
        password: formData.password,
        tipo_perfil: formData.tipo_perfil.code,
        documento: unmask(formData.documento),
        telefone: unmask(formData.telefone)
      };

      await authService.register(payload);
      
      toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Conta criada! Redirecionando para o login...', life: 2000 });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error(error);
      const detail = error.response?.status === 422 ? 'Verifique os dados informados (Email ou Documento já em uso).' : 'Falha ao conectar ao servidor';
      toast.current.show({ severity: 'error', summary: 'Erro no Cadastro', detail });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-surface via-white to-primary/10 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4 md:p-8 transition-colors duration-300 font-sans">
      <Toast ref={toast} />
      
      <Card className="w-full max-w-2xl shadow-2xl rounded-[var(--radius-card)] border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-primary dark:text-primary/90 mb-2">Crie sua Conta</h1>
          <p className="text-slate-500 dark:text-gray-400">Junte-se ao ciclo de reaproveitamento</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="relative flex w-full bg-gray-100 dark:bg-gray-800 p-1 rounded-full shadow-inner mt-4">
              {perfis.map((perfil) => (
                <button
                  key={perfil.code}
                  type="button"
                  onClick={() => handleChange('tipo_perfil', perfil)}
                  className={`flex-1 z-10 py-3 rounded-full text-center font-bold text-sm sm:text-base transition-colors duration-300 ${
                    formData.tipo_perfil?.code === perfil.code
                      ? 'text-white'
                      : 'text-slate-600 hover:text-slate-800 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  {perfil.name}
                </button>
              ))}
              
              <div 
                className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#1e3a8a] rounded-full shadow-md transition-all duration-300 ease-in-out"
                style={{ 
                  left: formData.tipo_perfil?.code === 'fabrica' ? 'calc(50% + 2px)' : '4px' 
                }}
              ></div>
            </div>
          </div>

          {formData.tipo_perfil && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 transition-all duration-500 ease-in-out opacity-100 mt-2">
              <div className="flex flex-col gap-2 md:col-span-2">
                <label htmlFor="nome" className="text-sm font-semibold text-text-main dark:text-gray-300">
                  {formData.tipo_perfil.code === 'fabrica' ? 'Nome da Empresa / Cerâmica' : 'Seu Nome Completo'}
                </label>
                <InputText 
                  id="nome" 
                  value={formData.nome} 
                  onChange={(e) => handleChange('nome', e.target.value)} 
                  placeholder={formData.tipo_perfil.code === 'fabrica' ? 'Ex: Cerâmica São João Ltda' : 'Ex: João da Silva'}
                  className="w-full"
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label htmlFor="email" className="text-sm font-semibold text-text-main dark:text-gray-300">Email</label>
                <InputText 
                  id="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => handleChange('email', e.target.value)} 
                  placeholder="exemplo@email.com"
                  className="w-full"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="documento" className="text-sm font-semibold text-text-main dark:text-gray-300">
                  {formData.tipo_perfil.code === 'fabrica' ? 'CNPJ' : 'CPF'}
                </label>
                <InputMask 
                  id="documento" 
                  value={formData.documento} 
                  onChange={(e) => handleChange('documento', e.target.value)} 
                  mask={formData.tipo_perfil.code === 'fabrica' ? "99.999.999/9999-99" : "999.999.999-99"} 
                  placeholder={formData.tipo_perfil.code === 'fabrica' ? "00.000.000/0000-00" : "000.000.000-00"}
                  className="w-full"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="telefone" className="text-sm font-semibold text-text-main dark:text-gray-300">Telefone / WhatsApp</label>
                <InputMask 
                  id="telefone" 
                  value={formData.telefone} 
                  onChange={(e) => handleChange('telefone', e.target.value)} 
                  mask="(99) 99999-9999" 
                  placeholder="(11) 90000-0000"
                  className="w-full"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-semibold text-text-main dark:text-gray-300">Senha</label>
                <Password 
                  id="password" 
                  value={formData.password} 
                  onChange={(e) => handleChange('password', e.target.value)} 
                  promptLabel="Escolha uma senha"
                  weakLabel="Fraca"
                  mediumLabel="Média"
                  strongLabel="Forte"
                  toggleMask
                  pt={{
                    root: { className: 'w-full' },
                    input: { root: { className: 'w-full' } }
                  }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="confirmPassword" className="text-sm font-semibold text-text-main dark:text-gray-300">Confirme a Senha</label>
                <Password 
                  id="confirmPassword" 
                  value={formData.confirmPassword} 
                  onChange={(e) => handleChange('confirmPassword', e.target.value)} 
                  feedback={false}
                  toggleMask
                  placeholder="Repita a senha"
                  pt={{
                    root: { className: 'w-full' },
                    input: { root: { className: 'w-full' } }
                  }}
                />
              </div>

              <div className="md:col-span-2 mt-4">
                <Button 
                  label="Cadastrar Conta" 
                  icon="pi pi-user-plus" 
                  loading={loading} 
                  className="w-full !bg-primary hover:!bg-primary/90 !border-none !text-white py-3 rounded-[var(--radius-card)] font-bold transition-all"
                  type="submit"
                />
              </div>
            </div>
          )}
        </form>

        <div className="mt-6 text-center text-sm text-slate-600 dark:text-gray-400">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-bold text-primary dark:text-primary/90 hover:underline">
            Faça login aqui
          </Link>
        </div>
      </Card>
    </div>
  );
};
