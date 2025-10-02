// components/GraficoGastos.js
import React from 'react';

const GraficoGastos = ({ gastos }) => {
  // Agrupar gastos por categoria
  const gastosPorCategoria = gastos.reduce((acc, gasto) => {
    if (!acc[gasto.categoria]) {
      acc[gasto.categoria] = 0;
    }
    acc[gasto.categoria] += gasto.valor;
    return acc;
  }, {});

  const categorias = {
    alimentacao: 'Alimentação',
    transporte: 'Transporte',
    moradia: 'Moradia',
    lazer: 'Lazer',
    saude: 'Saúde',
    educacao: 'Educação',
    outros: 'Outros'
  };

  const totalGastos = Object.values(gastosPorCategoria).reduce((total, valor) => total + valor, 0);

  return (
    <div className="grafico-gastos">
      <h3>Distribuição de Gastos por Categoria</h3>
      {totalGastos === 0 ? (
        <p>Nenhum gasto registrado para exibir o gráfico.</p>
      ) : (
        <div className="grafico-barras">
          {Object.entries(gastosPorCategoria).map(([categoria, valor]) => {
            const porcentagem = (valor / totalGastos) * 100;
            return (
              <div key={categoria} className="barra-container">
                <span className="categoria-label">{categorias[categoria]}</span>
                <div className="barra-background">
                  <div 
                    className="barra-preenchimento"
                    style={{ width: `${porcentagem}%` }}
                  ></div>
                </div>
                <span className="barra-valor">R$ {valor.toFixed(2)} ({porcentagem.toFixed(1)}%)</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GraficoGastos;