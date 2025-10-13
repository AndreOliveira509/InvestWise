// src/components/CustomActiveShapePieChart/CustomActiveShapePieChart.js
import React, { useState } from 'react';
import { PieChart, Pie, Sector, ResponsiveContainer, Tooltip, Cell, Legend } from 'recharts';

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;

  return (
    <g>
      <text x={cx} y={cy - 10} textAnchor="middle" fill={fill} fontSize={16} fontWeight="bold">
        {payload.name}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#94a3b8" fontSize={14}>
        {`(${(percent * 100).toFixed(1)}%)`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: `drop-shadow(0 4px 8px ${fill}55)` }}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
        padding: '12px',
        border: '1px solid #334155',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
      }}>
        <p style={{ margin: 0, color: 'white', fontSize: '14px' }}>
          {payload[0].name}: <span style={{ fontWeight: '600' }}>R$ {payload[0].value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
        </p>
      </div>
    );
  }
  return null;
};

const CustomActiveShapePieChart = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const COLORS = data.map(item => item.color || '#0088FE');

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="45%" // Levemente ajustado para dar espaço para a legenda
            innerRadius={80}
            outerRadius={110}
            dataKey="value"
            onMouseEnter={onPieEnter}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="var(--bg-card)" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            iconType="circle" 
            layout="horizontal" 
            verticalAlign="bottom" 
            align="center"
            wrapperStyle={{
              fontSize: "14px",
              paddingTop: '15px'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomActiveShapePieChart;