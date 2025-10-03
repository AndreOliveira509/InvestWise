import React from 'react';
import './Benefits.module.css';
import { useFadeIn } from '../../hooks/useFadeIn';
import { FaBullseye, FaChartLine, FaBrain } from 'react-icons/fa';

const Benefits = () => {
  const [ref, isVisible] = useFadeIn({ threshold: 0.2 });

  return (
    <section 
      ref={ref} 
      className={`benefits-section fade-in-section ${isVisible ? 'is-visible' : ''}`}
    >
      <div className="container">
        <h2 className="section-title">Vá além da simulação</h2>
        <p className="section-subtitle">
          Entenda o poder que o controle financeiro pode trazer para sua vida.
        </p>
        <div className="benefits-grid">
          <div className="benefit-card">
            <FaBullseye size={40} className="benefit-icon" />
            <h3>Alcance Suas Metas</h3>
            <p>Seja uma viagem, um carro novo ou a casa própria, planejar é o primeiro passo para conquistar.</p>
          </div>
          <div className="benefit-card">
            <FaChartLine size={40} className="benefit-icon" />
            <h3>Educação Financeira</h3>
            <p>Aprenda na prática sobre investimentos, juros compostos e a importância de poupar.</p>
          </div>
          <div className="benefit-card">
            <FaBrain size={40} className="benefit-icon" />
            <h3>Decisões Inteligentes</h3>
            <p>Com dados claros, você toma decisões mais assertivas sobre onde e como usar seu dinheiro.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;