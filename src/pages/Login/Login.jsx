// src/pages/Login/Login.js
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUser, FaLock } from 'react-icons/fa';
import styles from './Login.module.css';
import Button from '../../components/Button/Button';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navega direto para home sem verificação
    console.log('Login attempt:', formData);
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/home');
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginHeader}>
          <div className={styles.logo}>InvestiWise</div>
          <h1>Bem-vindo de volta</h1>
          <p>Entre na sua conta para continuar</p>
        </div>

        <form className={styles.loginForm} onSubmit={handleSubmit}>
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
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className={styles.formOptions}>
            <label className={styles.rememberMe}>
              <input type="checkbox" />
              Lembrar de mim
            </label>
            <a href="#" className={styles.forgotPassword}>
              Esqueci minha senha
            </a>
          </div>

          <Button type="submit">
            Entrar na conta
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

        <div className={styles.demoInfo}>
          <p>
            <strong>Demo:</strong> Use qualquer e-mail e senha para testar
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;