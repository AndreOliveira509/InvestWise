// pages/Home/Home.jsx
import { useNavigate } from 'react-router-dom';
import { 
  FaChartLine, 
  FaPiggyBank, 
  FaMoneyBillWave, 
  FaChartPie, 
  FaRocket,
  FaArrowRight,
  FaDatabase,
  FaSync,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext'
import styles from './Home.module.css';
import { useState, useEffect } from 'react';
import {
  ComposedChart, Area, Bar, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const cryptocurrencies = [
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'BNB', name: 'Binance Coin' },
  { symbol: 'SOL', name: 'Solana' },
  { symbol: 'XRP', name: 'Ripple' }
];


export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [chartData, setChartData] = useState([]);
  const [cryptoLoading, setCryptoLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      await fetchCryptoPrices();
      generateChartData();
      setCryptoLoading(false);
    };
    fetchData();
  }, []); 


  const fetchCryptoPrices = async () => {
    setCryptoLoading(true);
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
              change: parseFloat(data[key].pctChange),
              timestamp: data[key].timestamp
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
      // a flag de loading principal é controlada no useEffect acima
    }
  };

  const generateChartData = () => {
    const data = [];
    const baseValues = {
      btc: 250000,
      eth: 15000,
      bnb: 2000,
      ada: 3,
      sol: 120,
      xrp: 2.5
    };

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      
      data.push({
        name: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
        btc: baseValues.btc * (1 + (Math.random() * 0.1 - 0.05)),
        eth: baseValues.eth * (1 + (Math.random() * 0.08 - 0.04)),
        volume: Math.floor(Math.random() * 1000) + 500,
        transactions: Math.floor(Math.random() * 500) + 200
      });
    }
    
    setChartData(data);
  };

  const features = [
    {
      icon: <FaChartLine />,
      title: "Dashboard Inteligente",
      description: "Visualize toda sua situação financeira com gráficos interativos e métricas em tempo real"
    },
    {
      icon: <FaPiggyBank />,
      title: "Controle de Orçamento",
      description: "Defina metas e receba alertas inteligentes sobre seus gastos e investimentos"
    },
    {
      icon: <FaMoneyBillWave />,
      title: "Simulação de Investimentos",
      description: "Projete seu crescimento financeiro com diferentes cenários de investimento"
    },
    {
      icon: <FaChartPie />,
      title: "Análise Detalhada",
      description: "Relatórios completos com insights sobre seus hábitos financeiros"
    }
  ];

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleGoToSimulation = () => {
    navigate('/simulation');
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipLabel}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className={styles.tooltipValue} style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('R$') ? `R$ ${entry.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (cryptoLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <span>Carregando dados da home...</span>
      </div>
    );
  }

  return (
    <div className={styles.home}>    
      <div className={styles.mainContent}>
       {/* ... O RESTO DO SEU JSX DA HOME PAGE ... */}
        <section className={styles.cryptoSection}>
          <div className={styles.cryptoHeader}>
            <div className={styles.cryptoTitle}>
              <FaDatabase className={styles.cryptoIcon} />
              <span>Cotações em Tempo Real</span>
              <button 
                onClick={fetchCryptoPrices} 
                className={styles.refreshBtn}
                disabled={cryptoLoading}
              >
                <FaSync className={cryptoLoading ? styles.spinning : ''} />
                Atualizar
              </button>
            </div>
            <div className={styles.cryptoGrid}>
              {cryptocurrencies.map(crypto => {
                const priceData = cryptoPrices[crypto.symbol];
                return (
                  <div key={crypto.symbol} className={styles.cryptoCard}>
                    <div className={styles.cryptoHeaderMini}>
                      <span className={styles.cryptoSymbol}>{crypto.symbol}</span>
                      <span className={styles.cryptoName}>{crypto.name}</span>
                    </div>
                    <div className={styles.cryptoPrice}>
                      <span className={styles.price}>
                        {priceData ? `R$ ${priceData.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '---'}
                      </span>
                      <span className={`${styles.change} ${priceData?.change >= 0 ? styles.positive : styles.negative}`}>
                        {priceData ? (
                          <>
                            {priceData.change >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                            {Math.abs(priceData.change).toFixed(2)}%
                          </>
                        ) : '---'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* HERO SECTION */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.welcomeSection}>
              <div className={styles.welcomeBadge}>
                <FaRocket />
                <span>Bem-vindo de volta, {user.name || 'Investidor'}!</span>
              </div>
              <h1 className={styles.heroTitle}>
                Transforme sua 
                <span className={styles.highlight}> Vida Financeira</span>
              </h1>
              <p className={styles.heroDescription}>
                Controle total sobre seus gastos, investimentos e metas financeiras. 
                Tome decisões inteligentes com base em dados reais e projeções precisas.
              </p>
              
              <div className={styles.heroStats}>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>+89%</span>
                  <span className={styles.statLabel}>dos usuários economizam mais</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>R$ 2.5M+</span>
                  <span className={styles.statLabel}>em investimentos gerenciados</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>4.8★</span>
                  <span className={styles.statLabel}>avaliação dos usuários</span>
                </div>
              </div>

              <div className={styles.heroActions}>
                <button 
                  className={styles.primaryButton}
                  onClick={handleGoToDashboard}
                >
                  <span>Ver Meu Dashboard</span>
                  <FaArrowRight />
                </button>
                <button 
                  className={styles.secondaryButton}
                  onClick={handleGoToSimulation}
                >
                  <span>Simular Investimentos</span>
                  <FaChartLine />
                </button>
              </div>
            </div>

            <div className={styles.heroCharts}>
              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <h3>Variação das Criptomoedas (7 dias)</h3>
                  <p>Desempenho do mercado em tempo real</p>
                </div>
                <div className={styles.chartContainer}>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={chartData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <CartesianGrid stroke="#f5f5f5" />
                      <Area type="monotone" dataKey="btc" fill="#8884d8" stroke="#8884d8" name="Bitcoin (R$)" />
                      <Bar dataKey="volume" barSize={20} fill="#413ea0" name="Volume" />
                      <Line type="monotone" dataKey="eth" stroke="#ff7300" name="Ethereum (R$)" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* METRICAS RÁPIDAS */}
        <section className={styles.quickMetrics}>
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <FaMoneyBillWave />
              </div>
              <div className={styles.metricContent}>
                <span className={styles.metricValue}>
                  {user.patrimonio ? `R$ ${parseFloat(user.patrimonio).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ 0,00'}
                </span>
                <span className={styles.metricLabel}>Patrimônio Total</span>
              </div>
              <div className={styles.metricTrend}>
                <FaArrowUp />
                <span>+5.2%</span>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <FaChartLine />
              </div>
              <div className={styles.metricContent}>
                <span className={styles.metricValue}>R$ 1.250</span>
                <span className={styles.metricLabel}>Economia Mensal</span>
              </div>
              <div className={styles.metricTrend}>
                <FaArrowUp />
                <span>+12%</span>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <FaPiggyBank />
              </div>
              <div className={styles.metricContent}>
                <span className={styles.metricValue}>8/10</span>
                <span className={styles.metricLabel}>Metas Alcançadas</span>
              </div>
              <div className={styles.metricTrend}>
                <FaArrowUp />
                <span>+2 esta semana</span>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className={styles.features}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Ferramentas Poderosas</h2>
              <p className={styles.sectionSubtitle}>
                Tudo que você precisa para tomar decisões financeiras inteligentes
              </p>
            </div>
            
            <div className={styles.featuresGrid}>
              {features.map((feature, index) => (
                <div key={index} className={styles.featureCard}>
                  <div className={styles.featureIconWrapper}>
                    <div className={styles.featureIcon}>
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDescription}>{feature.description}</p>
                  <button 
                    className={styles.featureButton}
                    onClick={index === 2 ? handleGoToSimulation : handleGoToDashboard}
                  >
                    Explorar
                    <FaArrowRight />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <div className={styles.ctaCard}>
              <div className={styles.ctaContent}>
                <h2>Pronto para otimizar seus investimentos?</h2>
                <p>
                  Acesse ferramentas avançadas de simulação, análise de mercado e 
                  acompanhamento em tempo real para maximizar seus retornos.
                </p>
                <div className={styles.ctaActions}>
                  <button 
                    className={styles.ctaPrimary}
                    onClick={handleGoToSimulation}
                  >
                    <FaChartLine />
                    <span>Simular Investimentos</span>
                  </button>
                  <button 
                    className={styles.ctaSecondary}
                    onClick={handleGoToDashboard}
                  >
                    <span>Ver Dashboard Completo</span>
                    <FaArrowRight />
                  </button>
                </div>
              </div>
              <div className={styles.ctaVisual}>
                <div className={styles.visualGraph}>
                  <div className={styles.graphLine} style={{height: '60%'}}></div>
                  <div className={styles.graphLine} style={{height: '80%'}}></div>
                  <div className={styles.graphLine} style={{height: '45%'}}></div>
                  <div className={styles.graphLine} style={{height: '90%'}}></div>
                  <div className={styles.graphLine} style={{height: '70%'}}></div>
                  <div className={styles.graphLine} style={{height: '85%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}