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
  FaCheckCircle,
  FaDollarSign,
  FaCalendar,
  FaChartPie,
  FaMoneyBillWave
} from "react-icons/fa";
import { MdSavings, MdTrendingUp } from "react-icons/md";
import styles from "./AIQuestions.module.css";
import Header from '../../components/Header/Header';

const AIQuestions = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userFinancialData, setUserFinancialData] = useState({
    monthlyIncome: 5000,
    monthlyExpenses: 3500,
    savings: 15000,
    debts: 5000,
    financialGoals: 'Comprar um apartamento'
  });

  // Mensagens iniciais da IA
  const initialMessages = [
    {
      id: 1,
      text: "Olá! Sou sua assistente financeira inteligente. 🤖",
      sender: 'ai',
      timestamp: new Date()
    },
    {
      id: 2,
      text: "Posso ajudar você com:\n• Análise de gastos\n• Planejamento de investimentos\n• Dicas de economia\n• Projeções financeiras\n• E muito mais!",
      sender: 'ai',
      timestamp: new Date()
    },
    {
      id: 3,
      text: "Como posso ajudar sua vida financeira hoje?",
      sender: 'ai',
      timestamp: new Date()
    }
  ];

  // Inicializar mensagens
  useEffect(() => {
    setMessages(initialMessages);
  }, []);

  // Scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Respostas pré-definidas da IA
  const getAIResponse = async (userMessage) => {
    setIsLoading(true);
    
    // Simular delay da IA
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lowerMessage = userMessage.toLowerCase();
    let response = '';

    // Análise de palavras-chave para respostas contextuais
    if (lowerMessage.includes('gasto') || lowerMessage.includes('economizar') || lowerMessage.includes('economia')) {
      const savingsRate = ((userFinancialData.monthlyIncome - userFinancialData.monthlyExpenses) / userFinancialData.monthlyIncome * 100).toFixed(1);
      
      response = `💡 **Análise dos Seus Gastos:**\n\n` +
        `• Sua taxa de economia atual: **${savingsRate}%**\n` +
        `• Economia mensal: **R$ ${(userFinancialData.monthlyIncome - userFinancialData.monthlyExpenses).toLocaleString('pt-BR')}**\n\n` +
        `**Recomendações:**\n` +
        `📍 ${savingsRate < 20 ? 'Tente economizar pelo menos 20% da sua renda' : 'Parabéns! Sua taxa de economia está boa'}\n` +
        `📍 Analise categorias onde pode reduzir gastos\n` +
        `📍 Considere criar um fundo de emergência de 6 meses de despesas`;
        
    } else if (lowerMessage.includes('investimento') || lowerMessage.includes('aplicação') || lowerMessage.includes('renda')) {
      response = `📈 **Oportunidades de Investimento:**\n\n` +
        `Com base no seu perfil, recomendo:\n\n` +
        `**1. Fundo de Emergência**\n` +
        `• Tesouro Selic ou CDB Liquidez Diária\n` +
        `• Valor sugerido: R$ ${(userFinancialData.monthlyExpenses * 6).toLocaleString('pt-BR')}\n\n` +
        `**2. Investimento Moderado**\n` +
        `• CDB/LCI/LCA de bancos médios\n` +
        `• Fundos Imobiliários diversificados\n` +
        `• Rentabilidade esperada: 8-12% ao ano\n\n` +
        `**3. Longo Prazo**\n` +
        `• ETFs de ações (BOVA11)\n` +
        `• Previdência Privada\n` +
        `• Rentabilidade esperada: 12-15% ao ano`;
        
    } else if (lowerMessage.includes('dívida') || lowerMessage.includes('divida') || lowerMessage.includes('emprestimo')) {
      const debtRatio = (userFinancialData.debts / userFinancialData.monthlyIncome * 100).toFixed(1);
      
      response = `🎯 **Estratégia para Quitar Dívidas:**\n\n` +
        `• Sua dívida representa **${debtRatio}%** da sua renda mensal\n` +
        `• Valor total: **R$ ${userFinancialData.debts.toLocaleString('pt-BR')}**\n\n` +
        `**Plano de Ação:**\n` +
        `1. **Método Avalanche**: Pague primeiro as dívidas com maiores juros\n` +
        `2. **Negocie taxas** com os credores\n` +
        `3. **Destine 30%** da sua economia mensal para quitar dívidas\n` +
        `4. **Tempo estimado**: ${Math.ceil(userFinancialData.debts / (userFinancialData.monthlyIncome * 0.3))} meses`;
        
    } else if (lowerMessage.includes('meta') || lowerMessage.includes('objetivo') || lowerMessage.includes('sonho')) {
      response = `🎯 **Planejamento para Suas Metas:**\n\n` +
        `**Meta:** ${userFinancialData.financialGoals}\n\n` +
        `**Como alcançar:**\n` +
        `1. **Defina o valor necessário** para sua meta\n` +
        `2. **Estabeleça um prazo** realista\n` +
        `3. **Calcule quanto precisa poupar** por mês\n` +
        `4. **Escolha investimentos** adequados ao prazo\n\n` +
        `💡 *Exemplo: Para juntar R$ 100.000 em 5 anos, você precisa economizar R$ 1.300 por mês com rendimento de 8% ao ano.*`;
        
    } else if (lowerMessage.includes('orçamento') || lowerMessage.includes('orcamento') || lowerMessage.includes('planejamento')) {
      const essentialExpenses = userFinancialData.monthlyExpenses * 0.5;
      const leisureExpenses = userFinancialData.monthlyExpenses * 0.3;
      const savingsAmount = userFinancialData.monthlyExpenses * 0.2;
      
      response = `📊 **Modelo de Orçamento 50-30-20:**\n\n` +
        `**50% Necessidades** (R$ ${essentialExpenses.toLocaleString('pt-BR')})\n` +
        `• Moradia, alimentação, transporte, saúde\n\n` +
        `**30% Desejos** (R$ ${leisureExpenses.toLocaleString('pt-BR')})\n` +
        `• Lazer, entretenimento, hobbies\n\n` +
        `**20% Economia** (R$ ${savingsAmount.toLocaleString('pt-BR')})\n` +
        `• Investimentos, fundo de emergência, metas\n\n` +
        `*Ajuste estas porcentagens conforme sua realidade!*`;
        
    } else if (lowerMessage.includes('aposentadoria') || lowerMessage.includes('futuro') || lowerMessage.includes('longo prazo')) {
      const monthlySavings = userFinancialData.monthlyIncome - userFinancialData.monthlyExpenses;
      const retirementGoal = userFinancialData.monthlyExpenses * 12 * 25; // Regra dos 25x
      const yearsToRetire = retirementGoal / (monthlySavings * 12);
      
      response = `🏖️ **Planejamento para Aposentadoria:**\n\n` +
        `**Meta sugerida**: R$ ${retirementGoal.toLocaleString('pt-BR')}\n` +
        `(25x suas despesas anuais - Regra dos 4%)\n\n` +
        `**Tempo estimado**: ${yearsToRetire.toFixed(1)} anos\n` +
        `**Economia mensal necessária**: R$ ${monthlySavings.toLocaleString('pt-BR')}\n\n` +
        `**Estratégia recomendada:**\n` +
        `• Aumente gradualmente sua taxa de economia\n` +
        `• Invista em ações e FIIs para longo prazo\n` +
        `• Considere previdência privada (PGBL/VGBL)`;
        
    } else {
      // Resposta genérica para mensagens não reconhecidas
      response = `🤖 **Assistente Financeira**\n\n` +
        `Entendi sua mensagem sobre: "${userMessage}"\n\n` +
        `Posso ajudar você com:\n` +
        `• 📊 **Análise de gastos** e orçamento\n` +
        `• 📈 **Recomendações de investimentos**\n` +
        `• 🎯 **Planejamento de metas** financeiras\n` +
        `• 💰 **Estratégias para quitar dívidas**\n` +
        `• 🏖️ **Plano de aposentadoria**\n\n` +
        `Me conte mais sobre o que você gostaria de saber!`;
    }

    setIsLoading(false);
    return response;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Adicionar mensagem do usuário
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Obter resposta da IA
    const aiResponse = await getAIResponse(inputMessage);
    
    const aiMessage = {
      id: Date.now() + 1,
      text: aiResponse,
      sender: 'ai',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
  };

  // Sugestões rápidas
  const quickSuggestions = [
    "Como posso economizar mais?",
    "Quais os melhores investimentos?",
    "Me ajude com minhas dívidas",
    "Planejar minha aposentadoria",
    "Analisar meus gastos mensais"
  ];

  const handleQuickSuggestion = (suggestion) => {
    setInputMessage(suggestion);
  };

  // Cards de insights financeiros
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
      {/* Header Componentizado */}
      <Header />

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.container}>
          
          {/* Header da IA */}
          <section className={styles.aiHeader}>
            <div className={styles.headerContent}>
              <div className={styles.titleSection}>
                <h1 className={styles.title}>
                  <FaRobot className={styles.titleIcon} />
                  Assistente Financeira IA
                </h1>
                <p className={styles.subtitle}>
                  Consultoria financeira inteligente e personalizada 24/7
                </p>
              </div>
              <div className={styles.insightsGrid}>
                {financialInsights.map((insight, index) => (
                  <div key={index} className={styles.insightCard}>
                    <div 
                      className={styles.insightIcon}
                      style={{ color: insight.color }}
                    >
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

          {/* Área de Chat */}
          <section className={styles.chatSection}>
            <div className={styles.chatContainer}>
              
              {/* Sugestões Rápidas */}
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

              {/* Área de Mensagens */}
              <div className={styles.messagesContainer}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`${styles.message} ${
                      message.sender === 'user' ? styles.userMessage : styles.aiMessage
                    }`}
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
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input de Mensagem */}
              <form onSubmit={handleSendMessage} className={styles.inputContainer}>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Digite sua pergunta sobre finanças..."
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

          {/* Recursos Adicionais */}
          <section className={styles.resourcesSection}>
            <h3>Recursos Financeiros</h3>
            <div className={styles.resourcesGrid}>
              <div className={styles.resourceCard}>
                <FaLightbulb className={styles.resourceIcon} />
                <h4>Dicas Inteligentes</h4>
                <p>Receba insights personalizados baseados no seu perfil financeiro</p>
              </div>
              <div className={styles.resourceCard}>
                <FaChartLine className={styles.resourceIcon} />
                <h4>Análise de Gastos</h4>
                <p>Identifique oportunidades de economia em seus hábitos</p>
              </div>
              <div className={styles.resourceCard}>
                <MdSavings className={styles.resourceIcon} />
                <h4>Projeções Futuras</h4>
                <p>Simule diferentes cenários para suas metas financeiras</p>
              </div>
              <div className={styles.resourceCard}>
                <FaPiggyBank className={styles.resourceIcon} />
                <h4>Educação Financeira</h4>
                <p>Aprenda conceitos importantes de forma simples e prática</p>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default AIQuestions;