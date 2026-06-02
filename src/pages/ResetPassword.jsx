import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { authService } from '../services/authService';

export const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const navigate = useNavigate();
  const toast = useRef(null);

  useEffect(() => {
    if (!token || !email) {
      toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Link de redefinição inválido.' });
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [token, email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !passwordConfirmation) {
      toast.current.show({ severity: 'warn', summary: 'Aviso', detail: 'Preencha todos os campos.' });
      return;
    }

    if (password !== passwordConfirmation) {
      toast.current.show({ severity: 'warn', summary: 'Aviso', detail: 'As senhas não coincidem.' });
      return;
    }

    try {
      setLoading(true);
      await authService.resetPassword({
        token,
        email,
        password,
        password_confirmation: passwordConfirmation
      });
      
      toast.current.show({ 
        severity: 'success', 
        summary: 'Sucesso', 
        detail: 'Senha redefinida com sucesso!'
      });
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error(error);
      toast.current.show({ 
        severity: 'error', 
        summary: 'Erro', 
        detail: error.response?.data?.message || 'Falha ao redefinir a senha'
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
          <h1 className="text-4xl font-extrabold text-primary dark:text-primary/90 mb-2 tracking-tight">Nova Senha</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Insira sua nova senha abaixo</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-bold text-gray-700 dark:text-gray-300">Nova Senha</label>
            <Password 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              feedback={true}
              toggleMask
              promptLabel="Digite a senha"
              weakLabel="Fraca"
              mediumLabel="Média"
              strongLabel="Forte"
              placeholder="••••••••"
              pt={{
                root: { className: 'w-full [&>div]:w-full' },
                input: { className: 'w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all' }
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="passwordConfirmation" className="text-sm font-bold text-gray-700 dark:text-gray-300">Confirmar Nova Senha</label>
            <Password 
              id="passwordConfirmation" 
              value={passwordConfirmation} 
              onChange={(e) => setPasswordConfirmation(e.target.value)} 
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
            label="Redefinir Senha" 
            icon="pi pi-check" 
            loading={loading} 
            className="w-full mt-2 !bg-primary hover:!bg-primary/90 !text-white py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-2 !border-none cursor-pointer"
            type="submit"
          />
        </form>

        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400 font-medium">
          Lembrou a senha?{' '}
          <Link to="/login" className="font-bold text-primary dark:text-primary/90 hover:text-primary/80 transition-colors hover:underline">
            Voltar para o login
          </Link>
        </div>
      </Card>
    </div>
  );
};
