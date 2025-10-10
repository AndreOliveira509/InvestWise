// src/components/ProtectedRoute/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // 1. Verifica se o token existe no localStorage
  const token = localStorage.getItem('investiwise_token');

  // 2. Se não houver token, redireciona para a página de login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 3. Se houver um token, permite que a rota filha (no nosso caso, a Home) seja renderizada
  return <Outlet />;
};

export default ProtectedRoute;