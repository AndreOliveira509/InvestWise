import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Header from '../Header/Header';

const ProtectedRoute = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('investiwise_token');

  useEffect(() => {
    const fetchUser = async () => {
      // Se já temos o usuário no contexto, não precisa buscar de novo
      if (user) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error){
        console.error('Falha na autenticação', error);
        localStorage.removeItem('investiwise_token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUser();
    }
  }, [user, setUser, navigate, token]);

  // Se não houver token, redireciona para o login imediatamente
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Enquanto busca os dados do usuário, exibe uma tela de carregamento completa
  if (loading) {
    // Este é o único lugar onde teremos um carregamento de tela inteira
    return <div>Carregando sessão...</div>;
  }

  return (
    <div>
      <Header />
      <main>
        {/* Outlet renderiza a página filha (Home, Dashboard, etc.) */}
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedRoute;