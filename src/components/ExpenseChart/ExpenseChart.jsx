// src/components/ExpenseChart/ExpenseChart.js
import React from 'react';
import styles from './ExpenseChart.module.css';

const ExpenseChart = ({ expensesByCategory, hasData }) => {
  // Se não há dados, mostra estado vazio
  if (!hasData || expensesByCategory.length === 0) {
    return (
      <div className={styles.chartContainer}>
        <div className={styles.chartEmptyState}>
          <div className={styles.chartEmptyIcon}>📊</div>
          <p>Nenhum dado para exibir</p>
          <small>Adicione gastos para ver o gráfico</small>
        </div>
      </div>
    );
  }

  // Encontra o valor máximo para calcular as porcentagens
  const maxValue = Math.max(...expensesByCategory.map(item => item.total));
  
  return (
    <div className={styles.chartContainer}>
      <div className={styles.barChart}>
        {expensesByCategory.map((category, index) => {
          const percentage = (category.total / maxValue) * 100;
          return (
            <div key={category.id} className={styles.barItem}>
              <div className={styles.barLabel}>
                <span 
                  className={styles.categoryColor}
                  style={{ backgroundColor: category.color }}
                ></span>
                <span className={styles.categoryName}>
                  {category.icon} {category.name}
                </span>
                <span className={styles.categoryAmount}>
                  R$ {category.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className={styles.barTrack}>
                <div 
                  className={styles.barFill}
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: category.color
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legenda do gráfico */}
      <div className={styles.chartLegend}>
        <div className={styles.legendTitle}>Distribuição por Categoria</div>
        <div className={styles.legendItems}>
          {expensesByCategory.map(category => (
            <div key={category.id} className={styles.legendItem}>
              <span 
                className={styles.legendColor}
                style={{ backgroundColor: category.color }}
              ></span>
              <span className={styles.legendName}>{category.name}</span>
              <span className={styles.legendPercentage}>
                {((category.total / expensesByCategory.reduce((sum, cat) => sum + cat.total, 0)) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpenseChart;