import React from 'react';
import './Hero.module.css';

const Hero = () => {
  return (
    <section className="hero-section" id="simular">
      <div className="container">
        <h1>O futuro das suas finanças começa aqui.</h1>
        <p>
          Simule seus gastos, visualize seus investimentos e tome o controle
          da sua vida financeira de forma simples e intuitiva.
        </p>
        <a href="#simulacao" className="btn btn-hero">Iniciar Simulação Gratuita</a>
      </div>
    </section>
  );
};

export default Hero;