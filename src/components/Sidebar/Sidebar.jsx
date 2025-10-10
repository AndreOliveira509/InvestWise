// components/Sidebar/Sidebar.js (atualizado)
import { Link, useLocation } from "react-router-dom";
import { 
  MdKeyboardDoubleArrowRight, 
  MdHome
} from "react-icons/md";
import { FaUser, FaBookReader, FaPiggyBank, FaSignOutAlt, FaCog } from "react-icons/fa";
import { RiRobot2Fill } from "react-icons/ri";
import { IoAnalytics } from "react-icons/io5";
import { useState } from "react";
import styles from "./Sidebar.module.css";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const menuItems = [
    { path: "/home", icon: <MdHome />, label: "Dashboard", color: "#FFC107" },
    { path: "/simulation", icon: <IoAnalytics />, label: "Simulações", color: "#FFC107" },
    { path: "/aiquestions", icon: <RiRobot2Fill />, label: "IA Financeira", color: "#FFC107" },
    { path: "/methodology", icon: <FaBookReader />, label: "Metodologia", color: "#FFC107" }
    // Removido: "Meu Perfil" do menu principal
  ];

  const userMenuItems = [
    { path: "/profile", icon: <FaUser />, label: "Meu Perfil" },
    { path: "/settings", icon: <FaCog />, label: "Configurações" },
    { path: "/logout", icon: <FaSignOutAlt />, label: "Sair" }
  ];

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleMenuItemClick = () => {
    setIsUserMenuOpen(false);
  };

  return (
    <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
      <div className={styles.topContainer}>
        <div className={styles.flexContainer}>
          <button
            className={styles.sidebarBtn}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <MdKeyboardDoubleArrowRight className={`${styles.arrowIcon} ${isSidebarOpen ? styles.rotated : ''}`} />
          </button>
          {isSidebarOpen && (
            <div className={styles.logoContainer}>
              <div className={styles.logoIcon}>
                <FaPiggyBank />
              </div>
              <div className={styles.logoText}>InvestiWise</div>
            </div>
          )}
        </div>
        
        {isSidebarOpen && (
          <div className={styles.menu}>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.menuItem} ${
                  location.pathname === item.path ? styles.active : ''
                }`}
                style={{ '--accent-color': item.color }}
              >
                <span className={styles.menuIcon}>{item.icon}</span>
                <span className={styles.menuLabel}>{item.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer da Sidebar com Menu do Usuário */}
      {isSidebarOpen && (
        <div className={styles.sidebarFooter}>
          <div 
            className={styles.userInfo}
            onClick={handleUserMenuToggle}
          >
            <div className={styles.userAvatar}>
              <FaUser />
            </div>
            <div className={styles.userDetails}>
              <span className={styles.userName}>Usuário</span>
              <span className={styles.userStatus}>Premium</span>
            </div>
          </div>

          {/* Menu Dropdown do Usuário */}
          {isUserMenuOpen && (
            <div className={styles.userMenu}>
              {userMenuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={styles.userMenuItem}
                  onClick={handleMenuItemClick}
                >
                  <span className={styles.userMenuIcon}>{item.icon}</span>
                  <span className={styles.userMenuLabel}>{item.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;