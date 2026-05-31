import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FabricaDashboard } from '../components/dashboard/FabricaDashboard';
import { ColetorDashboard } from '../components/dashboard/ColetorDashboard';
import { AdminDashboard } from '../components/dashboard/AdminDashboard';

export const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      {user?.tipo_perfil === 'fabrica' && <FabricaDashboard />}
      {user?.tipo_perfil === 'coletor' && <ColetorDashboard />}
      {user?.tipo_perfil === 'admin' && <AdminDashboard />}
      {!user?.tipo_perfil && <p className="mt-8 text-center text-slate-500">Perfil não identificado.</p>}
    </>
  );
};
