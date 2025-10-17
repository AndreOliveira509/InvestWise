// pages/LandingPage/LandingPage.jsx
import { useNavigate } from "react-router-dom";
import { 
  FaChartLine, FaPiggyBank, FaShieldAlt, FaMobileAlt, FaTimes, FaBars,
  FaDollarSign, FaChartPie, FaLightbulb, FaBullseye, FaBrain, FaChevronDown,
  FaMoon, FaSun
} from "react-icons/fa";
import { useState, useEffect } from "react";
import styles from "./LandingPage.module.css";
import Button from "../../components/Button/Button";
import imagemHome from '../../assets/imagemhome.jpg';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Alternar modo escuro
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    document.body.classList.toggle(styles.darkMode, isDarkMode);
  }, [isDarkMode]);

  const features = [
    {
      icon: <FaChartLine />,
      title: "Análise Inteligente",
      description: "Algoritmos avançados analisam seus gastos e sugerem oportunidades de investimento"
    },
    {
      icon: <FaPiggyBank />,
      title: "Simulação de Investimentos",
      description: "Projete seu patrimônio com diferentes estratégias de aplicação"
    },
    {
      icon: <FaMobileAlt />,
      title: "Acesso em Tempo Real",
      description: "Acompanhe suas projeções de qualquer lugar, a qualquer momento"
    }
  ];

  const steps = [
    {
      step: "1",
      title: "Cadastre Sua Renda",
      description: "Informe suas receitas mensais para começarmos a simulação",
      icon: <FaDollarSign />
    },
    {
      step: "2",
      title: "Registre Seus Gastos",
      description: "Categorize suas despesas e identifique oportunidades",
      icon: <FaChartPie />
    },
    {
      step: "3",
      title: "Receba Insights Inteligentes",
      description: "Nossa IA analisa seus dados e sugere melhorias",
      icon: <FaLightbulb />
    },
    {
      step: "4",
      title: "Acompanhe Sua Evolução",
      description: "Veja projeções e otimize seus investimentos",
      icon: <FaChartLine />
    }
  ];

  const benefits = [
    {
      icon: <FaBullseye />,
      title: "Alcance Suas Metas",
      description: "Planeje objetivos financeiros concretos como viagens, imóveis ou independência"
    },
    {
      icon: <FaChartLine />,
      title: "Educação Financeira",
      description: "Aprenda na prática sobre investimentos, juros compostos e planejamento"
    },
    {
      icon: <FaBrain />,
      title: "Decisões Inteligentes",
      description: "Tome decisões baseadas em dados reais e projeções precisas"
    }
  ];

  const testimonials = [
    {
      name: "Ana Silva",
      role: "Estudante de Economia",
      text: "O InvestiWise me mostrou como pequenos ajustes no orçamento podem gerar grandes resultados no longo prazo!"
    },
    {
      name: "Carlos Mendes",
      role: "Profissional Liberal",
      text: "Finalmente entendi para onde meu dinheiro estava indo. As projeções me ajudaram a planejar minha aposentadoria."
    }
  ];

  const faqs = [
    {
      question: "O InvestiWise é gratuito?",
      answer: "Sim! Este é um projeto educacional desenvolvido para promover educação financeira e é 100% gratuito."
    },
    {
      question: "Meus dados financeiros estão seguros?",
      answer: "Todas as simulações são processadas localmente no seu navegador. Não armazenamos nenhuma informação sensível em servidores."
    },
    {
      question: "Preciso ter conhecimento prévio sobre investimentos?",
      answer: "Não! A plataforma foi desenvolvida para ser intuitiva e educativa, perfeita para iniciantes."
    }
  ];

  const handleLoginClick = () => {
    navigate("/login");
    setIsMenuOpen(false);
  };

  const handleRegisterClick = () => {
    navigate("/register");
    setIsMenuOpen(false);
  };

  const handleSimulationClick = () => {
    navigate("/simulation");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className={styles.landingPage}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.navbar}>
          <div className={styles.logo}>
            <div className={styles.logoText}>InvestiWise</div>
          </div>

          <nav className={`${styles.nav} ${isMenuOpen ? styles.active : ''}`}>
            <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Recursos</a>
            <a href="#benefits" onClick={(e) => { e.preventDefault(); scrollToSection('benefits'); }}>Vantagens</a>
            <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}>Como Funciona</a>
            <a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }}>Depoimentos</a>
            <a href="#faq" onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }}>FAQ</a>
          </nav>

          <div className={`${styles.authButtons} ${isMenuOpen ? styles.active : ''}`}>
            <button onClick={toggleDarkMode} className={styles.themeToggle}>
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
            <Button secondary onClick={handleLoginClick}>
              Entrar
            </Button>
            <Button onClick={handleRegisterClick}>
              Cadastrar
            </Button>
          </div>

          <button 
            className={styles.mobileMenuButton} 
            onClick={toggleMenu}
            aria-label="Menu mobile"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.6)), url(${imagemHome}) center/cover`
        }}
      >
        <div className={styles.heroContent}>
          <h1>O futuro das suas finanças começa aqui</h1>
          <p>Simule seus investimentos, visualize seu crescimento e tome o controle da sua vida financeira com ferramentas inteligentes e insights poderosos.</p>
          <div className={styles.heroButtons}>
            <Button onClick={handleSimulationClick}>
              Iniciar Simulação Gratuita
            </Button>
            <Button secondary onClick={() => scrollToSection('features')}>
              Conhecer Recursos
            </Button>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.dashboardPreview}>
            <div className={styles.chartContainer}>
              <div className={styles.chartBar} style={{height: '80%'}}></div>
              <div className={styles.chartBar} style={{height: '60%'}}></div>
              <div className={styles.chartBar} style={{height: '90%'}}></div>
              <div className={styles.chartBar} style={{height: '70%'}}></div>
              <div className={styles.chartBar} style={{height: '85%'}}></div>
            </div>
            <div className={styles.metrics}>
              <div className={styles.metric}>
                <span>+28%</span>
                <small>Rendimento Anual</small>
              </div>
              <div className={styles.metric}>
                <span>R$ 15K</span>
                <small>Patrimônio</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <div className={styles.container}>
          <h2>Recursos Poderosos para Seu Sucesso Financeiro</h2>
          <p className={styles.sectionSubtitle}>Ferramentas inteligentes que transformam sua relação com o dinheiro</p>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className={styles.benefits}>
        <div className={styles.container}>
          <h2>Vá além da simulação</h2>
          <p className={styles.sectionSubtitle}>Descubra o poder do controle financeiro na sua vida</p>
          <div className={styles.benefitsGrid}>
            {benefits.map((benefit, index) => (
              <div key={index} className={styles.benefitCard}>
                <div className={styles.benefitIcon}>{benefit.icon}</div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className={styles.howItWorks}>
        <div className={styles.container}>
          <h2>Como o InvestiWise Funciona</h2>
          <p className={styles.sectionSubtitle}>4 passos simples para transformar sua vida financeira</p>
          <div className={styles.steps}>
            {steps.map((step, index) => (
              <div key={index} className={styles.step}>
                <div className={styles.stepNumber}>{step.step}</div>
                <div className={styles.stepIcon}>{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className={styles.testimonials}>
        <div className={styles.container}>
          <h2>O que nossos usuários dizem</h2>
          <p className={styles.sectionSubtitle}>Junte-se a milhares de pessoas que já transformaram suas finanças</p>
          <div className={styles.testimonialGrid}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className={styles.testimonialCard}>
                <div className={styles.testimonialContent}>
                  <p>"{testimonial.text}"</p>
                </div>
                <div className={styles.testimonialAuthor}>
                  <h4>{testimonial.name}</h4>
                  <span>{testimonial.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className={styles.faq}>
        <div className={styles.container}>
          <h2>Perguntas Frequentes</h2>
          <p className={styles.sectionSubtitle}>Tire suas dúvidas sobre a plataforma</p>
          <div className={styles.faqContainer}>
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`${styles.faqItem} ${openFaqIndex === index ? styles.active : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <div className={styles.faqQuestion}>
                  {faq.question}
                  <FaChevronDown className={styles.faqIcon} />
                </div>
                {openFaqIndex === index && (
                  <div className={styles.faqAnswer}>
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <h2>Pronto para assumir o controle das suas finanças?</h2>
          <p>Comece sua simulação agora e dê o primeiro passo para um futuro financeiro mais inteligente</p>
          <div className={styles.ctaButtonContainer}>
            <Button onClick={handleSimulationClick}>
              Criar Minha Simulação Gratuita
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerBrand}>
              <div className={styles.logo}>
                <div className={styles.logoText}>InvestiWise</div>
              </div>
              <p>Transformando a maneira como você cuida do seu dinheiro</p>
            </div>
            <div className={styles.footerLinks}>
              <div className={styles.footerSection}>
                <h4>Produto</h4>
                <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Recursos</a>
                <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}>Como Funciona</a>
                <a href="#benefits" onClick={(e) => { e.preventDefault(); scrollToSection('benefits'); }}>Vantagens</a>
              </div>
              <div className={styles.footerSection}>
                <h4>Suporte</h4>
                <a href="#">Central de Ajuda</a>
                <a href="#">Contato</a>
                <a href="#">Política de Privacidade</a>
              </div>
              <div className={styles.footerSection}>
                <h4>Comunidade</h4>
                <a href="#">Blog</a>
                <a href="#">Tutoriais</a>
                <a href="#">Eventos</a>
              </div>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2025 InvestiWise. Um projeto para educação financeira. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
