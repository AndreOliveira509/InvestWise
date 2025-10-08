// pages/Simulation/Simulation.js
import React from 'react';
import { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import styles from './Simulation.module.css';

const Simulation = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className={styles.simulation}>
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className={`${styles.mainContent} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        <h1>Simulações de Investimento</h1>
        <p>Página em desenvolvimento - Em breve você poderá simular seus investimentos aqui!</p>
      </div>
    </div>
  );
};

export default Simulation;