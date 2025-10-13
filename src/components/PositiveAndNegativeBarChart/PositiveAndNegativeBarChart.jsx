// src/components/PositiveAndNegativeBarChart/PositiveAndNegativeBarChart.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PositiveAndNegativeBarChart = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '12px',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <p className="label" style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#2d3748' }}>
            {label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ 
              margin: '4px 0', 
              color: entry.color,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                backgroundColor: entry.color,
                borderRadius: '2px'
              }}></span>
              {entry.name}: <span style={{ fontWeight: '600' }}>R$ {entry.value.toLocaleString('pt-BR')}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
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
          <Bar 
            dataKey="lucro" 
            fill="#4CAF50" 
            name="Lucro"
            radius={[4, 4, 0, 0]}
            animationBegin={0}
            animationDuration={1500}
          />
          <Bar 
            dataKey="prejuizo" 
            fill="#F44336" 
            name="Prejuízo"
            radius={[4, 4, 0, 0]}
            animationBegin={400}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PositiveAndNegativeBarChart;