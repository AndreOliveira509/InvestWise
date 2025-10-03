import React from 'react';
import './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="main-footer">
      <div className="container">
        <p>&copy; {currentYear} InvestiWise. Todos os direitos reservados.</p>
        <p>Um projeto para a feira escolar.</p>
      </div>
    </footer>
  );
};

export default Footer;