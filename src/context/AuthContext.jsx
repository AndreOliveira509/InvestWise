// src/context/AuthContext.jsx

import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Altere a chave 'user' para 'investiwise_user' para manter o padrão
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('investiwise_user')));
  // ALTERE AQUI: de 'token' para 'investiwise_token'
  const [token, setToken] = useState(() => localStorage.getItem('investiwise_token'));

  useEffect(() => {
    if (user) {
      // Altere a chave 'user' para 'investiwise_user'
      localStorage.setItem('investiwise_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('investiwise_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      // ALTERE AQUI: de 'token' para 'investiwise_token'
      localStorage.setItem('investiwise_token', token);
    } else {
      localStorage.removeItem('investiwise_token');
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);