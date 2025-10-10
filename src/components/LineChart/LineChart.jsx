// src/components/LineChart/LineChart.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import styles from './LineChart.module.css';

const CustomLineChart = ({ data, hasData }) => {
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
              {entry.dataKey === 'gastos' ? 'Gastos' : 'Orçamento'}: 
              <strong> R$ {entry.value.toLocaleString('pt-BR')}</strong>
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
        <LineChart data={data}>
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
            stroke="#FFC107" 
            strokeWidth={3}
            dot={{ fill: '#FFC107', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#FFA000' }}
            name="Gastos"
          />
          <Line 
            type="monotone" 
            dataKey="orcamento" 
            stroke="#4CAF50" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#4CAF50', strokeWidth: 2, r: 3 }}
            name="Orçamento"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;