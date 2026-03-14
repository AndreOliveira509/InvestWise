// src/components/ExpenseLineChart/ExpenseLineChart.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import styles from './ExpenseLineChart.module.css';

const ExpenseLineChart = ({ data, hasData }) => {
  if (!hasData || data.length === 0) {
    return (
      <div className={styles.chartContainer}>
        <div className={styles.chartEmptyState}>
          <div className={styles.chartEmptyIcon}>📈</div>
          <p>Nenhum dado para exibir</p>
          <small>Adicione gastos para ver a evolução</small>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <div className={styles.tooltipHeader}>{label}</div>
          {payload.map((entry, index) => (
            <div key={index} className={styles.tooltipItem}>
              <span 
                className={styles.tooltipColor}
                style={{ backgroundColor: entry.color }}
              ></span>
              {entry.dataKey === 'gastos' ? 'Gastos' : 'Orçamento Diário'}: 
              <strong> R$ {entry.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.chartContainer}>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            stroke="#666"
            fontSize={12}
          />
          <YAxis 
            stroke="#666"
            fontSize={12}
            tickFormatter={(value) => `R$ ${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="gastos" 
            stroke="#FF6B6B" 
            strokeWidth={3}
            dot={{ fill: '#FF6B6B', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#FF4757' }}
            name="Gastos"
          />
          <Line 
            type="monotone" 
            dataKey="orcamento" 
            stroke="#4ECDC4" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#4ECDC4', strokeWidth: 2, r: 3 }}
            name="Orçamento Diário"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseLineChart;