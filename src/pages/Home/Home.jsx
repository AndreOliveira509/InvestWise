// src/pages/Home/Home.js
import { useState } from 'react';
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
  FaSignOutAlt
} from "react-icons/fa";
import { MdSavings, MdTrendingUp } from "react-icons/md";
import styles from "./Home.module.css";
import Sidebar from '../../components/Sidebar/Sidebar';
import ExpenseChart from '../../components/ExpenseChart/ExpenseChart';
import BudgetProgress from '../../components/BudgetProgress/BudgetProgress';

const Home = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(3000);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'alimentacao',
    date: new Date().toISOString().split('T')[0]
  });

  // Categorias de gastos com cores da identidade visual
  const categories = [
    { id: 'alimentacao', name: 'Alimentação', color: '#FFC107', icon: '🍽️' },
    { id: 'transporte', name: 'Transporte', color: '#FFA000', icon: '🚗' },
    { id: 'moradia', name: 'Moradia', color: '#FF8F00', icon: '🏠' },
    { id: 'lazer', name: 'Lazer', color: '#FF6F00', icon: '🎮' },
    { id: 'saude', name: 'Saúde', color: '#FFD54F', icon: '🏥' },
    { id: 'educacao', name: 'Educação', color: '#FFE082', icon: '📚' },
    { id: 'outros', name: 'Outros', color: '#FFF59D', icon: '📦' }
  ];

  // Calcular totais
  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  const remainingBudget = budget - totalExpenses;
  const budgetPercentage = (totalExpenses / budget) * 100;

  // Gastos por categoria
  const expensesByCategory = categories.map(category => ({
    ...category,
    total: expenses
      .filter(expense => expense.category === category.id)
      .reduce((sum, expense) => sum + parseFloat(expense.amount), 0)
  })).filter(cat => cat.total > 0);

  // Adicionar novo gasto
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpense.description || !newExpense.amount) return;

    const expense = {
      id: Date.now(),
      ...newExpense,
      amount: parseFloat(newExpense.amount)
    };

    setExpenses([...expenses, expense]);
    setNewExpense({
      description: '',
      amount: '',
      category: 'alimentacao',
      date: new Date().toISOString().split('T')[0]
    });
  };

  // Remover gasto
  const handleRemoveExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  // Verificar alertas
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

    // Verificar categoria com maior gasto
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

  // Estatísticas rápidas
  const quickStats = [
    {
      label: 'Gasto Hoje',
      value: 'R$ 85,00',
      change: '+12%',
      trend: 'up',
      icon: <FaArrowUp />
    },
    {
      label: 'Economia Mensal',
      value: 'R$ 450,00',
      change: '+8%',
      trend: 'up',
      icon: <FaArrowUp />
    },
    {
      label: 'Meta do Mês',
      value: '75%',
      change: '-5%',
      trend: 'down',
      icon: <FaArrowDown />
    }
  ];

  return (
    <div className={styles.home}>
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      {/* Main Content */}
      <div className={`${styles.mainContent} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        
        {/* Top Bar Minimalista */}
        <header className={styles.topBar}>
          <div className={styles.topBarContent}>
            <div className={styles.breadcrumb}>
              <button 
                className={styles.menuButton}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <FaBars />
              </button>
              <span className={styles.pageTitle}>Dashboard</span>
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

        {/* Dashboard Content */}
        <main className={styles.main}>
          <div className={styles.container}>
            
            {/* Resumo Financeiro */}
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
              
              <div className={styles.summaryCards}>
                <div className={styles.summaryCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardIconContainer}>
                      <FaMoneyBillWave className={styles.cardIcon} />
                    </div>
                    <div>
                      <h3>Orçamento Mensal</h3>
                      <div className={styles.cardAmount}>R$ {budget.toLocaleString('pt-BR')}</div>
                    </div>
                  </div>
                  <div className={styles.cardSubtitle}>Limite definido para este mês</div>
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
                    {budgetPercentage.toFixed(1)}% do orçamento utilizado
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
                      <h3>Economia do Mês</h3>
                      <div className={styles.cardAmount}>R$ 450,00</div>
                    </div>
                  </div>
                  <div className={styles.cardSubtitle}>+8% em relação ao mês anterior</div>
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

            {/* Gráficos e Visualizações */}
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
                  <ExpenseChart expensesByCategory={expensesByCategory} />
                </div>
                
                <div className={styles.chartCard}>
                  <div className={styles.chartHeader}>
                    <h3>Top Categorias</h3>
                    <span className={styles.chartPeriod}>Maiores gastos</span>
                  </div>
                  <div className={styles.categoriesList}>
                    {expensesByCategory
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
                    }
                  </div>
                </div>
              </div>
            </section>

            {/* Adicionar Gastos e Lista */}
            <div className={styles.expenseSection}>
              <div className={styles.expenseGrid}>
                
                {/* Adicionar Gastos */}
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
                    <h2>Gastos Recentes</h2>
                    <p>Últimas despesas registradas</p>
                  </div>
                  {expenses.length === 0 ? (
                    <div className={styles.emptyState}>
                      <MdSavings className={styles.emptyIcon} />
                      <p>Nenhum gasto registrado ainda.</p>
                      <small>Adicione seu primeiro gasto usando o formulário ao lado.</small>
                    </div>
                  ) : (
                    <div className={styles.expensesTable}>
                      {expenses
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .slice(0, 6)
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

            {/* Análise Detalhada */}
            <section className={styles.analysis}>
              <div className={styles.sectionHeader}>
                <h2>Análise Detalhada</h2>
                <p>Métricas importantes para seu controle financeiro</p>
              </div>
              <div className={styles.analysisGrid}>
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