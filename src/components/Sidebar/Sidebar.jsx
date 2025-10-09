// components/Sidebar/Sidebar.js (atualizado)
import { Link, useLocation } from "react-router-dom";
import { 
  MdKeyboardDoubleArrowRight, 
  MdHome
} from "react-icons/md";
import { FaUser, FaBookReader, FaPiggyBank, FaChartLine } from "react-icons/fa";
import { RiRobot2Fill } from "react-icons/ri";
import { IoAnalytics } from "react-icons/io5";
import styles from "./Sidebar.module.css";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();

  const menuItems = [
    { path: "/home", icon: <MdHome />, label: "Dashboard", color: "#FFC107" },
    { path: "/simulation", icon: <IoAnalytics />, label: "Simulações", color: "#FFC107" },
    { path: "/aiquestions", icon: <RiRobot2Fill />, label: "IA Financeira", color: "#FFC107" },
    { path: "/methodology", icon: <FaBookReader />, label: "Metodologia", color: "#FFC107" },
    { path: "/profile", icon: <FaUser />, label: "Meu Perfil", color: "#FFC107" }
  ];

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

      {/* Footer da Sidebar */}
      {isSidebarOpen && (
        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <FaUser />
            </div>
            <div className={styles.userDetails}>
              <span className={styles.userName}>Usuário</span>
              <span className={styles.userStatus}>Premium</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;