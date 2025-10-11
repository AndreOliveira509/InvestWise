// src/pages/Simulation/Simulation.js
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { 
  FaCalculator,
  FaChartLine,
  FaPiggyBank,
  FaLightbulb,
  FaMoneyBillWave,
  FaCalendar,
  FaChartPie,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown,
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaBullseye
} from "react-icons/fa";
import { MdSavings, MdTrendingUp, MdShowChart } from "react-icons/md";
import styles from "./Simulation.module.css";
import Header from '../../components/Header/Header';

const Simulation = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('setup');
  const [isEditingBudget, setIsEditingBudget] = useState(false);

  // Dados da simulação
  const [simulationData, setSimulationData] = useState({
    monthlyIncome: 5000,
    monthlyBudget: 3000,
    savingsGoal: 10000,
    timeframe: 12,
    expenses: [
      { id: 1, category: 'Moradia', amount: 1200, percentage: 40 },
      { id: 2, category: 'Alimentação', amount: 600, percentage: 20 },
      { id: 3, category: 'Transporte', amount: 300, percentage: 10 },
      { id: 4, category: 'Lazer', amount: 300, percentage: 10 },
      { id: 5, category: 'Saúde', amount: 200, percentage: 7 },
      { id: 6, category: 'Educação', amount: 200, percentage: 7 },
      { id: 7, category: 'Outros', amount: 200, percentage: 7 }
    ]
  });

  const [customExpenses, setCustomExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ category: '', amount: '' });

  // Resultados da simulação
  const [simulationResults, setSimulationResults] = useState({
    totalExpenses: 0,
    monthlySavings: 0,
    timeToGoal: 0,
    projectedSavings: [],
    alerts: [],
    recommendations: []
  });

  // Calcular simulação
  const calculateSimulation = () => {
    const totalExpenses = simulationData.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const monthlySavings = simulationData.monthlyIncome - totalExpenses;
    const timeToGoal = simulationData.savingsGoal / monthlySavings;
    
    // Projeção de economia
    const projectedSavings = [];
    let currentSavings = 0;
    for (let i = 0; i < simulationData.timeframe; i++) {
      currentSavings += monthlySavings;
      projectedSavings.push({
        month: i + 1,
        savings: currentSavings
      });
    }

    // Alertas
    const alerts = [];
    if (totalExpenses > simulationData.monthlyBudget) {
      alerts.push({
        type: 'warning',
        message: `Você está gastando R$ ${(totalExpenses - simulationData.monthlyBudget).toLocaleString('pt-BR')} a mais do que seu orçamento mensal.`,
        icon: <FaExclamationTriangle />
      });
    }

    if (monthlySavings < 0) {
      alerts.push({
        type: 'error',
        message: 'Suas despesas estão maiores que sua renda!',
        icon: <FaExclamationTriangle />
      });
    }

    // Recomendações
    const recommendations = [];
    const highestExpense = simulationData.expenses.reduce((max, expense) => 
      expense.amount > max.amount ? expense : max
    );
    
    if (highestExpense.percentage > 30) {
      recommendations.push(`Considere reduzir gastos com ${highestExpense.category.toLowerCase()} (${highestExpense.percentage}% da sua renda)`);
    }

    if (monthlySavings / simulationData.monthlyIncome < 0.2) {
      recommendations.push('Tente economizar pelo menos 20% da sua renda mensal');
    }

    setSimulationResults({
      totalExpenses,
      monthlySavings,
      timeToGoal,
      projectedSavings,
      alerts,
      recommendations
    });
  };

  useEffect(() => {
    calculateSimulation();
  }, [simulationData]);

  // Handlers
  const handleInputChange = (field, value) => {
    setSimulationData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const handleExpenseChange = (id, field, value) => {
    setSimulationData(prev => ({
      ...prev,
      expenses: prev.expenses.map(expense =>
        expense.id === id ? { ...expense, [field]: parseFloat(value) || 0 } : expense
      )
    }));
  };

  const handleAddCustomExpense = (e) => {
    e.preventDefault();
    if (!newExpense.category || !newExpense.amount) return;

    const expense = {
      id: Date.now(),
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      percentage: (parseFloat(newExpense.amount) / simulationData.monthlyIncome * 100).toFixed(1)
    };

    setCustomExpenses([...customExpenses, expense]);
    setNewExpense({ category: '', amount: '' });
  };

  const handleRemoveCustomExpense = (id) => {
    setCustomExpenses(customExpenses.filter(expense => expense.id !== id));
  };

  const tabs = [
    { id: 'setup', label: 'Configurar Simulação', icon: <FaCalculator /> },
    { id: 'results', label: 'Resultados', icon: <FaChartLine /> },
    { id: 'projection', label: 'Projeção Futura', icon: <MdShowChart /> },
    { id: 'analysis', label: 'Análise Detalhada', icon: <FaLightbulb /> }
  ];

  return (
    <div className={styles.simulation}>
      {/* Header Componentizado */}
      <Header />

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.container}>
          
          {/* Header da Simulação */}
          <section className={styles.simulationHeader}>
            <h1 className={styles.title}>
              <FaCalculator className={styles.titleIcon} />
              Simulador Financeiro Inteligente
            </h1>
            <p className={styles.subtitle}>
              Planeje seu futuro financeiro com projeções precisas e insights personalizados
            </p>
          </section>

          {/* Abas de Navegação */}
          <section className={styles.tabsSection}>
            <div className={styles.tabs}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className={styles.tabIcon}>{tab.icon}</span>
                  <span className={styles.tabLabel}>{tab.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Conteúdo das Abas */}
          <section className={styles.tabContent}>
            
            {/* Configuração da Simulação */}
            {activeTab === 'setup' && (
              <div className={styles.setupTab}>
                <div className={styles.setupGrid}>
                  
                  {/* Configurações Básicas */}
                  <div className={styles.configCard}>
                    <h3>
                      <FaMoneyBillWave className={styles.cardTitleIcon} />
                      Configurações Financeiras
                    </h3>
                    <div className={styles.inputGroup}>
                      <label>Renda Mensal (R$)</label>
                      <input
                        type="number"
                        value={simulationData.monthlyIncome}
                        onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                        placeholder="5000"
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>
                        Orçamento Mensal (R$)
                        <button 
                          className={styles.editButton}
                          onClick={() => setIsEditingBudget(!isEditingBudget)}
                        >
                          {isEditingBudget ? <FaSave /> : <FaEdit />}
                        </button>
                      </label>
                      {isEditingBudget ? (
                        <input
                          type="number"
                          value={simulationData.monthlyBudget}
                          onChange={(e) => handleInputChange('monthlyBudget', e.target.value)}
                          placeholder="3000"
                        />
                      ) : (
                        <div className={styles.budgetDisplay}>
                          R$ {simulationData.monthlyBudget.toLocaleString('pt-BR')}
                        </div>
                      )}
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Meta de Economia (R$)</label>
                      <input
                        type="number"
                        value={simulationData.savingsGoal}
                        onChange={(e) => handleInputChange('savingsGoal', e.target.value)}
                        placeholder="10000"
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Período de Projeção (meses)</label>
                      <input
                        type="number"
                        value={simulationData.timeframe}
                        onChange={(e) => handleInputChange('timeframe', e.target.value)}
                        placeholder="12"
                      />
                    </div>
                  </div>

                  {/* Distribuição de Gastos */}
                  <div className={styles.expensesCard}>
                    <h3>
                      <FaChartPie className={styles.cardTitleIcon} />
                      Distribuição de Gastos Mensais
                    </h3>
                    <div className={styles.expensesList}>
                      {simulationData.expenses.map(expense => (
                        <div key={expense.id} className={styles.expenseItem}>
                          <div className={styles.expenseInfo}>
                            <span className={styles.expenseCategory}>{expense.category}</span>
                            <span className={styles.expensePercentage}>({expense.percentage}%)</span>
                          </div>
                          <div className={styles.expenseInput}>
                            <span className={styles.currency}>R$</span>
                            <input
                              type="number"
                              value={expense.amount}
                              onChange={(e) => handleExpenseChange(expense.id, 'amount', e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Gastos Customizados */}
                  <div className={styles.customExpensesCard}>
                    <h3>
                      <FaPlus className={styles.cardTitleIcon} />
                      Gastos Adicionais
                    </h3>
                    <form onSubmit={handleAddCustomExpense} className={styles.addExpenseForm}>
                      <div className={styles.formRow}>
                        <input
                          type="text"
                          value={newExpense.category}
                          onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                          placeholder="Categoria (ex: Academia, Streaming...)"
                        />
                        <input
                          type="number"
                          value={newExpense.amount}
                          onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                          placeholder="Valor"
                        />
                        <button type="submit" className={styles.addButton}>
                          <FaPlus />
                        </button>
                      </div>
                    </form>
                    <div className={styles.customExpensesList}>
                      {customExpenses.map(expense => (
                        <div key={expense.id} className={styles.customExpenseItem}>
                          <div className={styles.expenseInfo}>
                            <span className={styles.expenseCategory}>{expense.category}</span>
                            <span className={styles.expensePercentage}>({expense.percentage}%)</span>
                          </div>
                          <div className={styles.expenseActions}>
                            <span className={styles.expenseAmount}>
                              R$ {expense.amount.toLocaleString('pt-BR')}
                            </span>
                            <button
                              onClick={() => handleRemoveCustomExpense(expense.id)}
                              className={styles.deleteButton}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resumo Rápido */}
                  <div className={styles.quickSummary}>
                    <h3>
                      <MdTrendingUp className={styles.cardTitleIcon} />
                      Resumo da Simulação
                    </h3>
                    <div className={styles.summaryItems}>
                      <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Total de Gastos:</span>
                        <span className={styles.summaryValue}>
                          R$ {simulationResults.totalExpenses.toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Economia Mensal:</span>
                        <span className={`${styles.summaryValue} ${
                          simulationResults.monthlySavings >= 0 ? styles.positive : styles.negative
                        }`}>
                          R$ {Math.abs(simulationResults.monthlySavings).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Tempo para Meta:</span>
                        <span className={styles.summaryValue}>
                          {simulationResults.timeToGoal > 0 ? 
                            `${Math.ceil(simulationResults.timeToGoal)} meses` : 
                            'Meta não alcançável'
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Resultados da Simulação */}
            {activeTab === 'results' && (
              <div className={styles.resultsTab}>
                <div className={styles.resultsGrid}>
                  
                  {/* Métricas Principais */}
                  <div className={styles.metricsCard}>
                    <h3>Métricas Financeiras</h3>
                    <div className={styles.metricsGrid}>
                      <div className={styles.metric}>
                        <div className={styles.metricIcon}>
                          <FaMoneyBillWave />
                        </div>
                        <div className={styles.metricInfo}>
                          <span className={styles.metricValue}>
                            R$ {simulationResults.monthlySavings.toLocaleString('pt-BR')}
                          </span>
                          <span className={styles.metricLabel}>Economia Mensal</span>
                        </div>
                      </div>
                      <div className={styles.metric}>
                        <div className={styles.metricIcon}>
                          <FaPiggyBank />
                        </div>
                        <div className={styles.metricInfo}>
                          <span className={styles.metricValue}>
                            {simulationResults.timeToGoal > 0 ? 
                              `${Math.ceil(simulationResults.timeToGoal)} meses` : 
                              '---'
                            }
                          </span>
                          <span className={styles.metricLabel}>Tempo para Meta</span>
                        </div>
                      </div>
                      <div className={styles.metric}>
                        <div className={styles.metricIcon}>
                          <FaChartLine />
                        </div>
                        <div className={styles.metricInfo}>
                          <span className={styles.metricValue}>
                            {((simulationResults.monthlySavings / simulationData.monthlyIncome) * 100).toFixed(1)}%
                          </span>
                          <span className={styles.metricLabel}>Taxa de Economia</span>
                        </div>
                      </div>
                      <div className={styles.metric}>
                        <div className={styles.metricIcon}>
                          <FaBullseye />
                        </div>
                        <div className={styles.metricInfo}>
                          <span className={styles.metricValue}>
                            {simulationResults.projectedSavings[simulationResults.projectedSavings.length - 1]?.savings.toLocaleString('pt-BR') || 0}
                          </span>
                          <span className={styles.metricLabel}>Projeção Final</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Alertas e Recomendações */}
                  <div className={styles.alertsCard}>
                    <h3>Alertas e Insights</h3>
                    <div className={styles.alertsList}>
                      {simulationResults.alerts.map((alert, index) => (
                        <div key={index} className={`${styles.alert} ${styles[alert.type]}`}>
                          <div className={styles.alertIcon}>{alert.icon}</div>
                          <div className={styles.alertMessage}>{alert.message}</div>
                        </div>
                      ))}
                      {simulationResults.recommendations.map((recommendation, index) => (
                        <div key={index} className={styles.recommendation}>
                          <FaLightbulb className={styles.recommendationIcon} />
                          <div className={styles.recommendationText}>{recommendation}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Comparação Orçamento vs Realidade */}
                  <div className={styles.comparisonCard}>
                    <h3>Orçamento vs Realidade</h3>
                    <div className={styles.comparisonGrid}>
                      <div className={styles.comparisonItem}>
                        <span className={styles.comparisonLabel}>Orçamento Mensal</span>
                        <span className={styles.comparisonValue}>
                          R$ {simulationData.monthlyBudget.toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <div className={styles.comparisonItem}>
                        <span className={styles.comparisonLabel}>Gastos Totais</span>
                        <span className={styles.comparisonValue}>
                          R$ {simulationResults.totalExpenses.toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <div className={styles.comparisonItem}>
                        <span className={styles.comparisonLabel}>Diferença</span>
                        <span className={`${styles.comparisonValue} ${
                          simulationData.monthlyBudget >= simulationResults.totalExpenses ? 
                          styles.positive : styles.negative
                        }`}>
                          R$ {Math.abs(simulationData.monthlyBudget - simulationResults.totalExpenses).toLocaleString('pt-BR')}
                          {simulationData.monthlyBudget >= simulationResults.totalExpenses ? 
                            <FaArrowDown className={styles.comparisonIcon} /> : 
                            <FaArrowUp className={styles.comparisonIcon} />
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Distribuição de Gastos */}
                  <div className={styles.distributionCard}>
                    <h3>Distribuição dos Gastos</h3>
                    <div className={styles.distributionList}>
                      {[...simulationData.expenses, ...customExpenses].map((expense, index) => (
                        <div key={expense.id || index} className={styles.distributionItem}>
                          <div className={styles.distributionInfo}>
                            <span className={styles.distributionCategory}>{expense.category}</span>
                            <span className={styles.distributionPercentage}>
                              ({((expense.amount / simulationData.monthlyIncome) * 100).toFixed(1)}%)
                            </span>
                          </div>
                          <div className={styles.distributionBar}>
                            <div 
                              className={styles.distributionFill}
                              style={{ 
                                width: `${(expense.amount / simulationResults.totalExpenses) * 100}%`,
                                backgroundColor: `hsl(${index * 50}, 70%, 50%)`
                              }}
                            ></div>
                          </div>
                          <span className={styles.distributionAmount}>
                            R$ {expense.amount.toLocaleString('pt-BR')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Projeção Futura */}
            {activeTab === 'projection' && (
              <div className={styles.projectionTab}>
                <h3>Projeção de Economia nos Próximos Meses</h3>
                <div className={styles.projectionGrid}>
                  {simulationResults.projectedSavings.map(projection => (
                    <div key={projection.month} className={styles.projectionCard}>
                      <div className={styles.projectionHeader}>
                        <span className={styles.projectionMonth}>Mês {projection.month}</span>
                        <FaCalendar className={styles.projectionIcon} />
                      </div>
                      <div className={styles.projectionAmount}>
                        R$ {projection.savings.toLocaleString('pt-BR')}
                      </div>
                      <div className={styles.projectionSubtitle}>
                        Acumulado
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Análise Detalhada */}
            {activeTab === 'analysis' && (
              <div className={styles.analysisTab}>
                <h3>Análise Financeira Detalhada</h3>
                <div className={styles.analysisGrid}>
                  <div className={styles.analysisCard}>
                    <h4>Eficiência do Orçamento</h4>
                    <div className={styles.analysisValue}>
                      {((simulationData.monthlyBudget / simulationResults.totalExpenses) * 100).toFixed(1)}%
                    </div>
                    <p>Seu orçamento cobre {((simulationData.monthlyBudget / simulationResults.totalExpenses) * 100).toFixed(1)}% dos seus gastos totais</p>
                  </div>
                  <div className={styles.analysisCard}>
                    <h4>Taxa de Poupança Ideal</h4>
                    <div className={styles.analysisValue}>
                      {Math.max(20, (simulationResults.monthlySavings / simulationData.monthlyIncome) * 100).toFixed(1)}%
                    </div>
                    <p>Recomenda-se economizar pelo menos 20% da renda</p>
                  </div>
                  <div className={styles.analysisCard}>
                    <h4>Impacto de Pequenas Economias</h4>
                    <div className={styles.analysisValue}>
                      +R$ {((simulationResults.monthlySavings + 100) * simulationData.timeframe).toLocaleString('pt-BR')}
                    </div>
                    <p>Economizando R$ 100 a mais por mês</p>
                  </div>
                </div>
              </div>
            )}

          </section>

        </div>
      </main>
    </div>
  );
};

export default Simulation;