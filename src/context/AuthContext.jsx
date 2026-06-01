import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import api from '../services/api';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const responseData = await authService.getMe();
        setUser(responseData.data);
      } catch (error) {
        console.error('Usuário não autenticado', error);
      }
      setLoading(false);
    };

    loadUserFromStorage();
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    const userData = response?.data?.user;
    // O cookie HttpOnly já foi definido pelo backend na resposta do login

    if (userData) {
        setUser(userData);
    } else {
        // Se não retornou o user no login, busca via /me
        const fetchedUser = await authService.getMe();
        setUser(fetchedUser.data);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erro ao fazer logout', error);
    }
    setUser(null);
  };

  const reloadUser = async () => {
    const fetchedUser = await authService.getMe();
    setUser(fetchedUser.data);
  };

  return (
    <AuthContext.Provider value={{ user, signed: !!user, loading, login, logout, reloadUser }}>
      {children}
    </AuthContext.Provider>
  );
};
