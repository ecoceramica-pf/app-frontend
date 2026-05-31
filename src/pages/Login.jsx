import React, { useState, useContext, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.current.show({ severity: 'warn', summary: 'Aviso', detail: 'Preencha todos os campos.' });
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast.current.show({ 
        severity: 'error', 
        summary: 'Erro de Autenticação', 
        detail: error.response?.status === 401 ? 'Email ou senha inválidos' : 'Falha ao conectar ao servidor'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-surface via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4 transition-colors duration-300 font-sans">
      <Toast ref={toast} />
      
      <Card 
        pt={{
          root: { className: 'w-full max-w-[450px] shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl transition-all' },
          body: { className: 'p-8' },
          content: { className: 'p-0 m-0' }
        }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-primary dark:text-primary/90 mb-2 tracking-tight">Ecocerâmica</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Entre na plataforma de sustentabilidade</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-bold text-gray-700 dark:text-gray-300">Email</label>
            <InputText 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="exemplo@empresa.com"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-bold text-gray-700 dark:text-gray-300">Senha</label>
            <Password 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              feedback={false}
              toggleMask
              placeholder="••••••••"
              pt={{
                root: { className: 'w-full [&>div]:w-full' },
                input: { className: 'w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all' }
              }}
            />
          </div>

          <Button 
            label="Entrar" 
            icon="pi pi-sign-in" 
            loading={loading} 
            className="w-full mt-2 !bg-primary hover:!bg-primary/90 !text-white py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-2 !border-none cursor-pointer"
            type="submit"
          />
        </form>

        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400 font-medium">
          Ainda não tem uma conta?{' '}
          <Link to="/register" className="font-bold text-primary dark:text-primary/90 hover:text-primary/80 transition-colors hover:underline">
            Cadastre-se agora
          </Link>
        </div>
      </Card>
    </div>
  );
};
