import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import api from '../services/api';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserFromStorage = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        api.defaults.headers.Authorization = `Bearer ${token}`;
        try {
          const responseData = await authService.getMe();
          setUser(responseData.data);
        } catch (error) {
          console.error('Falha ao validar token', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    loadUserFromStorage();
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    const token = response?.data?.access_token;
    const userData = response?.data?.user;
    
    if (token) {
        localStorage.setItem('token', token);
        api.defaults.headers.Authorization = `Bearer ${token}`;
    }

    if (userData) {
        setUser(userData);
    } else {
        // Se não retornou o user no login, busca via /me
        const fetchedUser = await authService.getMe();
        setUser(fetchedUser.data);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    delete api.defaults.headers.Authorization;
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
