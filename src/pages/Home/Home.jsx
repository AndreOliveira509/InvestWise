// src/pages/Home/Home.js
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { 
  FaMoneyBillWave, 
  FaExclamationTriangle, 
  FaPlus, 
  FaTrash,
  FaChartLine,
  FaPiggyBank,
  FaHome,
  FaChartPie,
  FaCalendar,
  FaArrowUp,
  FaArrowDown,
  FaUser,
  FaSignOutAlt,
  FaSearch,
  FaFilter,
  FaDollarSign,
  FaShoppingCart,
  FaUsers,
  FaEye
} from "react-icons/fa";
import { MdSavings, MdTrendingUp } from "react-icons/md";
import styles from "./Home.module.css";
import Sidebar from '../../components/Sidebar/Sidebar';
import PositiveAndNegativeBarChart from '../../components/PositiveAndNegativeBarChart/PositiveAndNegativeBarChart';
import CustomActiveShapePieChart from '../../components/CustomActiveShapePieChart/CustomActiveShapePieChart';
import SynchronizedLineChart from '../../components/SynchronizedLineChart/SynchronizedLineChart';

const Home = () => {
  const navigate = useNavigate();
  
  // Estados para controle da sidebar e dados
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(3000);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  
  // Estados para dados dinâmicos dos gráficos
  const [weeklyPerformance, setWeeklyPerformance] = useState([]);
  const [realTimeMetrics, setRealTimeMetrics] = useState([]);
  
  // Estado para novo gasto
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'alimentacao',
    date: new Date().toISOString().split('T')[0]
  });

  // Definição das categorias de gastos com cores e ícones
  const categories = [
    { id: 'alimentacao', name: 'Alimentação', color: '#FF6B6B', icon: '🍽️' },
    { id: 'transporte', name: 'Transporte', color: '#4ECDC4', icon: '🚗' },
    { id: 'moradia', name: 'Moradia', color: '#45B7D1', icon: '🏠' },
    { id: 'lazer', name: 'Lazer', color: '#FFA07A', icon: '🎮' },
    { id: 'saude', name: 'Saúde', color: '#98D8C8', icon: '🏥' },
    { id: 'educacao', name: 'Educação', color: '#F7DC6F', icon: '📚' },
    { id: 'outros', name: 'Outros', color: '#BB8FCE', icon: '📦' }
  ];

  // Efeito para carregar dados do localStorage
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    const savedBudget = localStorage.getItem('budget');
    
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedBudget) setBudget(parseFloat(savedBudget));
  }, []);

  // Efeito para salvar dados no localStorage
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('budget', JSON.stringify(budget));
  }, [expenses, budget]);

  // Efeito para gerar dados dinâmicos dos gráficos
  useEffect(() => {
    // Gerar dados iniciais
    generateWeeklyPerformance();
    generateRealTimeMetrics();

    // Atualizar dados em tempo real a cada 5 segundos
    const interval = setInterval(() => {
      updateRealTimeMetrics();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Função para gerar dados de desempenho semanal
  const generateWeeklyPerformance = () => {
    const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const performanceData = days.map(day => {
      const lucro = Math.floor(Math.random() * 2000) + 1000;
      const prejuizo = Math.random() > 0.7 ? Math.floor(Math.random() * 800) : 0;
      return { name: day, lucro, prejuizo };
    });
    setWeeklyPerformance(performanceData);
  };

  // Função para gerar métricas em tempo real iniciais
  const generateRealTimeMetrics = () => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'];
    const metricsData = months.map(month => {
      const visitas = Math.floor(Math.random() * 5000) + 2000;
      const conversoes = Math.floor(visitas * (Math.random() * 0.3 + 0.1));
      return { name: month, visitas, conversoes };
    });
    setRealTimeMetrics(metricsData);
  };

  // Função para atualizar métricas em tempo real
  const updateRealTimeMetrics = () => {
    setRealTimeMetrics(prev => {
      const newData = [...prev];
      const lastIndex = newData.length - 1;
      
      // Atualizar apenas o último mês para simular dados em tempo real
      newData[lastIndex] = {
        ...newData[lastIndex],
        visitas: Math.floor(Math.random() * 2000) + newData[lastIndex].visitas - 1000,
        conversoes: Math.floor(Math.random() * 500) + newData[lastIndex].conversoes - 250
      };
      
      return newData;
    });
  };

  // Filtragem e ordenação das despesas
  const filteredExpenses = expenses
    .filter(expense => {
      const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || expense.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date) - new Date(a.date);
        case 'amount':
          return b.amount - a.amount;
        case 'description':
          return a.description.localeCompare(b.description);
        default:
          return 0;
      }
    });

  // Cálculos de totais e percentuais
  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  const remainingBudget = budget - totalExpenses;
  const budgetPercentage = (totalExpenses / budget) * 100;

  // Agrupamento de gastos por categoria
  const expensesByCategory = categories.map(category => ({
    ...category,
    total: expenses
      .filter(expense => expense.category === category.id)
      .reduce((sum, expense) => sum + parseFloat(expense.amount), 0)
  })).filter(cat => cat.total > 0);

  // Dados para os gráficos
  const getChartData = () => {
    // Dados para PositiveAndNegativeBarChart - Desempenho Semanal
    const barChartData = weeklyPerformance;

    // Dados para CustomActiveShapePieChart - Distribuição de Gastos
    const pieChartData = expensesByCategory.length > 0 
      ? expensesByCategory.map(cat => ({
          name: cat.name,
          value: cat.total,
          color: cat.color
        }))
      : [
          { name: 'Alimentação', value: 400, color: '#FF6B6B' },
          { name: 'Transporte', value: 300, color: '#4ECDC4' },
          { name: 'Moradia', value: 300, color: '#45B7D1' },
          { name: 'Lazer', value: 200, color: '#FFA07A' },
        ];

    // Dados para SynchronizedLineChart - Métricas em Tempo Real
    const lineChartData = realTimeMetrics;

    return { barChartData, pieChartData, lineChartData };
  };

  const { barChartData, pieChartData, lineChartData } = getChartData();

  // Função para adicionar novo gasto
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpense.description || !newExpense.amount) return;

    const expense = {
      id: Date.now(),
      ...newExpense,
      amount: parseFloat(newExpense.amount)
    };

    setExpenses([expense, ...expenses]);
    
    setNewExpense({
      description: '',
      amount: '',
      category: 'alimentacao',
      date: new Date().toISOString().split('T')[0]
    });
  };

  // Função para remover gasto
  const handleRemoveExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  // Função para editar orçamento
  const handleBudgetEdit = () => {
    const newBudget = prompt('Digite o novo valor do orçamento:', budget);
    if (newBudget && !isNaN(newBudget)) {
      setBudget(parseFloat(newBudget));
    }
  };

  // Função para limpar filtros
  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterCategory('all');
    setSortBy('date');
  };

  // Função para gerar alertas baseados no orçamento
  const getBudgetAlerts = () => {
    const alerts = [];
    
    if (budgetPercentage >= 100) {
      alerts.push({
        type: 'error',
        message: 'Você ultrapassou seu orçamento mensal!',
        icon: <FaExclamationTriangle />
      });
    } else if (budgetPercentage >= 80) {
      alerts.push({
        type: 'warning',
        message: 'Cuidado! Você já gastou mais de 80% do seu orçamento.',
        icon: <FaExclamationTriangle />
      });
    }

    const maxCategory = expensesByCategory.reduce((max, cat) => 
      cat.total > max.total ? cat : max, { total: 0 }
    );
    
    if (maxCategory.total > budget * 0.4) {
      alerts.push({
        type: 'info',
        message: `A categoria ${maxCategory.name} está consumindo mais de 40% do seu orçamento.`,
        icon: <FaChartPie />
      });
    }

    return alerts;
  };

  const alerts = getBudgetAlerts();

  // Cálculo de estatísticas rápidas
  const todayExpenses = expenses
    .filter(exp => exp.date === new Date().toISOString().split('T')[0])
    .reduce((sum, exp) => sum + exp.amount, 0);

  // Estatísticas dinâmicas para os gráficos
  const weeklyProfit = weeklyPerformance.reduce((sum, day) => sum + day.lucro - day.prejuizo, 0);
  const totalVisits = realTimeMetrics.reduce((sum, month) => sum + month.visitas, 0);
  const totalConversions = realTimeMetrics.reduce((sum, month) => sum + month.conversoes, 0);
  const conversionRate = totalVisits > 0 ? (totalConversions / totalVisits * 100).toFixed(1) : 0;

  const quickStats = [
    {
      label: 'Gasto Hoje',
      value: `R$ ${todayExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: todayExpenses > 0 ? '+12%' : '0%',
      trend: todayExpenses > 0 ? 'up' : 'neutral',
      icon: todayExpenses > 0 ? <FaArrowUp /> : '→'
    },
    {
      label: 'Lucro Semanal',
      value: `R$ ${weeklyProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: weeklyProfit > 0 ? '+8%' : '-5%',
      trend: weeklyProfit > 0 ? 'up' : 'down',
      icon: weeklyProfit > 0 ? <FaArrowUp /> : <FaArrowDown />
    },
    {
      label: 'Taxa de Conversão',
      value: `${conversionRate}%`,
      change: conversionRate > 15 ? '+3%' : '-2%',
      trend: conversionRate > 15 ? 'up' : 'down',
      icon: conversionRate > 15 ? <FaArrowUp /> : <FaArrowDown />
    }
  ];

  return (
    <div className={styles.home}>
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      <div className={`${styles.mainContent} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        
        {/* Top Bar - SEM botão hamburger */}
        <header className={styles.topBar}>
          <div className={styles.topBarContent}>
            <div className={styles.breadcrumb}>
              <span className={styles.pageTitle}>Dashboard Financeiro</span>
            </div>
            <div className={styles.userActions}>
              <div className={styles.quickStats}>
                {quickStats.map((stat, index) => (
                  <div key={index} className={styles.quickStat}>
                    <span className={styles.statLabel}>{stat.label}</span>
                    <div className={styles.statValue}>
                      {stat.value}
                      <span className={`${styles.statChange} ${styles[stat.trend]}`}>
                        {stat.icon} {stat.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={styles.userInfo}>
                <div className={styles.userAvatar}>
                  <FaUser />
                </div>
                <div className={styles.userDetails}>
                  <span className={styles.userName}>Usuário</span>
                  <span className={styles.userPlan}>Premium</span>
                </div>
              </div>
              
              <button 
                className={styles.logoutButton}
                onClick={() => {
                  localStorage.removeItem('isAuthenticated');
                  navigate('/');
                }}
              >
                <FaSignOutAlt />
                Sair
              </button>
            </div>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <main className={styles.main}>
          <div className={styles.container}>
            
            {/* Seção de Resumo Financeiro */}
            <section className={styles.dashboard}>
              <div className={styles.sectionHeader}>
                <h1 className={styles.dashboardTitle}>
                  <FaHome className={styles.titleIcon} />
                  Visão Geral Financeira
                </h1>
                <div className={styles.dateInfo}>
                  <FaCalendar className={styles.dateIcon} />
                  {new Date().toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
              
              {/* Cards de Resumo */}
              <div className={styles.summaryCards}>
                <div className={styles.summaryCard} onClick={handleBudgetEdit} style={{cursor: 'pointer'}}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardIconContainer}>
                      <FaMoneyBillWave className={styles.cardIcon} />
                    </div>
                    <div>
                      <h3>Orçamento Mensal</h3>
                      <div className={styles.cardAmount}>R$ {budget.toLocaleString('pt-BR')}</div>
                    </div>
                  </div>
                  <div className={styles.cardSubtitle}>Clique para editar</div>
                </div>

                <div className={styles.summaryCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardIconContainer}>
                      <FaChartLine className={styles.cardIcon} />
                    </div>
                    <div>
                      <h3>Total Gasto</h3>
                      <div className={styles.cardAmount}>R$ {totalExpenses.toLocaleString('pt-BR')}</div>
                    </div>
                  </div>
                  <div className={styles.cardSubtitle}>
                    {budgetPercentage.toFixed(1)}% do orçamento
                  </div>
                </div>

                <div className={`${styles.summaryCard} ${
                  remainingBudget >= 0 ? styles.positive : styles.negative
                }`}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardIconContainer}>
                      <FaPiggyBank className={styles.cardIcon} />
                    </div>
                    <div>
                      <h3>Saldo Restante</h3>
                      <div className={styles.cardAmount}>
                        R$ {Math.abs(remainingBudget).toLocaleString('pt-BR')}
                      </div>
                    </div>
                  </div>
                  <div className={styles.cardSubtitle}>
                    {remainingBudget >= 0 ? 'Dentro do orçamento' : 'Orçamento excedido'}
                  </div>
                </div>

                <div className={styles.summaryCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardIconContainer}>
                      <MdTrendingUp className={styles.cardIcon} />
                    </div>
                    <div>
                      <h3>Conversões Totais</h3>
                      <div className={styles.cardAmount}>{totalConversions.toLocaleString('pt-BR')}</div>
                    </div>
                  </div>
                  <div className={styles.cardSubtitle}>
                    {conversionRate}% de taxa de conversão
                  </div>
                </div>
              </div>

              {/* Alertas */}
              {alerts.length > 0 && (
                <div className={styles.alerts}>
                  {alerts.map((alert, index) => (
                    <div key={index} className={`${styles.alert} ${styles[alert.type]}`}>
                      <div className={styles.alertIcon}>{alert.icon}</div>
                      <div className={styles.alertMessage}>{alert.message}</div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Seção de Gráficos Modernos - UM ABAIXO DO OUTRO */}
            <section className={styles.chartsSection}>
              <div className={styles.sectionHeader}>
                <h2>Análise Visual dos Dados</h2>
                <p>Métricas dinâmicas em tempo real atualizadas automaticamente</p>
              </div>

              <div className={styles.chartsGrid}>
                {/* Gráfico 1: Desempenho Semanal */}
                <div className={styles.chartCard}>
                  <div className={styles.chartHeader}>
                    <h3>
                      <FaChartLine className={styles.chartIcon} />
                      Desempenho Semanal
                    </h3>
                    <span className={styles.chartPeriod}>Esta semana</span>
                  </div>
                  <div className={styles.chartDescription}>
                    Variação de lucros e prejuízos ao longo da semana atual
                  </div>
                  <PositiveAndNegativeBarChart data={barChartData} />
                </div>

                {/* Gráfico 2: Distribuição de Gastos */}
                <div className={styles.chartCard}>
                  <div className={styles.chartHeader}>
                    <h3>
                      <FaChartPie className={styles.chartIcon} />
                      Distribuição de Gastos
                    </h3>
                    <span className={styles.chartPeriod}>Por categoria</span>
                  </div>
                  <div className={styles.chartDescription}>
                    Percentual de gastos por categoria mensal
                  </div>
                  <CustomActiveShapePieChart data={pieChartData} />
                </div>

                {/* Gráfico 3: Métricas em Tempo Real */}
                <div className={styles.chartCard}>
                  <div className={styles.chartHeader}>
                    <h3>
                      <MdTrendingUp className={styles.chartIcon} />
                      Métricas em Tempo Real
                    </h3>
                    <span className={styles.chartPeriod}>
                      <span className={styles.liveDot}></span>
                      Ao vivo
                    </span>
                  </div>
                  <div className={styles.chartDescription}>
                    Comparação entre visitas e conversões (atualiza a cada 5s)
                  </div>
                  <SynchronizedLineChart data={lineChartData} />
                </div>
              </div>
            </section>

            {/* Seção de Gestão de Gastos */}
            <div className={styles.expenseSection}>
              <div className={styles.expenseGrid}>
                
                {/* Formulário para Adicionar Gastos */}
                <section className={styles.addExpense}>
                  <div className={styles.sectionHeader}>
                    <h2>Adicionar Novo Gasto</h2>
                    <p>Registre suas despesas para manter o controle</p>
                  </div>
                  <form onSubmit={handleAddExpense} className={styles.expenseForm}>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Descrição</label>
                        <input
                          type="text"
                          value={newExpense.description}
                          onChange={(e) => setNewExpense({
                            ...newExpense,
                            description: e.target.value
                          })}
                          placeholder="Ex: Almoço, Uber, Conta de luz..."
                          required
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label>Valor (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={newExpense.amount}
                          onChange={(e) => setNewExpense({
                            ...newExpense,
                            amount: e.target.value
                          })}
                          placeholder="0,00"
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Categoria</label>
                        <select
                          value={newExpense.category}
                          onChange={(e) => setNewExpense({
                            ...newExpense,
                            category: e.target.value
                          })}
                        >
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.icon} {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label>Data</label>
                        <input
                          type="date"
                          value={newExpense.date}
                          onChange={(e) => setNewExpense({
                            ...newExpense,
                            date: e.target.value
                          })}
                        />
                      </div>
                    </div>

                    <button type="submit" className={styles.addButton}>
                      <FaPlus />
                      Adicionar Gasto
                    </button>
                  </form>
                </section>

                {/* Lista de Gastos */}
                <section className={styles.expensesList}>
                  <div className={styles.sectionHeader}>
                    <div className={styles.expensesHeader}>
                      <div>
                        <h2>Gastos Recentes</h2>
                        <p>Últimas despesas registradas</p>
                      </div>
                      <div className={styles.filterControls}>
                        <div className={styles.searchBox}>
                          <FaSearch className={styles.searchIcon} />
                          <input
                            type="text"
                            placeholder="Buscar gastos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                          />
                          {searchTerm && (
                            <button 
                              className={styles.clearButton}
                              onClick={() => setSearchTerm('')}
                            >
                              ×
                            </button>
                          )}
                        </div>
                        
                        <div className={styles.filterGroup}>
                          <FaFilter className={styles.filterIcon} />
                          <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className={styles.filterSelect}
                          >
                            <option value="all">Todas categorias</option>
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className={styles.sortSelect}
                        >
                          <option value="date">Ordenar por data</option>
                          <option value="amount">Ordenar por valor</option>
                          <option value="description">Ordenar por nome</option>
                        </select>

                        {(searchTerm || filterCategory !== 'all') && (
                          <button 
                            className={styles.clearFiltersButton}
                            onClick={handleClearFilters}
                          >
                            Limpar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {filteredExpenses.length === 0 ? (
                    <div className={styles.emptyState}>
                      <MdSavings className={styles.emptyIcon} />
                      <p>
                        {expenses.length === 0 
                          ? 'Nenhum gasto registrado ainda.' 
                          : 'Nenhum gasto encontrado com os filtros atuais.'
                        }
                      </p>
                      <small>
                        {expenses.length === 0 
                          ? 'Adicione seu primeiro gasto usando o formulário ao lado.' 
                          : 'Tente ajustar os filtros de busca.'
                        }
                      </small>
                    </div>
                  ) : (
                    <div className={styles.expensesTable}>
                      <div className={styles.expensesSummary}>
                        Mostrando {filteredExpenses.length} de {expenses.length} gastos
                        {(searchTerm || filterCategory !== 'all') && (
                          <span className={styles.activeFilters}>
                            • Filtros ativos
                          </span>
                        )}
                      </div>
                      {filteredExpenses
                        .slice(0, 8)
                        .map(expense => {
                          const category = categories.find(cat => cat.id === expense.category);
                          return (
                            <div key={expense.id} className={styles.expenseItem}>
                              <div className={styles.expenseInfo}>
                                <span 
                                  className={styles.expenseColor}
                                  style={{ backgroundColor: category.color }}
                                ></span>
                                <div className={styles.expenseDetails}>
                                  <div className={styles.expenseDescription}>
                                    {expense.description}
                                  </div>
                                  <div className={styles.expenseMeta}>
                                    <span className={styles.expenseCategory}>
                                      {category.icon} {category.name}
                                    </span>
                                    <span className={styles.expenseDate}>
                                      {new Date(expense.date).toLocaleDateString('pt-BR')}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className={styles.expenseAmount}>
                                <div className={styles.amount}>R$ {expense.amount.toLocaleString('pt-BR')}</div>
                                <button
                                  onClick={() => handleRemoveExpense(expense.id)}
                                  className={styles.deleteButton}
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      }
                    </div>
                  )}
                </section>

              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;