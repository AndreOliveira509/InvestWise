import React, { useState } from 'react';
import './Faq.module.css';
import { useFadeIn } from '../../hooks/useFadeIn';
import { FaChevronDown } from 'react-icons/fa';

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="faq-item" onClick={() => setIsOpen(!isOpen)}>
      <div className="faq-question">
        {question}
        <FaChevronDown className={`faq-icon ${isOpen ? 'open' : ''}`} />
      </div>
      {isOpen && <div className="faq-answer">{answer}</div>}
    </div>
  );
};

const Faq = () => {
  const [ref, isVisible] = useFadeIn({ threshold: 0.1 });

  const faqs = [
    { q: "O InvestiWise é gratuito?", a: "Sim! Este é um projeto acadêmico desenvolvido para a feira de tecnologia e é 100% gratuito para simulação." },
    { q: "Meus dados financeiros estão seguros?", a: "A simulação é feita localmente no seu navegador. Nenhuma informação pessoal ou financeira é enviada ou armazenada em servidores." },
    { q: "Preciso ter conhecimento prévio sobre investimentos?", a: "Não! A ferramenta foi desenhada para ser intuitiva e educativa, ideal para quem está dando os primeiros passos no mundo financeiro." },
  ];

  return (
    <section ref={ref} className={`faq-section fade-in-section ${isVisible ? 'is-visible' : ''}`}>
      <div className="container">
        <h2 className="section-title">Perguntas Frequentes</h2>
        <div className="faq-container">
          {faqs.map((faq, index) => (
            <FaqItem key={index} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;