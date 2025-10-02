// components/Header.js
import React from 'react';

const Header = ({ userData }) => {
  return (
    <header className="header">
      <div className="header-content">
        <h1>Finanças Inteligentes</h1>
        <div className="user-info">
          <span>Olá, {userData.nome}</span>
          <div className="saldo">
            <span>Saldo: R$ {userData.saldo.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;