// src/components/SynchronizedLineChart/SynchronizedLineChart.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SynchronizedLineChart = ({ data }) => {
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
              {entry.name}: <span style={{ fontWeight: '600' }}>{entry.value.toLocaleString('pt-BR')}</span>
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
        <LineChart
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
            tickFormatter={(value) => value.toLocaleString('pt-BR')}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="visitas" 
            stroke="#667eea" 
            strokeWidth={3}
            dot={{ fill: '#667eea', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#5a67d8' }}
            name="Visitas"
            animationBegin={0}
            animationDuration={1500}
          />
          <Line 
            type="monotone" 
            dataKey="conversoes" 
            stroke="#ed8936" 
            strokeWidth={2}
            dot={{ fill: '#ed8936', strokeWidth: 2, r: 3 }}
            name="Conversões"
            animationBegin={400}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SynchronizedLineChart;