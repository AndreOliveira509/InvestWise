// AIQuestions.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaRobot, 
  FaUser, 
  FaPaperPlane, 
  FaChartLine, 
  FaPiggyBank, 
  FaLightbulb,
  FaExclamationTriangle,
  FaChartPie,
  FaMoneyBillWave,
  FaMoon,
  FaSun
} from "react-icons/fa";
import { MdSavings, MdTrendingUp } from "react-icons/md";
import styles from "./AIQuestions.module.css";
import Header from '../../components/Header/Header';

// ✅ Importa o SDK oficial do Gemini
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = "AIzaSyAllQYJ1cbB7Q6eZTIfgD1Mc7MRxOITF-Q";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const AIQuestions = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  const [userFinancialData] = useState({
    monthlyIncome: 5000,
    monthlyExpenses: 3500,
    savings: 15000,
    debts: 5000,
    financialGoals: 'Comprar um apartamento'
  });

  useEffect(() => {
    applyDarkModeStyles(darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    applyDarkModeStyles(newDarkMode);
  };

  const applyDarkModeStyles = (isDark) => {
    const root = document.documentElement;
    if (isDark) {
      root.style.setProperty('--bg-primary', '#1a1a1a');
      root.style.setProperty('--bg-secondary', '#2d2d2d');
      root.style.setProperty('--bg-card', '#2d2d2d');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#b0b0b0');
      root.style.setProperty('--border-color', '#404040');
      root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.3)');
    } else {
      root.style.setProperty('--bg-primary', '#f4f6fa');
      root.style.setProperty('--bg-secondary', '#ffffff');
      root.style.setProperty('--bg-card', '#ffffff');
      root.style.setProperty('--text-primary', '#000000');
      root.style.setProperty('--text-secondary', '#666666');
      root.style.setProperty('--border-color', '#e0e0e0');
      root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.1)');
    }
  };

  useEffect(() => {
    const initialMessages = [
      { id: 1, text: "Olá! Sou sua assistente inteligente. 🤖", sender: 'ai', timestamp: new Date() },
      { id: 2, text: "Posso ajudar com dúvidas financeiras, curiosidades, comparações e conselhos rápidos!", sender: 'ai', timestamp: new Date() },
      { id: 3, text: "O que você gostaria de saber hoje?", sender: 'ai', timestamp: new Date() }
    ];
    setMessages(initialMessages);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Chamada à API Gemini com modelo 2.5 e filtro de foco contextual
  const callGeminiDirect = async (userMessage) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
Você é uma assistente profissional, objetiva e com linguagem natural.
Sua função é responder **de forma focada, resumida e diretamente relacionada à pergunta** feita pelo usuário.

Diretrizes:
- Responda com base no contexto da pergunta.
- Se o tema for finanças, aja como consultora financeira.
- Se for um tema geral (ex: futebol, tecnologia, curiosidades), aja como uma assistente inteligente e neutra.
- Mantenha sempre um tom profissional, claro e breve (máx. 3 parágrafos curtos).
- Evite respostas fora do tema da pergunta.
- Nunca invente contextos financeiros se o usuário não falou sobre isso.

Dados do usuário:
- 💰 Renda mensal: R$ ${userFinancialData.monthlyIncome}
- 💸 Despesas mensais: R$ ${userFinancialData.monthlyExpenses}
- 🏦 Economias: R$ ${userFinancialData.savings}
- 💳 Dívidas: R$ ${userFinancialData.debts}
- 🎯 Meta financeira: ${userFinancialData.financialGoals}

Pergunta do usuário: "${userMessage}"
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response.text();
      return response;

    } catch (error) {
      console.error("Erro ao chamar Gemini:", error);
      return `🤖 Ocorreu um erro técnico. Posso ajudar com:\n\n• Análise de gastos e orçamento\n• Recomendações de investimentos\n• Planejamento financeiro\n• Estratégias de economia`;
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    const aiResponse = await callGeminiDirect(inputMessage);
    const aiMessage = {
      id: Date.now() + 1,
      text: aiResponse,
      sender: 'ai',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const quickSuggestions = [
    "Como posso economizar mais?",
    "Melhores investimentos em 2025?",
    "Dicas para quitar dívidas",
    "Como começar a investir?"
  ];

  const handleQuickSuggestion = (suggestion) => {
    setInputMessage(suggestion);
  };

  const financialInsights = [
    {
      icon: <FaChartPie />,
      title: "Sua Economia Mensal",
      value: `R$ ${(userFinancialData.monthlyIncome - userFinancialData.monthlyExpenses).toLocaleString('pt-BR')}`,
      subtitle: `${((userFinancialData.monthlyIncome - userFinancialData.monthlyExpenses) / userFinancialData.monthlyIncome * 100).toFixed(1)}% da renda`,
      color: '#4CAF50'
    },
    {
      icon: <FaMoneyBillWave />,
      title: "Fundo de Emergência",
      value: `R$ ${userFinancialData.savings.toLocaleString('pt-BR')}`,
      subtitle: `${Math.floor(userFinancialData.savings / userFinancialData.monthlyExpenses)} meses de despesas`,
      color: '#2196F3'
    },
    {
      icon: <FaExclamationTriangle />,
      title: "Dívidas Pendentes",
      value: `R$ ${userFinancialData.debts.toLocaleString('pt-BR')}`,
      subtitle: `${(userFinancialData.debts / userFinancialData.monthlyIncome * 100).toFixed(1)}% da renda`,
      color: '#F44336'
    },
    {
      icon: <MdTrendingUp />,
      title: "Meta Financeira",
      value: userFinancialData.financialGoals,
      subtitle: "Em andamento",
      color: '#FFC107'
    }
  ];

  return (
    <div className={styles.aiQuestions}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <section className={styles.aiHeader}>
            <div className={styles.headerContent}>
              <div className={styles.titleSection}>
                <div className={styles.titleRow}>
                  <h1 className={styles.title}>
                    <FaRobot className={styles.titleIcon} />
                    Assistente IA Profissional
                  </h1>
                  <button 
                    className={styles.darkModeToggle}
                    onClick={toggleDarkMode}
                    aria-label={darkMode ? "Ativar modo claro" : "Ativar modo escuro"}
                  >
                    {darkMode ? <FaSun /> : <FaMoon />}
                  </button>
                </div>
                <p className={styles.subtitle}>
                  Consultoria inteligente com Gemini 2.5 — Respostas focadas e profissionais
                </p>
              </div>

              <div className={styles.insightsGrid}>
                {financialInsights.map((insight, index) => (
                  <div key={index} className={styles.insightCard}>
                    <div className={styles.insightIcon} style={{ color: insight.color }}>
                      {insight.icon}
                    </div>
                    <div className={styles.insightContent}>
                      <h4>{insight.title}</h4>
                      <div className={styles.insightValue}>{insight.value}</div>
                      <div className={styles.insightSubtitle}>{insight.subtitle}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className={styles.chatSection}>
            <div className={styles.chatContainer}>
              <div className={styles.quickSuggestions}>
                <h4>Perguntas Rápidas:</h4>
                <div className={styles.suggestionsGrid}>
                  {quickSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className={styles.suggestionChip}
                      onClick={() => handleQuickSuggestion(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.messagesContainer}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`${styles.message} ${message.sender === 'user' ? styles.userMessage : styles.aiMessage}`}
                  >
                    <div className={styles.messageAvatar}>
                      {message.sender === 'user' ? <FaUser /> : <FaRobot />}
                    </div>
                    <div className={styles.messageContent}>
                      <div className={styles.messageText}>
                        {message.text.split('\n').map((line, index) => (
                          <p key={index}>{line}</p>
                        ))}
                      </div>
                      <div className={styles.messageTime}>
                        {message.timestamp.toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className={styles.message}>
                    <div className={styles.messageAvatar}>
                      <FaRobot />
                    </div>
                    <div className={styles.messageContent}>
                      <div className={styles.typingIndicator}>
                        <span></span><span></span><span></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className={styles.inputContainer}>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Digite sua pergunta..."
                    className={styles.messageInput}
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className={styles.sendButton}
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AIQuestions;
