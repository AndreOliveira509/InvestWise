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
  FaBars,
  FaHome,
  FaChartPie,
  FaCalendar,
  FaArrowUp,
  FaArrowDown,
  FaUser,
  FaSignOutAlt,
  FaSearch,
  FaFilter
} from "react-icons/fa";
import { MdSavings, MdTrendingUp } from "react-icons/md";
import styles from "./Home.module.css";
import Sidebar from '../../components/Sidebar/Sidebar';
import ExpenseChart from '../../components/ExpenseChart/ExpenseChart';
import BudgetProgress from '../../components/BudgetProgress/BudgetProgress';

const Home = () => {
  const navigate = useNavigate();
  
  // Estados para controle da sidebar e dados
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expenses, setExpenses] = useState([]); // Array de despesas
  const [budget, setBudget] = useState(3000); // Orçamento mensal
  const [searchTerm, setSearchTerm] = useState(''); // Termo de busca
  const [filterCategory, setFilterCategory] = useState('all'); // Filtro por categoria
  const [sortBy, setSortBy] = useState('date'); // Ordenação
  
  // Estado para novo gasto
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'alimentacao',
    date: new Date().toISOString().split('T')[0] // Data atual como padrão
  });

  // Definição das categorias de gastos com cores e ícones
  const categories = [
    { id: 'alimentacao', name: 'Alimentação', color: '#FFC107', icon: '🍽️' },
    { id: 'transporte', name: 'Transporte', color: '#FFA000', icon: '🚗' },
    { id: 'moradia', name: 'Moradia', color: '#FF8F00', icon: '🏠' },
    { id: 'lazer', name: 'Lazer', color: '#FF6F00', icon: '🎮' },
    { id: 'saude', name: 'Saúde', color: '#FFD54F', icon: '🏥' },
    { id: 'educacao', name: 'Educação', color: '#FFE082', icon: '📚' },
    { id: 'outros', name: 'Outros', color: '#FFF59D', icon: '📦' }
  ];

  // Efeito para carregar dados do localStorage ao montar o componente
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    const savedBudget = localStorage.getItem('budget');
    
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedBudget) setBudget(parseFloat(savedBudget));
  }, []);

  // Efeito para salvar dados no localStorage quando expenses ou budget mudam
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('budget', JSON.stringify(budget));
  }, [expenses, budget]);

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
          return new Date(b.date) - new Date(a.date); // Mais recentes primeiro
        case 'amount':
          return b.amount - a.amount; // Maiores valores primeiro
        case 'description':
          return a.description.localeCompare(b.description); // Ordem alfabética
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
  })).filter(cat => cat.total > 0); // Filtra apenas categorias com gastos

  // Função para adicionar novo gasto
  const handleAddExpense = (e) => {
    e.preventDefault();
    // Validação de campos obrigatórios
    if (!newExpense.description || !newExpense.amount) return;

    const expense = {
      id: Date.now(), // ID único baseado no timestamp
      ...newExpense,
      amount: parseFloat(newExpense.amount)
    };

    // Adiciona nova despesa no início do array
    setExpenses([expense, ...expenses]);
    
    // Reseta o formulário
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
    
    // Alerta de orçamento ultrapassado
    if (budgetPercentage >= 100) {
      alerts.push({
        type: 'error',
        message: 'Você ultrapassou seu orçamento mensal!',
        icon: <FaExclamationTriangle />
      });
    } else if (budgetPercentage >= 80) {
      // Alerta de orçamento próximo do limite
      alerts.push({
        type: 'warning',
        message: 'Cuidado! Você já gastou mais de 80% do seu orçamento.',
        icon: <FaExclamationTriangle />
      });
    }

    // Verifica categoria com maior gasto
    const maxCategory = expensesByCategory.reduce((max, cat) => 
      cat.total > max.total ? cat : max, { total: 0 }
    );
    
    // Alerta se alguma categoria está consumindo mais de 40% do orçamento
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

  // Dados para as estatísticas rápidas
  const quickStats = [
    {
      label: 'Gasto Hoje',
      value: `R$ ${todayExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: todayExpenses > 0 ? '+12%' : '0%',
      trend: todayExpenses > 0 ? 'up' : 'neutral',
      icon: todayExpenses > 0 ? <FaArrowUp /> : '→'
    },
    {
      label: 'Economia Mensal',
      value: `R$ ${Math.max(0, remainingBudget).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: remainingBudget >= 0 ? '+8%' : '-15%',
      trend: remainingBudget >= 0 ? 'up' : 'down',
      icon: remainingBudget >= 0 ? <FaArrowUp /> : <FaArrowDown />
    },
    {
      label: 'Meta do Mês',
      value: `${Math.min(100, budgetPercentage).toFixed(0)}%`,
      change: budgetPercentage <= 80 ? '+5%' : '-12%',
      trend: budgetPercentage <= 80 ? 'up' : 'down',
      icon: budgetPercentage <= 80 ? <FaArrowUp /> : <FaArrowDown />
    }
  ];

  return (
    <div className={styles.home}>
      {/* Sidebar com controle de estado */}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      {/* Conteúdo Principal */}
      <div className={`${styles.mainContent} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        
        {/* Top Bar Minimalista */}
        <header className={styles.topBar}>
          <div className={styles.topBarContent}>
            <div className={styles.breadcrumb}>
              {/* Botão de menu para abrir/fechar a sidebar */}
              <button 
                className={styles.menuButton}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <FaBars />
              </button>
              <span className={styles.pageTitle}>Dashboard</span>
            </div>
            <div className={styles.userActions}>
              {/* Estatísticas Rápidas */}
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
              
              {/* Informações do Usuário */}
              <div className={styles.userInfo}>
                <div className={styles.userAvatar}>
                  <FaUser />
                </div>
                <div className={styles.userDetails}>
                  <span className={styles.userName}>Usuário</span>
                  <span className={styles.userPlan}>Premium</span>
                </div>
              </div>
              
              {/* Botão de Logout */}
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

        {/* Conteúdo do Dashboard */}
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
                  {/* Data atual formatada */}
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
                {/* Card de Orçamento Mensal (clicável para editar) */}
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

                {/* Card de Total Gasto */}
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
                    {budgetPercentage.toFixed(1)}% do orçamento utilizado
                  </div>
                </div>

                {/* Card de Saldo Restante */}
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

                {/* Card de Economia do Mês */}
                <div className={styles.summaryCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardIconContainer}>
                      <MdTrendingUp className={styles.cardIcon} />
                    </div>
                    <div>
                      <h3>Economia do Mês</h3>
                      <div className={styles.cardAmount}>R$ {Math.max(0, remainingBudget).toLocaleString('pt-BR')}</div>
                    </div>
                  </div>
                  <div className={styles.cardSubtitle}>
                    {remainingBudget >= 0 ? 'Saldo positivo' : 'Saldo negativo'}
                  </div>
                </div>
              </div>

              {/* Barra de Progresso do Orçamento */}
              <div className={styles.budgetProgress}>
                <BudgetProgress 
                  spent={totalExpenses}
                  budget={budget}
                  percentage={budgetPercentage}
                />
              </div>

              {/* Seção de Alertas */}
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

            {/* Seção de Gráficos e Visualizações */}
            <section className={styles.charts}>
              <div className={styles.sectionHeader}>
                <h2>Análise de Gastos</h2>
                <p>Visualize a distribuição dos seus gastos por categoria</p>
              </div>
              <div className={styles.chartsGrid}>
                <div className={styles.chartCard}>
                  <div className={styles.chartHeader}>
                    <h3>Distribuição por Categoria</h3>
                    <span className={styles.chartPeriod}>Este mês</span>
                  </div>
                  {/* Componente do gráfico atualizado */}
                  <ExpenseChart 
                    expensesByCategory={expensesByCategory} 
                    hasData={expensesByCategory.length > 0}
                  />
                </div>
                
                <div className={styles.chartCard}>
                  <div className={styles.chartHeader}>
                    <h3>Top Categorias</h3>
                    <span className={styles.chartPeriod}>Maiores gastos</span>
                  </div>
                  <div className={styles.categoriesList}>
                    {expensesByCategory.length > 0 ? (
                      expensesByCategory
                        .sort((a, b) => b.total - a.total)
                        .slice(0, 5)
                        .map((category, index) => (
                          <div key={category.id} className={styles.categoryItem}>
                            <div className={styles.categoryInfo}>
                              <span 
                                className={styles.categoryColor}
                                style={{ backgroundColor: category.color }}
                              ></span>
                              <span className={styles.categoryName}>
                                {category.icon} {category.name}
                              </span>
                            </div>
                            <div className={styles.categoryAmount}>
                              R$ {category.total.toLocaleString('pt-BR')}
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className={styles.emptyState}>
                        <MdSavings className={styles.emptyIcon} />
                        <p>Nenhum gasto registrado</p>
                        <small>Adicione gastos para ver as categorias</small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Seção de Adicionar Gastos e Lista */}
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

                {/* Lista de Gastos com Filtros */}
                <section className={styles.expensesList}>
                  <div className={styles.sectionHeader}>
                    <div className={styles.expensesHeader}>
                      <div>
                        <h2>Gastos Recentes</h2>
                        <p>Últimas despesas registradas</p>
                      </div>
                      {/* Controles de Filtro e Ordenação */}
                      <div className={styles.filterControls}>
                        {/* Campo de Busca */}
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
                        
                        {/* Filtro por Categoria */}
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

                        {/* Ordenação */}
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className={styles.sortSelect}
                        >
                          <option value="date">Ordenar por data</option>
                          <option value="amount">Ordenar por valor</option>
                          <option value="description">Ordenar por nome</option>
                        </select>

                        {/* Botão para limpar filtros (só aparece quando há filtros ativos) */}
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

                  {/* Lista de Gastos ou Estado Vazio */}
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
                      {/* Resumo dos resultados filtrados */}
                      <div className={styles.expensesSummary}>
                        Mostrando {filteredExpenses.length} de {expenses.length} gastos
                        {(searchTerm || filterCategory !== 'all') && (
                          <span className={styles.activeFilters}>
                            • Filtros ativos
                          </span>
                        )}
                      </div>
                      {/* Lista dos 8 primeiros gastos filtrados */}
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

            {/* Seção de Análise Detalhada */}
            <section className={styles.analysis}>
              <div className={styles.sectionHeader}>
                <h2>Análise Detalhada</h2>
                <p>Métricas importantes para seu controle financeiro</p>
              </div>
              <div className={styles.analysisGrid}>
                {/* Card de Média de Gastos Diários */}
                <div className={styles.analysisCard}>
                  <div className={styles.analysisIcon}>
                    <FaChartLine />
                  </div>
                  <h4>Média de Gastos Diários</h4>
                  <div className={styles.analysisValue}>
                    R$ {(totalExpenses / 30).toFixed(2)}
                  </div>
                  <small>Baseado em 30 dias</small>
                </div>

                {/* Card de Dias Restantes */}
                <div className={styles.analysisCard}>
                  <div className={styles.analysisIcon}>
                    <FaCalendar />
                  </div>
                  <h4>Dias Restantes no Mês</h4>
                  <div className={styles.analysisValue}>
                    {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate()}
                  </div>
                  <small>Dias para controlar gastos</small>
                </div>

                {/* Card de Gasto por Dia Restante */}
                <div className={styles.analysisCard}>
                  <div className={styles.analysisIcon}>
                    <FaPiggyBank />
                  </div>
                  <h4>Gasto por Dia Restante</h4>
                  <div className={styles.analysisValue}>
                    R$ {remainingBudget > 0 ? (remainingBudget / (30 - new Date().getDate())).toFixed(2) : '0.00'}
                  </div>
                  <small>Para manter o orçamento</small>
                </div>

                {/* Card de Projeção do Mês */}
                <div className={styles.analysisCard}>
                  <div className={styles.analysisIcon}>
                    <MdTrendingUp />
                  </div>
                  <h4>Projeção do Mês</h4>
                  <div className={styles.analysisValue}>
                    R$ {(totalExpenses / new Date().getDate() * 30).toFixed(2)}
                  </div>
                  <small>Baseado no ritmo atual</small>
                </div>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;