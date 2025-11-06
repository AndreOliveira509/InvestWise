// pages/Home/Home.jsx
import { useNavigate } from 'react-router-dom';
import { 
  FaChartLine, 
  FaPiggyBank, 
  FaMoneyBillWave, 
  FaChartPie, 
  FaRocket,
  FaArrowRight
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext'
import styles from './Home.module.css';
import { useState, useEffect } from 'react';
import {
  ComposedChart, Area, Bar, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      generateChartData();
      setLoading(false);
    };
    fetchData();
  }, []); 

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

  // APENAS DASHBOARD E SIMULAÇÃO DE INVESTIMENTOS
  const features = [
    {
      icon: <FaChartLine />,
      title: "Dashboard Inteligente",
      description: "Visualize toda sua situação financeira com gráficos interativos e métricas em tempo real",
      action: () => navigate('/dashboard')
    },
    {
      icon: <FaMoneyBillWave />,
      title: "Simulação de Investimentos",
      description: "Projete seu crescimento financeiro com diferentes cenários de investimento",
      action: () => navigate('/simulation')
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

  if (loading) {
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
        {/* HERO SECTION */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.welcomeSection}>
              <div className={styles.welcomeBadge}>
                <FaRocket />
                <span>Bem-vindo de volta, {user.name || 'Investidor'}!</span>
              </div>
              <h1 className={styles.heroTitle}>
                Transforme sua Vida Financeira
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
                  <h3>Variação de Mercado (7 dias)</h3>
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
                      <Area type="monotone" dataKey="btc" fill="#8884d8" stroke="#8884d8" name="Ativo A (R$)" />
                      <Bar dataKey="volume" barSize={20} fill="#413ea0" name="Volume" />
                      <Line type="monotone" dataKey="eth" stroke="#ff7300" name="Ativo B (R$)" />
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
                <FaArrowRight />
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
                <FaArrowRight />
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
                <FaArrowRight />
                <span>+2 esta semana</span>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION - APENAS 2 CARDS */}
        <section className={styles.features}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Ferramentas Poderosas</h2>
              <p className={styles.sectionSubtitle}>
                Tudo que você precisa para tomar decisões financeiras inteligentes
              </p>
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