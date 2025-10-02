// components/ResumoFinanceiro.js
import React from 'react';

const ResumoFinanceiro = ({ userData, gastos, investimentos }) => {
  const totalGastos = gastos.reduce((total, gasto) => total + gasto.valor, 0);
  const totalInvestido = investimentos.reduce((total, inv) => total + inv.valor, 0);
  const saldoRestante = userData.saldo;

  return (
    <div className="resumo-financeiro">
      <h3>Resumo Financeiro</h3>
      <div className="resumo-cards">
        <div className="resumo-card">
          <span className="resumo-label">Saldo Disponível</span>
          <span className="resumo-valor positivo">R$ {saldoRestante.toFixed(2)}</span>
        </div>
        <div className="resumo-card">
          <span className="resumo-label">Total Gastos</span>
          <span className="resumo-valor negativo">R$ {totalGastos.toFixed(2)}</span>
        </div>
        <div className="resumo-card">
          <span className="resumo-label">Total Investido</span>
          <span className="resumo-valor investimento">R$ {totalInvestido.toFixed(2)}</span>
        </div>
        <div className="resumo-card">
          <span className="resumo-label">Meta Mensal</span>
          <span className="resumo-valor meta">R$ {userData.metaMensal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default ResumoFinanceiro;