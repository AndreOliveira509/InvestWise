// pages/Simulation/Simulation.jsx
import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  FaCalculator, FaChartLine, FaMoneyBillWave, FaArrowUp,
  FaDatabase, FaSync, FaPercent, FaCalendar,
  FaDollarSign, FaCoins, FaChartBar, FaPiggyBank,
  FaBuilding, FaGlobeAmericas, FaUniversity
} from 'react-icons/fa';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer
} from 'recharts';

import styles from './Simulation.module.css';
import Header from '../../components/Header/Header';

const investmentTypes = [
  { 
    id: 'renda-fixa', 
    name: 'Renda Fixa', 
    color: '#FF6B6B', 
    icon: FaUniversity,
    description: 'CDB, LCIs, Tesouro Direto',
    defaultReturn: '0.8'
  },
  { 
    id: 'acoes', 
    name: 'Ações', 
    color: '#4ECDC4', 
    icon: FaChartLine,
    description: 'Bolsa de Valores',
    defaultReturn: '1.2'
  },
  { 
    id: 'fii', 
    name: 'FIIs', 
    color: '#45B7D1', 
    icon: FaBuilding,
    description: 'Fundos Imobiliários',
    defaultReturn: '0.9'
  },
  { 
    id: 'cripto', 
    name: 'Cripto', 
    color: '#FFA07A', 
    icon: FaGlobeAmericas,
    description: 'Criptomoedas',
    defaultReturn: '2.5'
  },
  { 
    id: 'previdencia', 
    name: 'Previdência', 
    color: '#BB8FCE', 
    icon: FaPiggyBank,
    description: 'Previdência Privada',
    defaultReturn: '0.7'
  }
];

const cryptocurrencies = [
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'BNB', name: 'Binance Coin' },
  { symbol: 'ADA', name: 'Cardano' },
  { symbol: 'SOL', name: 'Solana' },
  { symbol: 'XRP', name: 'Ripple' }
];

// Função para gerar números "aleatórios" determinísticos
const getDeterministicRandom = (seed, min, max) => {
  const x = Math.sin(seed) * 10000;
  return min + (x - Math.floor(x)) * (max - min);
};

export default function Simulation() {
  const { user } = useAuth();

  const [simulationForm, setSimulationForm] = useState({
    initialAmount: '',
    monthlyContribution: '',
    timePeriod: '12',
    investmentType: 'renda-fixa',
    expectedReturn: '0.8',
    cryptoType: 'BTC'
  });

  const [showResults, setShowResults] = useState(false);
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCryptoPrices();
  }, []);

  const fetchCryptoPrices = async () => {
    setLoading(true);
    try {
      const prices = {};
      
      for (const crypto of cryptocurrencies) {
        try {
          const response = await fetch(`https://economia.awesomeapi.com.br/json/last/${crypto.symbol}-BRL`);
          const data = await response.json();
          const key = `${crypto.symbol}BRL`;
          if (data[key]) {
            prices[crypto.symbol] = {
              price: parseFloat(data[key].bid),
              change: parseFloat(data[key].pctChange)
            };
          }
        } catch (err) {
          console.warn(`Failed to fetch ${crypto.symbol}:`, err);
        }
      }
      
      setCryptoPrices(prices);
    } catch (err) {
      console.error('Error fetching crypto prices:', err);
    } finally {
      setLoading(false);
    }
  };

  const simulationResults = useMemo(() => {
    if (!showResults) return null;

    const initial = parseFloat(simulationForm.initialAmount) || 0;
    const monthly = parseFloat(simulationForm.monthlyContribution) || 0;
    const months = parseInt(simulationForm.timePeriod);
    const baseMonthlyRate = parseFloat(simulationForm.expectedReturn) / 100;

    // Seed base para números determinísticos
    const baseSeed = initial + monthly + months + baseMonthlyRate;

    let simulationData = [];
    let total = initial;

    for (let i = 0; i <= months; i++) {
      if (i > 0) {
        let monthlyRate = baseMonthlyRate;

        switch (simulationForm.investmentType) {
          case 'acoes':
            // Volatilidade determinística baseada no seed
            const volatility = getDeterministicRandom(baseSeed + i, -0.05, 0.08);
            monthlyRate = Math.max(baseMonthlyRate + volatility, -0.15);
            break;
          case 'cripto':
            const cryptoData = cryptoPrices[simulationForm.cryptoType];
            const baseCryptoRate = cryptoData ? (cryptoData.change / 100) : baseMonthlyRate;
            // Volatilidade determinística para cripto também
            const cryptoVolatility = getDeterministicRandom(baseSeed + i + 1000, -0.15, 0.15);
            monthlyRate = baseCryptoRate + cryptoVolatility;
            break;
          case 'previdencia':
            monthlyRate = baseMonthlyRate - 0.001;
            break;
          default:
            // Para renda fixa e FIIs, usa a taxa base sem alterações
            monthlyRate = baseMonthlyRate;
        }

        total = total * (1 + monthlyRate) + monthly;
      }

      simulationData.push({
        name: i === 0 ? 'Início' : `M${i}`,
        mes: i,
        acumulado: total,
        investido: initial + (monthly * i),
        ganhos: total - (initial + (monthly * i))
      });
    }

    const totalContributions = initial + (monthly * months);
    const totalEarnings = total - totalContributions;

    return {
      finalAmount: total,
      totalContributions,
      totalEarnings,
      simulationData,
      roi: totalContributions > 0 ? (totalEarnings / totalContributions) * 100 : 0
    };
  }, [
    // Apenas estas dependências afetam o cálculo
    simulationForm.initialAmount,
    simulationForm.monthlyContribution,
    simulationForm.timePeriod,
    simulationForm.investmentType,
    simulationForm.expectedReturn,
    simulationForm.cryptoType,
    showResults,
    // CryptoPrices só quando for investimento em cripto
    ...(simulationForm.investmentType === 'cripto' ? [cryptoPrices] : [])
  ]);

  const handleSimulation = (e) => {
    e.preventDefault();
    if (!simulationForm.initialAmount || !simulationForm.monthlyContribution) return;
    setShowResults(true);
  };

  const handleReset = () => {
    setShowResults(false);
    setSimulationForm({
      initialAmount: '',
      monthlyContribution: '',
      timePeriod: '12',
      investmentType: 'renda-fixa',
      expectedReturn: '0.8',
      cryptoType: 'BTC'
    });
  };

  const handleInvestmentTypeChange = (type) => {
    const selectedType = investmentTypes.find(t => t.id === type);
    setSimulationForm(prev => ({
      ...prev,
      investmentType: type,
      expectedReturn: selectedType ? selectedType.defaultReturn : '0.8'
    }));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipLabel}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className={styles.tooltipValue} style={{ color: entry.color }}>
              {entry.name}: R$ {entry.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.simulation}>
      <div className={styles.container}>
        <div className={styles.cryptoHeader}>
          <div className={styles.cryptoHeaderContent}>
            <div className={styles.cryptoTitle}>
              <FaDatabase className={styles.cryptoTitleIcon} />
              <span>Cotações em Tempo Real</span>
              <button 
                onClick={fetchCryptoPrices} 
                className={styles.refreshBtn}
                disabled={loading}
              >
                <FaSync className={loading ? styles.spinning : ''} />
                Atualizar
              </button>
            </div>
            <div className={styles.cryptoGridHorizontal}>
              {cryptocurrencies.map(crypto => {
                const priceData = cryptoPrices[crypto.symbol];
                return (
                  <div key={crypto.symbol} className={styles.cryptoItemHorizontal}>
                    <div className={styles.cryptoIconHorizontal}>
                      <span>{crypto.symbol}</span>
                    </div>
                    <div className={styles.cryptoInfoHorizontal}>
                      <span className={styles.cryptoNameHorizontal}>{crypto.name}</span>
                      <span className={styles.cryptoPriceHorizontal}>
                        {priceData ? `R$ ${priceData.price.toFixed(2)}` : '---'}
                      </span>
                    </div>
                    <span className={`${styles.changeHorizontal} ${priceData?.change >= 0 ? styles.positive : styles.negative}`}>
                      {priceData ? `${priceData.change >= 0 ? '+' : ''}${priceData.change.toFixed(2)}%` : '---'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* HEADER PRINCIPAL */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1>Simulação de Investimentos</h1>
            <p>Projete seu crescimento financeiro com cenários realistas</p>
          </div>
        </div>

        <div className={styles.grid}>
          {/* SIDEBAR */}
          <div className={styles.sidebar}>
            {/* CARD DE SIMULAÇÃO */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                  <FaCalculator className={styles.cardIcon} />
                  <div>
                    <h3>Configurar Simulação</h3>
                    <p>Preencha os dados do investimento</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSimulation} className={styles.form}>
                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      <FaDollarSign className={styles.inputIcon} />
                      Valor Inicial
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={simulationForm.initialAmount}
                      onChange={e => setSimulationForm({ ...simulationForm, initialAmount: e.target.value })}
                      placeholder="R$ 0,00"
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      <FaCoins className={styles.inputIcon} />
                      Aporte Mensal
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={simulationForm.monthlyContribution}
                      onChange={e => setSimulationForm({ ...simulationForm, monthlyContribution: e.target.value })}
                      placeholder="R$ 0,00"
                      className={styles.input}
                      required
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    <FaCalendar className={styles.inputIcon} />
                    Período
                  </label>
                  <select
                    value={simulationForm.timePeriod}
                    onChange={e => setSimulationForm({ ...simulationForm, timePeriod: e.target.value })}
                    className={styles.select}
                  >
                    <option value="6">6 meses</option>
                    <option value="12">1 ano</option>
                    <option value="24">2 anos</option>
                    <option value="60">5 anos</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Tipo de Investimento</label>
                  <div className={styles.investmentGrid}>
                    {investmentTypes.map(type => {
                      const IconComponent = type.icon;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          className={`${styles.investmentCard} ${
                            simulationForm.investmentType === type.id ? styles.active : ''
                          }`}
                          onClick={() => handleInvestmentTypeChange(type.id)}
                          style={{
                            '--accent-color': type.color
                          }}
                        >
                          <div className={styles.investmentIcon}>
                            <IconComponent />
                          </div>
                          <div className={styles.investmentContent}>
                            <span className={styles.investmentName}>{type.name}</span>
                            <span className={styles.investmentDesc}>{type.description}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {simulationForm.investmentType === 'cripto' && (
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Criptomoeda</label>
                    <select
                      value={simulationForm.cryptoType}
                      onChange={e => setSimulationForm({ ...simulationForm, cryptoType: e.target.value })}
                      className={styles.select}
                    >
                      {cryptocurrencies.map(crypto => (
                        <option key={crypto.symbol} value={crypto.symbol}>
                          {crypto.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    <FaPercent className={styles.inputIcon} />
                    Rentabilidade Mensal
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={simulationForm.expectedReturn}
                    onChange={e => setSimulationForm({ ...simulationForm, expectedReturn: e.target.value })}
                    placeholder="0,0%"
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formActions}>
                  <button type="submit" className={styles.primaryBtn}>
                    <FaChartLine />
                    Simular Investimento
                  </button>
                  <button type="button" onClick={handleReset} className={styles.secondaryBtn}>
                    Limpar
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className={styles.mainContent}>
            {showResults && simulationResults ? (
              <div className={styles.results}>
                {/* HEADER DOS RESULTADOS */}
                <div className={styles.resultsHeader}>
                  <div className={styles.resultsTitle}>
                    <h2>Projeção do Investimento</h2>
                    <p>Resultados baseados nos parâmetros informados</p>
                  </div>
                  <div className={styles.investmentBadge}>
                    {(() => {
                      const IconComponent = investmentTypes.find(t => t.id === simulationForm.investmentType)?.icon;
                      return IconComponent ? <IconComponent /> : null;
                    })()}
                    <span>{investmentTypes.find(t => t.id === simulationForm.investmentType)?.name}</span>
                  </div>
                </div>

                {/* MÉTRICAS */}
                <div className={styles.metricsGrid}>
                  <div className={styles.metric}>
                    <div className={styles.metricIcon} style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
                      <FaMoneyBillWave />
                    </div>
                    <div className={styles.metricContent}>
                      <span className={styles.metricLabel}>Valor Final</span>
                      <span className={styles.metricValue}>
                        R$ {simulationResults.finalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <div className={styles.metricChange}>
                        <FaArrowUp />
                        <span>+{simulationResults.roi.toFixed(1)}% ROI</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.metric}>
                    <div className={styles.metricIcon} style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                      <FaCoins />
                    </div>
                    <div className={styles.metricContent}>
                      <span className={styles.metricLabel}>Total Investido</span>
                      <span className={styles.metricValue}>
                        R$ {simulationResults.totalContributions.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <div className={styles.metric}>
                    <div className={styles.metricIcon} style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
                      <FaChartBar />
                    </div>
                    <div className={styles.metricContent}>
                      <span className={styles.metricLabel}>Ganhos Líquidos</span>
                      <span className={styles.metricValue}>
                        R$ {simulationResults.totalEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <div className={styles.metricChange}>
                        <FaArrowUp />
                        <span>Rendimento</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* GRÁFICO PRINCIPAL */}
                <div className={styles.chartCard}>
                  <div className={styles.chartHeader}>
                    <h3>Evolução do Patrimônio</h3>
                    <p>Crescimento do investimento ao longo do tempo</p>
                  </div>
                  <div className={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart 
                        data={simulationResults.simulationData} 
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis 
                          dataKey="name" 
                          stroke="#64748b"
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="#64748b"
                          fontSize={12}
                          tickFormatter={(value) => `R$ ${(value/1000).toFixed(0)}k`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="acumulado" 
                          stroke="#FFC107" 
                          strokeWidth={3}
                          dot={{ fill: '#FFC107', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, fill: '#FFA000' }}
                          name="Valor Acumulado"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="investido" 
                          stroke="#4ECDC4" 
                          strokeWidth={2}
                          dot={{ fill: '#4ECDC4', strokeWidth: 2, r: 3 }}
                          name="Total Investido"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* GRÁFICO DE GANHOS */}
                <div className={styles.chartCard}>
                  <div className={styles.chartHeader}>
                    <h3>Evolução dos Ganhos</h3>
                    <p>Progresso dos rendimentos mensais</p>
                  </div>
                  <div className={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart 
                        data={simulationResults.simulationData} 
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis 
                          dataKey="name" 
                          stroke="#64748b"
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="#64748b"
                          fontSize={12}
                          tickFormatter={(value) => `R$ ${(value/1000).toFixed(0)}k`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="ganhos" 
                          stroke="#FF6B6B" 
                          strokeWidth={3}
                          dot={{ fill: '#FF6B6B', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, fill: '#FF4757' }}
                          name="Ganhos Acumulados"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.placeholder}>
                <div className={styles.placeholderIcon}>
                  <FaChartLine />
                </div>
                <h3>Simulação de Investimentos</h3>
                <p>Configure os parâmetros ao lado para visualizar a projeção do seu investimento</p>
                <div className={styles.placeholderTips}>
                  <div className={styles.tip}>
                    <FaCalculator />
                    <span>Preencha valor inicial e aportes mensais</span>
                  </div>
                  <div className={styles.tip}>
                    <FaChartLine />
                    <span>Escolha o tipo de investimento</span>
                  </div>
                  <div className={styles.tip}>
                    <FaDatabase />
                    <span>Visualize cotações em tempo real</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}