// src/components/PositiveAndNegativeBarChart/PositiveAndNegativeBarChart.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
        padding: '12px',
        border: '1px solid #334155',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(4px)'
      }}>
        <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#cbd5e1' }}>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{
            margin: '4px 0',
            color: entry.fill, // Usar 'fill' que é a cor da barra
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ height: '10px', width: '10px', backgroundColor: entry.fill, borderRadius: '2px', display: 'inline-block' }}></span>
            {entry.name}: <span style={{ fontWeight: '600', color: 'white' }}>R$ {entry.value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const PositiveAndNegativeBarChart = ({ data }) => {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barGap={8}
        >
          <defs>
            <linearGradient id="colorGastosBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFC107" stopOpacity={0.9}/>
              <stop offset="100%" stopColor="#FFA000" stopOpacity={0.8}/>
            </linearGradient>
            <linearGradient id="colorSaldoBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#45B7D1" stopOpacity={0.8}/>
              <stop offset="100%" stopColor="#4ECDC4" stopOpacity={0.7}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
          <XAxis
            dataKey="name"
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)'}}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `R$${value.toLocaleString('pt-BR')}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 193, 7, 0.05)' }} />
          <Legend wrapperStyle={{fontSize: "14px", paddingTop: '10px'}}/>
          <Bar
            dataKey="lucro"
            name="Saldo Positivo"
            radius={[6, 6, 0, 0]}
            fill="url(#colorSaldoBar)"
            background={{ fill: 'rgba(255, 255, 255, 0.02)', radius: 6 }}
          />
          <Bar
            dataKey="prejuizo"
            name="Gastos"
            radius={[6, 6, 0, 0]}
            fill="url(#colorGastosBar)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PositiveAndNegativeBarChart;