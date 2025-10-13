// src/components/ExpenseChart/ExpenseChart.js
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
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

  // Prepara os dados para o Recharts
  const chartData = expensesByCategory.map(category => ({
    name: category.name,
    value: category.total,
    color: category.color,
    icon: category.icon
  }));

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={styles.customTooltip}>
          <div className={styles.tooltipHeader}>
            <span 
              className={styles.tooltipColor} 
              style={{ backgroundColor: data.color }}
            ></span>
            {data.icon} {data.name}
          </div>
          <div className={styles.tooltipContent}>
            <strong>R$ {data.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
            <br />
            <span>
              {((data.value / chartData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Label para mostrar porcentagem dentro do gráfico
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }) => {
    if (percent < 0.05) return null; // Não mostra label para fatias muito pequenas
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.pieChartWrapper}>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              content={<CustomLegend data={chartData} />}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Custom Legend Component
const CustomLegend = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className={styles.customLegend}>
      <div className={styles.legendTitle}>Distribuição por Categoria</div>
      <div className={styles.legendItems}>
        {data.map((entry, index) => {
          const percentage = ((entry.value / total) * 100).toFixed(1);
          return (
            <div key={`legend-${index}`} className={styles.legendItem}>
              <div className={styles.legendItemMain}>
                <span 
                  className={styles.legendColor}
                  style={{ backgroundColor: entry.color }}
                ></span>
                <span className={styles.legendName}>
                  {entry.icon} {entry.name}
                </span>
              </div>
              <div className={styles.legendDetails}>
                <span className={styles.legendAmount}>
                  R$ {entry.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className={styles.legendPercentage}>
                  {percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExpenseChart;