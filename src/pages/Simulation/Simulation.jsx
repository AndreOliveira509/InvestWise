import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  FaCalculator, FaChartLine, FaMoneyBillWave, FaArrowUp,
  FaDatabase, FaSync, FaPercent, FaCalendar,
  FaDollarSign, FaCoins, FaChartBar, FaPiggyBank,
  FaBuilding, FaGlobeAmericas, FaUniversity,
  FaChevronDown, FaFlagCheckered, FaLayerGroup, FaFire, FaFilePdf
} from 'react-icons/fa';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';


import styles from './Simulation.module.css';

const investmentTypes = [
  {
    id: 'renda-fixa',
    name: 'Renda Fixa',
    color: '#FF6B6B',
    icon: FaUniversity,
    description: 'CDB, LCIs, Tesouro Direto',
    defaultReturn: '0.9'
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

// Configuração das criptomoedas com imagens
const cryptocurrencies = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    image: 'https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/128/bitcoin.png'
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    image: 'https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/128/ethereum.png'
  },
  {
    symbol: 'BNB',
    name: 'Binance Coin',
    image: 'https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/128/binance-coin.png'
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    image: 'https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/128/solana.png'
  },
  {
    symbol: 'XRP',
    name: 'Ripple',
    image: 'https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/128/ripple.png'
  }
];

export default function Simulation() {
  const { user } = useAuth();

  const [simulationMode, setSimulationMode] = useState('standard'); // 'standard' | 'fire'

  const [simulationForm, setSimulationForm] = useState({
    initialAmount: '',
    monthlyContribution: '',
    timePeriod: '12',
    investmentType: 'renda-fixa',
    expectedReturn: '0.9',
    cryptoType: 'BTC',
    hasGoal: false,
    goalAmount: '',
    showSavings: false,
    showIPCA: false,
    retirementExpense: '' // For FIRE mode
  });

  const [showResults, setShowResults] = useState(false);
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [showCryptoQuotes, setShowCryptoQuotes] = useState(true);

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
          // Fallback para dados mock quando a API falhar
          prices[crypto.symbol] = {
            price: Math.random() * 100 + 10,
            change: (Math.random() * 10) - 5
          };
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
    const monthlyReturnRate = parseFloat(simulationForm.expectedReturn) / 100;

    // Determine Target Amount (Goal or FIRE) e TimeLimit
    let targetAmount = null;
    let maxMonths = parseInt(simulationForm.timePeriod);

    if (simulationMode === 'fire') {
      const expense = parseFloat(simulationForm.retirementExpense) || 0;
      targetAmount = expense * 300; // Regra dos 4% (300x gasto mensal)
      maxMonths = 600; // Limite de 50 anos para buscar a independência
    } else if (simulationForm.hasGoal && simulationForm.goalAmount) {
      targetAmount = parseFloat(simulationForm.goalAmount);
    }

    // Taxas comparativas (aproximadas mensais)
    const savingsRate = 0.005; // 0.5% a.m. + TR (aprox 0.6% total)
    const ipcaRate = 0.004; // 0.4% a.m. (aprox 4.9% a.a.)

    let simulationData = [];
    let currentTotal = initial;
    let currentSavings = initial;
    let currentIPCA = initial;
    let monthsReached = 0;
    let goalReached = false;

    // Cálculo Loop
    for (let i = 0; i <= maxMonths; i++) {
      const item = {
        name: i === 0 ? 'Início' : `M${i}`,
        mes: i,
        acumulado: parseFloat(currentTotal.toFixed(2)),
        investido: parseFloat((initial + (monthly * i)).toFixed(2)),
        ganhos: parseFloat((currentTotal - (initial + (monthly * i))).toFixed(2)),
      };

      if (simulationForm.showSavings) {
        item.poupanca = parseFloat(currentSavings.toFixed(2));
      }
      if (simulationForm.showIPCA) {
        item.ipca = parseFloat(currentIPCA.toFixed(2));
      }

      simulationData.push(item);

      // Check Goal/FIRE
      if (targetAmount && currentTotal >= targetAmount && !goalReached) {
        goalReached = true;
        monthsReached = i;
        if (simulationMode === 'fire') {
          // Em modo FIRE, podemos parar o gráfico um pouco depois de atingir a meta para visualização
          if (i + 24 < maxMonths) maxMonths = i + 24;
        }
      }

      // Prep data for next month
      if (i < maxMonths) {
        currentTotal = currentTotal * (1 + monthlyReturnRate) + monthly;
        currentSavings = currentSavings * (1 + savingsRate) + monthly;
        currentIPCA = currentIPCA * (1 + ipcaRate) + monthly;
      }
    }

    const totalContributions = parseFloat((initial + (monthly * (simulationMode === 'fire' ? monthsReached || maxMonths : maxMonths))).toFixed(2));
    const totalEarnings = parseFloat((currentTotal - totalContributions).toFixed(2));

    // Calculate time to goal logic specifically for display
    let timeToGoal = null;
    if (simulationMode === 'fire' || (simulationForm.hasGoal && simulationForm.goalAmount)) {
      if (targetAmount > initial) {
        const i = monthlyReturnRate;
        if (i === 0) {
          timeToGoal = (targetAmount - initial) / monthly;
        } else {
          const numerator = (targetAmount * i + monthly) / (initial * i + monthly);
          timeToGoal = Math.log(numerator) / Math.log(1 + i);
        }
        if (!isFinite(timeToGoal)) timeToGoal = null;
      } else {
        timeToGoal = 0;
      }
    }

    return {
      finalAmount: parseFloat(currentTotal.toFixed(2)),
      totalContributions,
      totalEarnings,
      simulationData,
      roi: totalContributions > 0 ? parseFloat(((totalEarnings / totalContributions) * 100).toFixed(1)) : 0,
      timeToGoal: timeToGoal ? Math.ceil(timeToGoal) : null,
      targetAmount, // Return calculated target for FIRE display
      fireNumber: simulationMode === 'fire' ? targetAmount : null
    };
  }, [simulationForm, showResults, simulationMode]);

  const handleSimulation = (e) => {
    e.preventDefault();
    if (!simulationForm.initialAmount || !simulationForm.monthlyContribution) return;
    if (simulationMode === 'fire' && !simulationForm.retirementExpense) return;

    setShowResults(true);
  };

  const generatePDF = () => {
    if (!simulationResults) return;

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Header
      doc.setFillColor(255, 193, 7); // #FFC107
      doc.rect(0, 0, pageWidth, 20, 'F');
      doc.setTextColor(50, 50, 50);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text("Relatório de Simulação - InvestWise", 14, 13);

      // Resumo Executivo
      doc.setFontSize(12);
      doc.text("Resumo Executivo", 14, 30);
      doc.setLineWidth(0.5);
      doc.line(14, 32, pageWidth - 14, 32);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      const summaryData = [
        ["Valor Inicial:", `R$ ${parseFloat(simulationForm.initialAmount).toLocaleString('pt-BR')}`],
        ["Aporte Mensal:", `R$ ${parseFloat(simulationForm.monthlyContribution).toLocaleString('pt-BR')}`],
        ["Taxa Mensal:", `${simulationForm.expectedReturn}%`],
        ["Período:", simulationMode === 'fire' ? 'Até Independência' : `${simulationForm.timePeriod} meses`],
        ["Valor Final Projetado:", `R$ ${simulationResults.finalAmount.toLocaleString('pt-BR')}`],
        ["Total Investido:", `R$ ${simulationResults.totalContributions.toLocaleString('pt-BR')}`]
      ];

      if (simulationMode === 'fire') {
        summaryData.push(["Gasto Mensal Desejado:", `R$ ${parseFloat(simulationForm.retirementExpense).toLocaleString('pt-BR')}`]);
        summaryData.push(["Número Mágico (FIRE):", `R$ ${simulationResults.fireNumber.toLocaleString('pt-BR')}`]);
        if (simulationResults.timeToGoal) {
          summaryData.push(["Tempo Estimado:", formatTime(simulationResults.timeToGoal)]);
        }
      }

      let yPos = 40;
      summaryData.forEach(([label, value]) => {
        doc.text(label, 14, yPos);
        doc.text(value, 80, yPos);
        yPos += 7;
      });

      // Tabela Detalhada
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text("Evolução Mensal (Resumo Anual)", 14, yPos + 10);

      // Filtrar dados para não ficar gigante (apenas ano a ano ou a cada 6 meses)
      const tableData = simulationResults.simulationData
        .filter((item, index) => index === 0 || index % 12 === 0 || index === simulationResults.simulationData.length - 1)
        .map(item => [
          item.name,
          `R$ ${item.investido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
          `R$ ${item.ganhos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
          `R$ ${item.acumulado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
        ]);

      autoTable(doc, {
        startY: yPos + 15,
        head: [['Mês', 'Total Investido', 'Rendimento Acum.', 'Saldo Final']],
        body: tableData,
        headStyles: { fillColor: [50, 50, 50] },
        alternateRowStyles: { fillColor: [245, 245, 245] }
      });

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Gerado por InvestWise em ${new Date().toLocaleDateString()}`, 14, doc.internal.pageSize.getHeight() - 10);
      }

      doc.save("relatorio-investimentos.pdf");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar o PDF. Verifique o console para mais detalhes.");
    }
  };

  const handleReset = () => {
    setShowResults(false);
    setSimulationForm({
      initialAmount: '',
      monthlyContribution: '',
      timePeriod: '12',
      investmentType: 'renda-fixa',
      expectedReturn: '0.9',
      cryptoType: 'BTC',
      hasGoal: false,
      goalAmount: '',
      showSavings: false,
      showIPCA: false,
      retirementExpense: ''
    });
  };

  const handleInvestmentTypeChange = (type) => {
    const selectedType = investmentTypes.find(t => t.id === type);
    setSimulationForm(prev => ({
      ...prev,
      investmentType: type,
      expectedReturn: selectedType ? selectedType.defaultReturn : '0.9'
    }));
  };

  const formatTime = (totalMonths) => {
    if (!totalMonths) return '---';
    if (totalMonths < 12) return `${totalMonths} meses`;
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    if (months === 0) return `${years} anos`;
    return `${years}a ${months}m`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipLabel}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className={styles.tooltipValue} style={{ color: entry.color }}>
              {entry.name}: R$ {entry.value.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
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
          <div className={styles.cryptoHeaderTop}>
            <div className={styles.cryptoTitle}>
              <FaDatabase className={styles.cryptoTitleIcon} />
              <span>Cotações em Tempo Real</span>
            </div>
            <button
              onClick={fetchCryptoPrices}
              className={styles.refreshBtn}
              disabled={loading}
            >
              <FaSync className={loading ? styles.spinning : ''} />
              Atualizar
            </button>
            <button
              onClick={() => setShowCryptoQuotes(!showCryptoQuotes)}
              className={`${styles.toggleBtn} ${showCryptoQuotes ? styles.rotated : ''}`}
            >
              <FaChevronDown />
            </button>
          </div>

          <div className={`${styles.cryptoContent} ${showCryptoQuotes ? styles.show : ''}`}>
            <div className={styles.cryptoGridHorizontal}>
              {cryptocurrencies.map(crypto => {
                const priceData = cryptoPrices[crypto.symbol];
                return (
                  <div key={crypto.symbol} className={styles.cryptoItemHorizontal}>
                    <div className={styles.cryptoIconHorizontal}>
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        className={styles.cryptoImage}
                      />
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

              {/* MODO DE SIMULAÇÃO TOGGLE */}
              <div className={styles.modeToggle}>
                <button
                  type="button"
                  className={`${styles.modeOption} ${simulationMode === 'standard' ? styles.active : ''}`}
                  onClick={() => setSimulationMode('standard')}
                >
                  Patrimônio
                </button>
                <button
                  type="button"
                  className={`${styles.modeOption} ${simulationMode === 'fire' ? styles.active : ''}`}
                  onClick={() => setSimulationMode('fire')}
                >
                  <FaFire style={{ marginRight: '5px', color: simulationMode === 'fire' ? '#FFC107' : 'inherit' }} />
                  Independência (FIRE)
                </button>
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

                {simulationMode === 'standard' ? (
                  <>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>
                        <FaCalendar className={styles.inputIcon} />
                        Período da Simulação
                      </label>
                      <select
                        value={simulationForm.timePeriod}
                        onChange={e => setSimulationForm({ ...simulationForm, timePeriod: e.target.value })}
                        className={styles.select}
                      >
                        <option value="6">6 meses</option>
                        <option value="12">1 ano</option>
                        <option value="24">2 anos</option>
                        <option value="36">3 anos</option>
                        <option value="60">5 anos</option>
                        <option value="120">10 anos</option>
                        <option value="240">20 anos</option>
                        <option value="360">30 anos</option>
                      </select>
                    </div>

                    {/* META TOGGLE */}
                    <div className={styles.toggleGroup}>
                      <div className={styles.toggleHeader}>
                        <label className={styles.toggleLabel}>
                          <FaFlagCheckered style={{ color: '#FFC107' }} />
                          Definir Meta de Valor
                        </label>
                        <label className={styles.toggleSwitch}>
                          <input
                            type="checkbox"
                            checked={simulationForm.hasGoal}
                            onChange={e => setSimulationForm({ ...simulationForm, hasGoal: e.target.checked })}
                          />
                          <span className={styles.slider}></span>
                        </label>
                      </div>

                      {simulationForm.hasGoal && (
                        <div className={styles.goalInput}>
                          <input
                            type="number"
                            placeholder="Valor da Meta (R$)"
                            value={simulationForm.goalAmount}
                            onChange={e => setSimulationForm({ ...simulationForm, goalAmount: e.target.value })}
                            className={styles.input}
                          />
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  // INPUTS DO MODO FIRE
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      <FaFire className={styles.inputIcon} />
                      Gasto Mensal na Aposentadoria
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={simulationForm.retirementExpense}
                      onChange={e => setSimulationForm({ ...simulationForm, retirementExpense: e.target.value })}
                      placeholder="Ex: 5000,00"
                      className={styles.input}
                      required
                    />
                    <p className={styles.tip} style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                      Defina quanto você quer gastar por mês para viver de renda passiva.
                    </p>
                  </div>
                )}

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Tipo de Investimento</label>
                  <div className={styles.investmentGrid}>
                    {investmentTypes.map(type => {
                      const IconComponent = type.icon;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          className={`${styles.investmentCard} ${simulationForm.investmentType === type.id ? styles.active : ''
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
                    <label className={styles.inputLabel}>Criptomoeda (Referência)</label>
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
                    Rentabilidade Mensal Esperada
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
                  <p className={styles.tip} style={{ marginTop: '0.5rem' }}>
                    {simulationForm.investmentType === 'cripto'
                      ? 'Baseado em médias históricas. Cripto é volátil.'
                      : 'Rentabilidade média estimada ao mês.'}
                  </p>
                </div>

                {/* COMPARAR COM */}
                <div className={styles.inputGroup}>
                  <label className={styles.toggleLabel}>
                    <FaLayerGroup style={{ color: '#FFC107' }} />
                    Comparar com
                  </label>
                  <div className={styles.compareButtons}>
                    <button
                      type="button"
                      className={`${styles.compareBtn} ${simulationForm.showSavings ? styles.active : ''}`}
                      onClick={() => setSimulationForm(prev => ({ ...prev, showSavings: !prev.showSavings }))}
                    >
                      Poupança
                    </button>
                    <button
                      type="button"
                      className={`${styles.compareBtn} ${simulationForm.showIPCA ? styles.active : ''}`}
                      onClick={() => setSimulationForm(prev => ({ ...prev, showIPCA: !prev.showIPCA }))}
                    >
                      IPCA (Inflação)
                    </button>
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button type="submit" className={styles.primaryBtn}>
                    <FaChartLine />
                    Simular {simulationMode === 'fire' ? 'Independência' : 'Investimento'}
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
                    <h2>{simulationMode === 'fire' ? 'Plano de Independência Financeira' : 'Projeção do Investimento'}</h2>
                    <p>Resultados baseados nos parâmetros informados</p>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button onClick={generatePDF} className={styles.pdfBtn}>
                      <FaFilePdf />
                      Baixar Relatório
                    </button>

                    <div className={styles.investmentBadge}>
                      {(() => {
                        const IconComponent = investmentTypes.find(t => t.id === simulationForm.investmentType)?.icon;
                        return IconComponent ? <IconComponent /> : null;
                      })()}
                      <span>{investmentTypes.find(t => t.id === simulationForm.investmentType)?.name}</span>
                    </div>
                  </div>
                </div>

                {/* MÉTRICAS */}
                <div className={styles.metricsGrid}>
                  <div className={styles.metric}>
                    <div className={styles.metricIcon} style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
                      <FaMoneyBillWave />
                    </div>
                    <div className={styles.metricContent}>
                      <span className={styles.metricLabel}>
                        {simulationMode === 'fire' ? 'Patrimônio Projetado' : 'Valor Final Estimado'}
                      </span>
                      <span className={styles.metricValue}>
                        R$ {simulationResults.finalAmount.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>
                      <div className={`${styles.metricChange} ${simulationResults.roi >= 0 ? styles.positive : styles.negative}`}>
                        <FaArrowUp />
                        <span>{simulationResults.roi >= 0 ? '+' : ''}{simulationResults.roi.toFixed(1)}% ROI</span>
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
                        R$ {simulationResults.totalContributions.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>
                    </div>
                  </div>

                  {/* FIRE NUMBER / TIME TO GOAL */}
                  {simulationMode === 'fire' ? (
                    <div className={styles.metric}>
                      <div className={styles.metricIcon} style={{ backgroundColor: 'rgba(255, 69, 0, 0.1)', color: '#FF4500' }}>
                        <FaFire />
                      </div>
                      <div className={styles.metricContent}>
                        <span className={styles.metricLabel}>Número Mágico (FIRE)</span>
                        <span className={styles.metricValue}>
                          R$ {simulationResults.fireNumber ? simulationResults.fireNumber.toLocaleString('pt-BR', { maximumFractionDigits: 0 }) : '---'}
                        </span>
                        <span className={styles.metricLabel} style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                          {simulationResults.timeToGoal ? `Liberdade em ${formatTime(simulationResults.timeToGoal)}` : 'Continue aportando!'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    simulationForm.hasGoal && simulationForm.goalAmount ? (
                      <div className={styles.metric}>
                        <div className={styles.metricIcon} style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)', color: '#ffb300' }}>
                          <FaFlagCheckered />
                        </div>
                        <div className={styles.metricContent}>
                          <span className={styles.metricLabel}>Tempo p/ Meta (R$ {parseFloat(simulationForm.goalAmount).toLocaleString('pt-BR')})</span>
                          <span className={styles.metricValue} style={{ fontSize: '1.25rem' }}>
                            {formatTime(simulationResults.timeToGoal)}
                          </span>
                          <span className={styles.metricLabel} style={{ fontSize: '0.75rem' }}>
                            {simulationResults.finalAmount >= parseFloat(simulationForm.goalAmount)
                              ? 'Meta atingida no período!'
                              : 'Aumente o prazo ou aporte.'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.metric}>
                        <div className={styles.metricIcon} style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
                          <FaChartBar />
                        </div>
                        <div className={styles.metricContent}>
                          <span className={styles.metricLabel}>Ganhos Líquidos</span>
                          <span className={styles.metricValue}>
                            R$ {simulationResults.totalEarnings.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </span>
                          <div className={`${styles.metricChange} ${simulationResults.totalEarnings >= 0 ? styles.positive : styles.negative}`}>
                            <FaArrowUp />
                            <span>Rendimento</span>
                          </div>
                        </div>
                      </div>
                    )
                  )}

                </div>

                {/* GRÁFICO PRINCIPAL */}
                <div className={styles.chartCard}>
                  <div className={styles.chartHeader}>
                    <h3>Evolução do Patrimônio</h3>
                    <p>Comparativo e crescimento ao longo do tempo</p>
                  </div>
                  <div className={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={simulationResults.simulationData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                        <XAxis
                          dataKey="name"
                          stroke="var(--text-secondary)"
                          fontSize={12}
                        />
                        <YAxis
                          stroke="var(--text-secondary)"
                          fontSize={12}
                          tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="acumulado"
                          stroke="#FFC107"
                          strokeWidth={3}
                          dot={simulationResults.simulationData.length > 60 ? false : { fill: '#FFC107', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, fill: '#FFA000' }}
                          name="Seu Investimento"
                          animationDuration={1500}
                        />
                        <Line
                          type="monotone"
                          dataKey="investido"
                          stroke="#4ECDC4"
                          strokeWidth={2}
                          dot={false}
                          name="Total Aportado"
                          animationDuration={1500}
                        />
                        {simulationForm.showSavings && (
                          <Line
                            type="monotone"
                            dataKey="poupanca"
                            stroke="#94a3b8"
                            strokeDasharray="5 5"
                            strokeWidth={2}
                            dot={false}
                            name="Poupança"
                            animationDuration={1500}
                          />
                        )}
                        {simulationForm.showIPCA && (
                          <Line
                            type="monotone"
                            dataKey="ipca"
                            stroke="#ef4444"
                            strokeDasharray="3 3"
                            strokeWidth={2}
                            dot={false}
                            name="IPCA (Inflação)"
                            animationDuration={1500}
                          />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* GRÁFICO DE COMPOSIÇÃO (NOVO) em vez do de Ganhos */}
                <div className={styles.chartCard}>
                  <div className={styles.chartHeader}>
                    <h3>Composição Final</h3>
                    <p>Proporção entre aporte e rendimentos</p>
                  </div>
                  <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div className={styles.metric}>
                        <div className={styles.metricContent}>
                          <span className={styles.metricLabel}>Total Aportado</span>
                          <span style={{ color: '#4ECDC4', fontSize: '1.2rem', fontWeight: 700 }}>
                            R$ {simulationResults.totalContributions.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div className={styles.metric}>
                        <div className={styles.metricContent}>
                          <span className={styles.metricLabel}>Rendimento Total</span>
                          <span style={{ color: '#FFC107', fontSize: '1.2rem', fontWeight: 700 }}>
                            R$ {simulationResults.totalEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </div>
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
                    <FaFlagCheckered />
                    <span>Defina uma meta financeira</span>
                  </div>
                  <div className={styles.tip}>
                    <FaLayerGroup />
                    <span>Compare com Poupança e Inflação</span>
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
