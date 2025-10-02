// components/Sidebar.js
import React from 'react';

const Sidebar = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'gastos', label: 'Controle de Gastos', icon: '💰' },
    { id: 'investimentos', label: 'Investimentos', icon: '📈' },
    { id: 'tesouro', label: 'Tesouro Direto', icon: '🏦' },
    { id: 'educacao', label: 'Educação Financeira', icon: '🎓' }
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map(item => (
            <li key={item.id}>
              <button 
                className={`nav-button ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => setActiveSection(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;