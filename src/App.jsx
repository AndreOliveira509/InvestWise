// App.jsx - Componente principal
import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import Gastos from './components/Gastos/Gastos';
import Investimentos from './components/Investimentos/Investimentos';
import TesouroDireto from './components/TesouroDireto/TesouroDireto';
import EducacaoFinanceira from './components/EducacaoFinanceira/EducacaoFinanceira';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [userData, setUserData] = useState({
    nome: 'Usuário',
    saldo: 5000,
    metaMensal: 3000
  });

  // Carregar dados do localStorage ao inicializar
  useEffect(() => {
    const savedData = localStorage.getItem('userFinanceData');
    if (savedData) {
      setUserData(JSON.parse(savedData));
    }
  }, []);

  // Salvar dados no localStorage quando houver alterações
  useEffect(() => {
    localStorage.setItem('userFinanceData', JSON.stringify(userData));
  }, [userData]);

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard userData={userData} setUserData={setUserData} />;
      case 'gastos':
        return <Gastos userData={userData} setUserData={setUserData} />;
      case 'investimentos':
        return <Investimentos userData={userData} setUserData={setUserData} />;
      case 'tesouro':
        return <TesouroDireto userData={userData} setUserData={setUserData} />;
      case 'educacao':
        return <EducacaoFinanceira />;
      default:
        return <Dashboard userData={userData} setUserData={setUserData} />;
    }
  };

  return (
    <div className="App">
      <Header userData={userData} />
      <div className="app-body">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <main className="main-content">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}

export default App;