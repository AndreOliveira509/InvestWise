import React from 'react';
import './Features.module.css';
import { FaDollarSign, FaChartPie, FaLightbulb } from 'react-icons/fa';

const Features = () => {
  return (
    <section className="features-section">
      <div className="container">
        <h2>Como funciona? Simples assim.</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="icon-wrapper">
              <FaDollarSign size={30} />
            </div>
            <h3>1. Adicione sua Renda</h3>
            <p>Informe seu saldo mensal para que possamos começar a projetar suas finanças.</p>
          </div>
          <div className="feature-card">
            <div className="icon-wrapper">
              <FaChartPie size={30} />
            </div>
            <h3>2. Registre seus Gastos</h3>
            <p>Categorize suas despesas para entender para onde seu dinheiro está indo.</p>
          </div>
          <div className="feature-card">
            <div className="icon-wrapper">
              <FaLightbulb size={30} />
            </div>
            <h3>3. Receba Insights</h3>
            <p>Veja gráficos, alertas de limite e dicas para otimizar seus investimentos.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;