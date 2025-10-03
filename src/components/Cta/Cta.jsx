import React from 'react';
import './Cta.module.css';
import { useFadeIn } from '../../hooks/useFadeIn';

const Cta = () => {
  const [ref, isVisible] = useFadeIn({ threshold: 0.3 });

  return (
    <section ref={ref} className={`cta-section fade-in-section ${isVisible ? 'is-visible' : ''}`}>
      <div className="container">
        <h2>Pronto para assumir o controle?</h2>
        <p>Comece sua simulação agora e dê o primeiro passo para um futuro financeiro mais inteligente.</p>
        <a href="#simular" className="btn btn-cta">Criar minha simulação</a>
      </div>
    </section>
  );
};

export default Cta;