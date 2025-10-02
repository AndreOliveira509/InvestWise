// components/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import ResumoFinanceiro from '../ResumoFinanceiro/ResumoFinanceiro';
import GraficoGastos from '../GraficoGastos/GraficoGastos';
import Metas from '../Metas/Metas';
import styles from './Dashboard.module.css';

const Dashboard = ({ userData, setUserData }) => {
  const [gastos, setGastos] = useState([]);
  const [investimentos, setInvestimentos] = useState([]);

  // Carregar dados do localStorage
  useEffect(() => {
    const savedGastos = localStorage.getItem('gastosData');
    const savedInvestimentos = localStorage.getItem('investimentosData');
    
    if (savedGastos) setGastos(JSON.parse(savedGastos));
    if (savedInvestimentos) setInvestimentos(JSON.parse(savedInvestimentos));
  }, []);

  // Salvar dados no localStorage
  useEffect(() => {
    localStorage.setItem('gastosData', JSON.stringify(gastos));
  }, [gastos]);

  useEffect(() => {
    localStorage.setItem('investimentosData', JSON.stringify(investimentos));
  }, [investimentos]);

  return (
    <div className={styles.dashboard}>
      <h2>Dashboard Financeiro</h2>
      <div className={styles.dashboardGrid}>
        <div className={styles.dashboardCol}>
          <ResumoFinanceiro 
            userData={userData} 
            gastos={gastos} 
            investimentos={investimentos} 
          />
          <GraficoGastos gastos={gastos} />
        </div>
        <div className={styles.dashboardCol}>
          <Metas userData={userData} setUserData={setUserData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;