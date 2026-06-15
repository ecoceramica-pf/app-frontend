import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 p-4 text-center">
      <h1 className="text-9xl font-extrabold text-primary dark:text-primary/90">404</h1>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mt-4 mb-2">Página não encontrada</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
        Desculpe, a página que você está procurando não existe ou foi movida.
      </p>
      <Button 
        label="Voltar ao início" 
        icon="pi pi-home" 
        onClick={() => navigate('/')} 
        className="!bg-primary hover:!bg-primary/90 !text-white font-bold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
      />
    </div>
  );
};
