import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaHome, FaChartPie, FaUser, FaSignOutAlt, FaCog, FaBookReader, FaPiggyBank,
  FaMoon, FaSun, FaTimes
} from 'react-icons/fa';
import { RiRobot2Fill } from 'react-icons/ri';
import { IoAnalytics } from 'react-icons/io5';
import ProfileModal from "../ProfileModal/ProfileModal";
import styles from './Header.module.css';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
    setIsUserMenuOpen(false);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    const root = document.documentElement;
    if (newDarkMode) {
      root.style.setProperty('--bg-primary', '#1a1a1a');
      root.style.setProperty('--bg-secondary', '#2d2d2d');
      root.style.setProperty('--bg-card', '#2d2d2d');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#b0b0b0');
      root.style.setProperty('--border-color', '#404040');
      root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.3)');
    } else {
      root.style.setProperty('--bg-primary', '#f4f6fa');
      root.style.setProperty('--bg-secondary', '#ffffff');
      root.style.setProperty('--bg-card', '#ffffff');
      root.style.setProperty('--text-primary', '#000000');
      root.style.setProperty('--text-secondary', '#666666');
      root.style.setProperty('--border-color', '#e0e0e0');
      root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.1)');
    }
  };

  // Aplica o modo escuro ao carregar
  useState(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.style.setProperty('--bg-primary', '#1a1a1a');
      root.style.setProperty('--bg-secondary', '#2d2d2d');
      root.style.setProperty('--bg-card', '#2d2d2d');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#b0b0b0');
      root.style.setProperty('--border-color', '#404040');
      root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.3)');
    }
  });

  /* Menu items */
  const menuItems = [
    { path: "/home", icon: <FaHome />, label: "Dashboard" },
    { path: "/simulation", icon: <IoAnalytics />, label: "Simulações" },
    { path: "/aiquestions", icon: <RiRobot2Fill />, label: "IA Financeira" },
  ];

  const userMenuItems = [
    { path: "/profile", icon: <FaUser />, label: "Meu Perfil" },
    { path: "/settings", icon: <FaCog />, label: "Configurações" }
  ];

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          {/* Logo */}
          <div className={styles.logo} onClick={() => navigate('/home')}>
            <div className={styles.logoIcon}>
              <FaPiggyBank />
            </div>
            <span className={styles.logoText}>InvestiWise</span>
          </div>

          {/* Menu de Navegação */}
          <nav className={styles.nav}>
            {menuItems.map((item) => (
              <button
                key={item.path}
                className={`${styles.navItem} ${
                  location.pathname === item.path ? styles.active : ''
                }`}
                onClick={() => handleNavigation(item.path)}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Actions */}
          <div className={styles.userSection}>
            {/* Dark Mode Toggle */}
            <button className={styles.darkModeToggle} onClick={toggleDarkMode}>
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>

            <div className={styles.userInfo} onClick={toggleUserMenu}>
              <div className={styles.userAvatar}>
                <FaUser />
              </div>
              <div className={styles.userDetails}>
                <span className={styles.userName}>Usuário</span>
                <span className={styles.userPlan}>Premium</span>
              </div>
            </div>

            {/* User Menu Dropdown */}
            {isUserMenuOpen && (
              <div className={styles.userMenu}>
                <button
                  className={styles.userMenuItem}
                  onClick={openProfileModal}
                >
                  <span className={styles.userMenuIcon}><FaUser /></span>
                  <span className={styles.userMenuLabel}>Meu Perfil</span>
                </button>
                <button
                  className={styles.userMenuItem}
                  onClick={() => {
                    handleNavigation('/settings');
                    setIsUserMenuOpen(false);
                  }}
                >
                  <span className={styles.userMenuIcon}><FaCog /></span>
                  <span className={styles.userMenuLabel}>Configurações</span>
                </button>
                <button 
                  className={`${styles.userMenuItem} ${styles.logoutItem}`}
                  onClick={handleLogout}
                >
                  <span className={styles.userMenuIcon}><FaSignOutAlt /></span>
                  <span className={styles.userMenuLabel}>Sair</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal de Perfil */}
      {isProfileModalOpen && (
        <ProfileModal onClose={closeProfileModal} />
      )}
    </>
  );
}