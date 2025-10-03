import React from 'react';
import './Testimonials.module.css';
import { useFadeIn } from '../../hooks/useFadeIn';

const Testimonials = () => {
  const [ref, isVisible] = useFadeIn({ threshold: 0.2 });

  return (
    <section 
      ref={ref} 
      className={`testimonials-section fade-in-section ${isVisible ? 'is-visible' : ''}`}
    >
      <div className="container">
        <h2 className="section-title">O que dizem sobre o projeto</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p className="quote">"Finalmente uma ferramenta que me mostrou de forma clara para onde meu dinheiro vai. A interface com gráficos é incrível!"</p>
            <div className="author">- Ana Clara, Estudante de Design</div>
          </div>
          <div className="testimonial-card">
            <p className="quote">"Um projeto escolar com potencial de startup. Simples de usar e extremamente útil para quem está começando a investir."</p>
            <div className="author">- Prof. Marcos, Avaliador da Feira</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;