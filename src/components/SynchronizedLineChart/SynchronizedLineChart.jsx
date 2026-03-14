// src/components/SynchronizedLineChart/SynchronizedLineChart.jsx
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

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
        <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#cbd5e1', borderBottom: '1px solid #475569', paddingBottom: '8px' }}>
          {label}
        </p>
        {payload.map((entry, index) => (
          <p key={index} style={{
            margin: '4px 0',
            color: entry.color,
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ height: '10px', width: '10px', backgroundColor: entry.color, borderRadius: '2px', display: 'inline-block' }}></span>
            {entry.name}: <span style={{ fontWeight: '600', color: 'white' }}>R$ {entry.value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const SynchronizedLineChart = ({ data }) => {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FFC107" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#FFC107" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorOrcamento" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis 
            dataKey="name" 
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `R$${value.toLocaleString('pt-BR')}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#FFC107', strokeWidth: 1, strokeDasharray: '3 3' }} />
          <Legend wrapperStyle={{fontSize: "14px", paddingTop: '10px'}}/>
          <Area 
            type="monotone" 
            dataKey="gastos" 
            name="Gastos"
            stroke="#FFC107"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorGastos)"
            activeDot={{ r: 8, strokeWidth: 2, fill: '#FFC107' }}
          />
          <Area 
            type="monotone" 
            dataKey="orcamento" 
            name="Orçamento Diário"
            stroke="#A9A9A9"
            strokeWidth={2}
            strokeDasharray="5 5"
            fillOpacity={1}
            fill="url(#colorOrcamento)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SynchronizedLineChart;