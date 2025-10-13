// src/pages/Login/Login.jsx
import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUser, FaLock } from 'react-icons/fa';
import styles from './Login.module.css';
import Button from '../../components/Button/Button';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const successMessage = searchParams.get('success');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    // 1. Impede o recarregamento da página
    e.preventDefault();
    console.log('handleSubmit foi chamado!'); // DEBUG

    setError('');
    setLoading(true);

    try {
      console.log('Enviando para a API:', formData); // DEBUG
      
      const response = await axios.post('http://localhost:3001/auth/login', {
        email: formData.email,
        password: formData.password,
      });
      
      console.log('Resposta da API:', response.data); // DEBUG
      const { access_token } = response.data;
      
      if (access_token) {
        localStorage.setItem('investiwise_token', access_token);
        console.log('Token guardado! A navegar para /home...'); // DEBUG
        navigate('/home');
      } else {
        setError('Token não recebido da API.');
      }

    } catch (apiError) {
      console.error('Erro no login:', apiError);
      if (apiError.response && apiError.response.data) {
        setError(apiError.response.data.message || 'Credenciais inválidas.');
      } else {
        setError('Não foi possível conectar ao servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginHeader}>
          <div className={styles.logo}>InvestiWise</div>
          <h1>Bem-vindo de volta</h1>
          <p>Entre na sua conta para continuar</p>
        </div>
        
        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
        {error && <p className={styles.errorMessage}>{error}</p>}

        {/* 2. Certifique-se de que o onSubmit está aqui */}
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          
          {/* ... o resto do seu formulário ... */}

          <div className={styles.inputGroup}>
            <label htmlFor="email">
              <FaUser className={styles.inputIcon} />
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              required
              disabled={loading}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">
              <FaLock className={styles.inputIcon} />
              Senha
            </label>
            <div className={styles.passwordInput}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Sua senha"
                required
                disabled={loading}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className={styles.formOptions}>
            <label className={styles.rememberMe}>
              <input type="checkbox" disabled={loading} />
              Lembrar de mim
            </label>
            <a href="#" className={styles.forgotPassword}>
              Esqueci minha senha
            </a>
          </div>
          
          {/* 3. Certifique-se de que o botão é do tipo "submit" */}
          <Button type="submit" disabled={loading}>
            {loading ? 'A entrar...' : 'Entrar na conta'}
          </Button>
        </form>

        <div className={styles.loginFooter}>
          <p>
            Não tem uma conta?{' '}
            <Link to="/register" className={styles.signupLink}>
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;