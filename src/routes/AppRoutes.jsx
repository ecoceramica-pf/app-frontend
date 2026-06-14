import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Dashboard } from '../pages/Dashboard';
import { Perfil } from '../pages/Perfil';
import { Landing } from '../pages/Landing';
import { CadastrarResiduo } from '../pages/CadastrarResiduo';
import { MuralOfertas } from '../pages/MuralOfertas';
import { MeusResiduos } from '../pages/MeusResiduos';
import { MinhasColetas } from '../pages/MinhasColetas';
import { ConfiguracaoDisponibilidade } from '../pages/ConfiguracaoDisponibilidade';
import { GerenciarOferta } from '../pages/GerenciarOferta';
import { ForgotPassword } from '../pages/ForgotPassword';
import { ResetPassword } from '../pages/ResetPassword';
import { Historico } from '../pages/Historico';
import { AppLayout } from '../components/layout/AppLayout';

const PrivateRoute = ({ children }) => {
  const { signed, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-950">
        <span className="text-xl font-semibold text-gray-500">Carregando...</span>
      </div>
    );
  }

  return signed ? children : <Navigate to="/login" replace />;
};

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/perfil" 
          element={
            <PrivateRoute>
              <AppLayout>
                <Perfil />
              </AppLayout>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/cadastrar-residuo" 
          element={
            <PrivateRoute>
              <AppLayout>
                <CadastrarResiduo />
              </AppLayout>
            </PrivateRoute>
          } 
        />

        <Route 
          path="/disponibilidade" 
          element={
            <PrivateRoute>
              <AppLayout>
                <ConfiguracaoDisponibilidade />
              </AppLayout>
            </PrivateRoute>
          } 
        />

        <Route 
          path="/mural" 
          element={
            <PrivateRoute>
              <AppLayout>
                <MuralOfertas />
              </AppLayout>
            </PrivateRoute>
          } 
        />

        <Route 
          path="/meus-residuos" 
          element={
            <PrivateRoute>
              <AppLayout>
                <MeusResiduos />
              </AppLayout>
            </PrivateRoute>
          } 
        />

        <Route 
          path="/meus-residuos/:id/gerenciar" 
          element={
            <PrivateRoute>
              <AppLayout>
                <GerenciarOferta />
              </AppLayout>
            </PrivateRoute>
          } 
        />

        <Route 
          path="/minhas-coletas" 
          element={
            <PrivateRoute>
              <AppLayout>
                <MinhasColetas />
              </AppLayout>
            </PrivateRoute>
          } 
        />

        <Route 
          path="/historico" 
          element={
            <PrivateRoute>
              <AppLayout>
                <Historico />
              </AppLayout>
            </PrivateRoute>
          } 
        />
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
