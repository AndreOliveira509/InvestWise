import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts';
import styles from './InvestmentProfitabilityChart.module.css';

// Componente para o Tooltip customizado (a caixinha que aparece no hover)
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip}>
        <p className={styles.tooltipLabel}>{label}</p>
        <p className={styles.tooltipValue}>
          {`Patrimônio: ${payload[0].value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
        </p>
      </div>
    );
  }
  return null;
};

const InvestmentProfitabilityChart = ({ data }) => {
  return (
    // O ResponsiveContainer faz o gráfico se adaptar ao tamanho do container pai.
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        {/* Define um gradiente de cor para ser usado na área abaixo da linha */}
        <defs>
          <linearGradient id="colorPatrimonio" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#34D399" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#34D399" stopOpacity={0}/>
          </linearGradient>
        </defs>
        
        {/* Grade cartesiana (linhas de fundo do gráfico) */}
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
        
        {/* Eixo X (horizontal), que mostrará as datas */}
        <XAxis 
          dataKey="date" 
          stroke="#888" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
        />
        
        {/* Eixo Y (vertical), que mostrará os valores */}
        <YAxis 
          stroke="#888" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          tickFormatter={(value) => `R$${(value/1000).toFixed(0)}k`} 
        />
        
        {/* Tooltip customizado que criamos lá em cima */}
        <Tooltip content={<CustomTooltip />} />
        
        {/* A área preenchida com o gradiente */}
        <Area type="monotone" dataKey="patrimonio" stroke={false} fill="url(#colorPatrimonio)" />
        
        {/* A linha principal do gráfico */}
        <Line 
          type="monotone" 
          dataKey="patrimonio" 
          stroke="#34D399" // Cor da linha
          strokeWidth={2}
          dot={false} // Esconde os pontinhos em cada data
          activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} // Estiliza o ponto ativo (no hover)
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default InvestmentProfitabilityChart;