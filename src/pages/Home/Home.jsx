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
import Header from '../../components/Header/Header';
import styles from './Home.module.css';
import { useState, useEffect } from 'react';
import axios from 'axios'; // 1. Adicione a importação do axios

export default function Home() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('investiwise_token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      try {
        const response = await axios.get('/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error){
        console.error('Falha ao buscar dados do usuário', error);
        localStorage.removeItem('investiwise_token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
  
   fetchUser(); // 2. Corrija o nome da função aqui
}, [navigate, setUser]);

  const features = [
    {
      icon: <FaChartLine />,
      title: "Dashboard Completo",
      description: "Acompanhe todos os seus gastos e receitas em tempo real com gráficos interativos"
    },
    {
      icon: <FaPiggyBank />,
      title: "Controle de Orçamento",
      description: "Defina limites e receba alertas quando estiver perto de ultrapassar seu orçamento"
    },
    {
      icon: <FaMoneyBillWave />,
      title: "Análise de Gastos",
      description: "Categorize seus gastos e identifique oportunidades de economia"
    },
    {
      icon: <FaChartPie />,
      title: "Relatórios Detalhados",
      description: "Gere relatórios completos sobre sua saúde financeira"
    }
  ];

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading || !user) {
    return <div>A carregar...</div>;
  }
  
  return (
    <div className={styles.home}>
      <Header />
      
      <div className={styles.mainContent}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.welcomeBadge}>
              <FaRocket />
              <span>Bem-vindo ao InvestWise</span>
            </div>
            <h1 className={styles.heroTitle}>
              Controle Total das suas 
              <span className={styles.highlight}> Finanças</span>
            </h1>
            <p className={styles.heroDescription}>
              Tome o controle da sua vida financeira com ferramentas poderosas de análise, 
              simulação e acompanhamento. Visualize seus gastos, planeje investimentos e 
              alcance seus objetivos financeiros.
            </p>
            
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>+95%</span>
                <span className={styles.statLabel}>de economia</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>360°</span>
                <span className={styles.statLabel}>visão financeira</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>24/7</span>
                <span className={styles.statLabel}>acompanhamento</span>
              </div>
            </div>

            <button 
              className={styles.ctaButton}
              onClick={handleGoToDashboard}
            >
              <span>Ir para o Dashboard</span>
              <FaArrowRight />
            </button>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.visualCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardDots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.miniChart}>
                  <div className={styles.chartBars}>
                    <div className={styles.bar} style={{height: '60%'}}></div>
                    <div className={styles.bar} style={{height: '80%'}}></div>
                    <div className={styles.bar} style={{height: '45%'}}></div>
                    <div className={styles.bar} style={{height: '90%'}}></div>
                    <div className={styles.bar} style={{height: '70%'}}></div>
                  </div>
                </div>
                <div className={styles.cardStats}>
                  <div className={styles.miniStat}>
                    <span className={styles.miniStatValue}>R$ 2.540</span>
                    <span className={styles.miniStatLabel}>Saldo Atual</span>
                  </div>
                  <div className={styles.miniStat}>
                    <span className={styles.miniStatValue}>+12%</span>
                    <span className={styles.miniStatLabel}>este mês</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.features}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Tudo que você precisa em um só lugar</h2>
            <p className={styles.sectionSubtitle}>
              Ferramentas completas para transformar sua relação com o dinheiro
            </p>
            
            <div className={styles.featuresGrid}>
              {features.map((feature, index) => (
                <div key={index} className={styles.featureCard}>
                  <div className={styles.featureIcon}>
                    {feature.icon}
                  </div>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDescription}>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <div className={styles.ctaCard}>
              <h2>Pronto para começar?</h2>
              <p>
                Acesse agora mesmo o dashboard completo e descubra todo o potencial 
                das suas finanças com análises detalhadas e insights inteligentes.
              </p>
              <button 
                className={styles.ctaButtonLarge}
                onClick={handleGoToDashboard}
              >
                <span>Explorar Dashboard Completo</span>
                <FaArrowRight />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}