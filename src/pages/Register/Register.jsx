// src/pages/Register/Register.js
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import styles from './Register.module.css';
import Button from '../../components/Button/Button';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    // Simulação de cadastro - navega direto para home
    console.log('Register attempt:', formData);
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/home');
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.registerContainer}>
        <div className={styles.registerHeader}>
          <div className={styles.logo}>InvestiWise</div>
          <h1>Crie sua conta</h1>
          <p>Comece sua jornada financeira agora</p>
        </div>

        <form className={styles.registerForm} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">
              <FaUser className={styles.inputIcon} />
              Nome completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">
              <FaEnvelope className={styles.inputIcon} />
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
                placeholder="Mínimo 8 caracteres"
                minLength="8"
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

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">
              <FaLock className={styles.inputIcon} />
              Confirmar senha
            </label>
            <div className={styles.passwordInput}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Digite a senha novamente"
                minLength="8"
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className={styles.terms}>
            <label className={styles.termsLabel}>
              <input type="checkbox" required />
              <span>
                Concordo com os{' '}
                <a href="#" className={styles.termsLink}>
                  Termos de Serviço
                </a>{' '}
                e{' '}
                <a href="#" className={styles.termsLink}>
                  Política de Privacidade
                </a>
              </span>
            </label>
          </div>

          <Button type="submit">
            Criar minha conta
          </Button>
        </form>

        <div className={styles.registerFooter}>
          <p>
            Já tem uma conta?{' '}
            <Link to="/login" className={styles.loginLink}>
              Fazer login
            </Link>
          </p>
        </div>

        <div className={styles.demoInfo}>
          <p>
            <strong>Demo:</strong> Preencha os dados para testar o cadastro
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;