// src/pages/Dashboard/Dashboard.jsx

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaPlus, FaTrash, FaSearch, FaArrowUp, FaArrowDown, FaExclamationCircle } from 'react-icons/fa';
import axios from 'axios';
import styles from './Dashboard.module.css';
import FormCard from '../../components/FormCard/FormCard';
import PositiveAndNegativeBarChart from '../../components/PositiveAndNegativeBarChart/PositiveAndNegativeBarChart';
import CustomActiveShapePieChart from '../../components/CustomActiveShapePieChart/CustomActiveShapePieChart';
import SynchronizedLineChart from '../../components/SynchronizedLineChart/SynchronizedLineChart';
import InvestmentProfitabilityChart from '../../components/InvestmentProfitabilityChart/InvestmentProfitabilityChart';

// Definições de categorias de gastos e investimentos
const categories = [
  { id: 1, name: 'Alimentação', color: '#FF6B6B', icon: '🍽️' },
  { id: 2, name: 'Transporte', color: '#4ECDC4', icon: '🚗' },
  { id: 3, name: 'Moradia', color: '#45B7D1', icon: '🏠' },
  { id: 4, name: 'Lazer', color: '#FFA07A', icon: '🎮' },
  { id: 5, name: 'Saúde', color: '#98D8C8', icon: '🏥' },
  { id: 6, name: 'Educação', color: '#F7DC6F', icon: '📚' },
  { id: 7, name: 'Outros', color: '#BB8FCE', icon: '📦' }
];

const investmentCategories = {
  fiis: { name: 'Fundos Imobiliários', color: '#3498db' },
  acoes: { name: 'Ações', color: '#2ecc71' },
  rendaFixa: { name: 'Renda Fixa', color: '#f1c40f' },
  crypto: { name: 'Criptomoedas', color: '#e67e22' }
};

// Componente de Erro
const ErrorBanner = ({ message }) => (
  <div className={styles.errorBanner}>
    <FaExclamationCircle />
    <span>{message}</span>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();

  // Estados de dados
  const [expenses, setExpenses] = useState([]);
  const [investments, setInvestments] = useState([]);
  
  // Estados de UI (Carregamento e Erro)
  const [loading, setLoading] = useState(true);
  const [investmentsLoading, setInvestmentsLoading] = useState(true);
  const [expenseError, setExpenseError] = useState(null);
  const [investmentError, setInvestmentError] = useState(null);

  // Estados de Formulários
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ description: '', amount: '', categoryId: 1, date: new Date().toISOString().split('T')[0] });
  const [investmentForm, setInvestmentForm] = useState({ name: '', value: '', category: 'fiis', date: new Date().toISOString().split('T')[0] });

  // Efeito para buscar transações (Gastos)
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return; 

      const token = localStorage.getItem('investiwise_token');
      if (!token) {
        setLoading(false);
        setExpenseError("Usuário não autenticado. Faça login novamente.");
        return;
      }

      try {
        setLoading(true);
        setExpenseError(null);
        const response = await axios.get('/api/transaction', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpenses(response.data); 
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
        setExpenseError("Não foi possível carregar seus gastos. Tente recarregar a página.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);
  
  // Efeito para buscar investimentos
  useEffect(() => {
    const fetchInvestments = async () => {
      if (!user) return;

      const token = localStorage.getItem('investiwise_token');
      if (!token) {
        setInvestmentsLoading(false);
        setInvestmentError("Usuário não autenticado. Faça login novamente.");
        return;
      }

      try {
        setInvestmentsLoading(true);
        setInvestmentError(null);
        const response = await axios.get('/api/investments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInvestments(response.data);
      } catch (error) {
        console.error("Erro ao buscar investimentos:", error);
        setInvestmentError("Não foi possível carregar seus investimentos. Tente recarregar a página.");
      } finally {
        setInvestmentsLoading(false);
      }
    };

    fetchInvestments();
  }, [user]);

  // --- Métricas Financeiras (Gastos) ---
  const monthlyBudget = useMemo(() => (user ? parseFloat(user.renda_mensal) : 0), [user]);
  const totalExpenses = useMemo(() => expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0), [expenses]);
  const remaining = useMemo(() => monthlyBudget - totalExpenses, [monthlyBudget, totalExpenses]);
  const usedPercent = useMemo(() => (monthlyBudget > 0 ? (totalExpenses / monthlyBudget) * 100 : 0), [monthlyBudget, totalExpenses]);

  // --- Métricas Financeiras (Investimentos) ---
  const totalInvestmentValue = useMemo(() => 
    investments.reduce((sum, inv) => sum + parseFloat(inv.value || 0), 0), 
  [investments]);
  
  const totalInvestmentChange = useMemo(() => 
    investments.reduce((sum, inv) => sum + parseFloat(inv.change || 0), 0), 
  [investments]);

  const portfolioValue = useMemo(() => 
    totalInvestmentValue + totalInvestmentChange, 
  [totalInvestmentValue, totalInvestmentChange]);

  const bestPerformer = useMemo(() => {
    if (investments.length === 0) return { name: 'N/A', change: 0 };
    return investments.reduce((best, current) => 
      (parseFloat(current.change) > parseFloat(best.change) ? current : best), 
    investments[0]);
  }, [investments]);

  // --- Dados para Gráficos (Memoizados) ---
  const filteredExpenses = useMemo(() => (
    expenses
      .filter(e => e.description.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  ), [expenses, searchTerm]);

  const weekSpending = useMemo(() => {
    const week = [];
    const weeklyBudget = monthlyBudget / 4; // Orçamento semanal exemplo
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toISOString().split('T')[0];
      const daySpent = expenses.filter(e => e.date.startsWith(dayStr)).reduce((s, e) => s + parseFloat(e.amount || 0), 0);
      week.push({ name: d.toLocaleDateString('pt-BR', { weekday: 'short' }), gastos: daySpent, orcamento: weeklyBudget / 7 });
    }
    return week;
  }, [expenses, monthlyBudget]);

  const pieData = useMemo(() => {
    if (expenses.length === 0) return [{ name: 'Nenhum gasto', value: 1, color: '#e0e0e0' }];
    return categories.map(c => ({
      name: c.name,
      value: expenses.filter(e => e.categoryId === c.id).reduce((s, e) => s + parseFloat(e.amount || 0), 0),
      color: c.color
    })).filter(d => d.value > 0);
  }, [expenses]);

  const barData = useMemo(() => {
    // Se o budget for 0, não há o que mostrar
    if (monthlyBudget === 0) return [];

    return categories.map(c => {
      const categorySpend = expenses.filter(e => e.categoryId === c.id).reduce((s, e) => s + parseFloat(e.amount || 0), 0);
      const categoryBudget = monthlyBudget / categories.length; // Orçamento de categoria simplificado
      
      return {
        name: c.name,
        lucro: Math.max(0, categoryBudget - categorySpend), // "lucro" é o que sobrou do orçamento
        prejuizo: categorySpend // "prejuizo" é o que foi gasto
      };
    });
  }, [expenses, monthlyBudget]);
  
  const investmentHistoryData = useMemo(() => {
    if (investments.length === 0) return [];
    // Usa o valor total investido e o ganho/perda total para criar uma *projeção* linear
    // NOTA: Isso ainda é uma simulação, não um histórico real de rentabilidade.
    // Para um histórico real, seria necessário um backend que calculasse o valor da carteira diariamente.
    const totalInvested = totalInvestmentValue;
    const totalChange = totalInvestmentChange;
    if (totalInvested === 0) return [];
    
    const history = [];
    const days = 30;
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Projeção linear simples baseada no ganho/perda total atual
      const simulatedrenda_mensal = totalInvested + (totalChange / (days - 1)) * (days - 1 - i);
      
      history.push({
        date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        renda_mensal: parseFloat(simulatedrenda_mensal.toFixed(2)),
      });
    }
    return history;
  }, [investments, totalInvestmentValue, totalInvestmentChange]);

  // --- Handlers (Adicionar/Remover) ---
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;

    const token = localStorage.getItem('investiwise_token');
    setExpenseError(null); // Limpa erros antigos

    const newTransaction = {
      description: form.description,
      amount: parseFloat(form.amount),
      date: new Date(form.date).toISOString(),
      type: 'EXPENSE',
      categoryId: parseInt(form.categoryId),
    };

    try {
      const response = await axios.post('/api/transaction', newTransaction, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses([response.data, ...expenses]);
      setForm({ description: '', amount: '', categoryId: 1, date: new Date().toISOString().split('T')[0] });
    } catch (error) {
      console.error("Erro ao adicionar transação:", error);
      setExpenseError("Falha ao adicionar transação. Tente novamente.");
    }
  };
  
  const handleRemove = async (id) => {
    const token = localStorage.getItem('investiwise_token');
    setExpenseError(null);

    try {
      await axios.delete(`/api/transaction/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(expenses.filter(e => e.id !== id));
    } catch (error) {
      console.error("Erro ao remover transação:", error);
      setExpenseError("Falha ao remover transação. Tente novamente.");
    }
  };

  const handleAddInvestment = async (e) => {
    e.preventDefault();
    if (!investmentForm.name || !investmentForm.value) return;
    
    const token = localStorage.getItem('investiwise_token');
    setInvestmentError(null);

    const newInvestmentData = { 
      ...investmentForm, 
      value: parseFloat(investmentForm.value),
      date: new Date(investmentForm.date).toISOString(),
    };

    try {
      const response = await axios.post('/api/investments', newInvestmentData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Assumindo que a API retorna o 'change' como 0 para novos investimentos
      setInvestments([response.data, ...investments]);
      setInvestmentForm({ name: '', value: '', category: 'fiis', date: new Date().toISOString().split('T')[0] });
    } catch (error) {
      console.error("Erro ao adicionar investimento:", error);
      setInvestmentError("Falha ao adicionar investimento. Tente novamente.");
    }
  };

  const handleRemoveInvestment = async (id) => {
    const token = localStorage.getItem('investiwise_token');
    setInvestmentError(null);

    try {
      await axios.delete(`/api/investments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvestments(investments.filter(inv => inv.id !== id));
    } catch (error) {
      console.error("Erro ao remover investimento:", error);
      setInvestmentError("Falha ao remover investimento. Tente novamente.");
    }
  };

  // --- Renderização ---
  if (loading && investmentsLoading) {
    return <div className={styles.contentLoading}>Carregando dados...</div>;
  }
  
  return (
    <div className={styles.mainContent}>
      <main className={styles.main}>

        {/* Seção de Investimentos */}
        <section className={styles.investmentsSection}>
        <div className={styles.pageHeader}>
          <h1>Dashboard Financeiro</h1>
        </div>
          <div className={styles.sectionHeader}><h2 className={styles.sectionTitle}>Meus Investimentos</h2></div>
          
          {/* Banner de Erro de Investimentos */}
          {investmentError && <ErrorBanner message={investmentError} />}
          
          <FormCard onSubmit={handleAddInvestment}>
            <input type="text" placeholder="Nome do Ativo" value={investmentForm.name} onChange={e => setInvestmentForm({ ...investmentForm, name: e.target.value })} required />
            <input type="number" step="0.01" placeholder="Valor (R$)" value={investmentForm.value} onChange={e => setInvestmentForm({ ...investmentForm, value: e.target.value })} required />
            <select value={investmentForm.category} onChange={e => setInvestmentForm({ ...investmentForm, category: e.target.value })}>
              {Object.keys(investmentCategories).map(catId => (<option key={catId} value={catId}>{investmentCategories[catId].name}</option>))}
            </select>
            <input type="date" value={investmentForm.date} onChange={e => setInvestmentForm({ ...investmentForm, date: e.target.value })}/>
            <button type="submit"><FaPlus /> Adicionar</button>
          </FormCard>
          
          {/* Cards de Métricas de Investimentos (Dinâmicos) */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <h3 className={styles.metricTitle}>Valor Total da Carteira</h3>
              <div className={styles.metricValueWrapper}>
                <span className={styles.metricValue}>R$ {portfolioValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            <div className={styles.metricCard}>
              <h3 className={styles.metricTitle}>Ganhos/Perdas Totais</h3>
              <div className={styles.metricValueWrapper}>
                <span className={styles.metricValue}>R$ {totalInvestmentChange.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                <div className={`${styles.metricChange} ${totalInvestmentChange >= 0 ? styles.positive : styles.negative}`}>
                  {totalInvestmentChange >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                  <span>{
                    totalInvestmentValue > 0 ? 
                    ((totalInvestmentChange / totalInvestmentValue) * 100).toFixed(2) : 
                    '0.00'
                  }%</span>
                </div>
              </div>
            </div>
             <div className={styles.metricCard}>
              <h3 className={styles.metricTitle}>Total Investido</h3>
              <div className={styles.metricValueWrapper}>
                <span className={styles.metricValue}>R$ {totalInvestmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            <div className={styles.metricCard}>
              <h3 className={styles.metricTitle}>Melhor Performance</h3>
              <div className={styles.metricValueWrapper}>
                <span className={styles.metricValue}>{bestPerformer.name}</span>
                <div className={`${styles.metricChange} ${bestPerformer.change >= 0 ? styles.positive : styles.negative}`}>
                  {bestPerformer.change >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                  <span>R$ {parseFloat(bestPerformer.change).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Lista de Ativos na Carteira */}
          <div className={styles.investmentListCard}>
            <h3 className={styles.chartTitle}>Ativos na Carteira</h3>
            {investmentsLoading ? (
              <div className={styles.contentLoading}>Carregando ativos...</div>
            ) : (
              <div className={styles.investmentList}>
                {investments.length > 0 ? (investments.map(inv => (
                  <div key={inv.id} className={styles.investmentItem}>
                    <div className={styles.investmentDetails}>
                      <span className={styles.investmentName}>{inv.name}</span>
                      <span className={styles.investmentCategory}>
                        {investmentCategories[inv.category]?.name || 'Categoria'}
                      </span>
                    </div>
                    <div className={styles.investmentValues}>
                      <span className={styles.transactionDate}>{new Date(inv.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                      <span className={styles.investmentValue}>R$ {parseFloat(inv.value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      <span className={`${styles.investmentChange} ${inv.change >= 0 ? styles.positive : styles.negative}`}>
                        {inv.change >= 0 ? <FaArrowUp /> : <FaArrowDown />} R$ {Math.abs(inv.change || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <button onClick={() => handleRemoveInvestment(inv.id)} className={styles.deleteBtn}><FaTrash /></button>
                  </div>
                ))) : (<div className={styles.emptyState}>Nenhum investimento encontrado.</div>)}
              </div>
            )}
          </div>

          {/* Gráfico de Evolução (Simulado) */}
          {investments.length > 0 && investmentHistoryData.length > 0 && (
            <div className={styles.profitabilityChartCard}>
              <h3 className={styles.chartTitle}>Evolução da Carteira (Projeção 30 dias)</h3>
              <div className={styles.chartWrapper}>
                <InvestmentProfitabilityChart data={investmentHistoryData} />
              </div>
            </div>
          )}
        </section>

        {/* Seção de Gastos */}
        <section className={styles.expensesSection}>
            <div className={styles.sectionHeader}><h2 className={styles.sectionTitle}>Meus Gastos</h2></div>
            
            {/* Banner de Erro de Gastos */}
            {expenseError && <ErrorBanner message={expenseError} />}

            <FormCard onSubmit={handleAdd}>
              <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Descrição do gasto..." required />
              <input type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="R$ 0,00" required />
              <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}>{categories.map(c => (<option key={c.id} value={c.id}>{c.icon} {c.name}</option>))}</select>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}/>
              <button type="submit"><FaPlus /> Adicionar</button>
            </FormCard>

            {/* Cards de Métricas de Gastos (Dinâmicos) */}
            <section className={styles.metricsGrid}>
              <div className={styles.metricCard}>
                <h3 className={styles.metricTitle}>Renda Mensal</h3>
                <div className={styles.metricValueWrapper}>
                  <span className={styles.metricValue}>R$ {monthlyBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              <div className={styles.metricCard}>
                <h3 className={styles.metricTitle}>Total Gasto (Mês)</h3>
                <div className={styles.metricValueWrapper}>
                  <span className={styles.metricValue}>R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              <div className={styles.metricCard}>
                <h3 className={styles.metricTitle}>% Orçamento Usado</h3>
                <div className={styles.metricValueWrapper}>
                  <span className={styles.metricValue}>{usedPercent.toFixed(1)}%</span>
                  <div className={`${styles.metricChange} ${usedPercent > 80 ? styles.negative : styles.positive}`}>
                    {usedPercent > 80 ? <FaArrowDown /> : <FaArrowUp />}
                    <span>{usedPercent > 80 ? 'Acima' : 'Abaixo'} do limite</span>
                  </div>
                </div>
              </div>
              <div className={styles.metricCard}>
                <h3 className={styles.metricTitle}>Saldo Restante</h3>
                <div className={styles.metricValueWrapper}>
                  <span className={styles.metricValue}>R$ {remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </section>
          </section>

        {/* Grid de Gráficos e Transações */}
        <div className={styles.contentGrid}>
          <section className={styles.chartsArea}>
            <div className={`${styles.chartCard} ${styles.large}`}>
              <h3 className={styles.chartTitle}>Evolução Semanal</h3>
              <div className={styles.chartWrapper}>
                {loading ? <div className={styles.contentLoading}>Carregando...</div> : <SynchronizedLineChart data={weekSpending} />}
              </div>
            </div>
            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>Balanço por Categoria</h3>
              <div className={styles.chartWrapper}>
                {loading ? <div className={styles.contentLoading}>Carregando...</div> : <PositiveAndNegativeBarChart data={barData} />}
              </div>
            </div>
            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>Distribuição de Gastos</h3>
              <div className={styles.chartWrapper}>
                {loading ? <div className={styles.contentLoading}>Carregando...</div> : <CustomActiveShapePieChart data={pieData} />}
              </div>
            </div>
          </section>
          
          <section className={styles.transactionsArea}>
            <div className={styles.transactionsCard}>
              <h3 className={styles.chartTitle}>Gastos Recentes</h3>
              <div className={styles.transactionControls}>
                <div className={styles.searchWrapper}>
                  <FaSearch className={styles.searchIcon} />
                  <input type="text" placeholder="Pesquisar gasto..." className={styles.searchInput} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </div>
              <div className={styles.transactionList}>
                {loading ? (
                  <div className={styles.contentLoading}>Carregando gastos...</div>
                ) : filteredExpenses.length > 0 ? (
                  filteredExpenses.map(exp => {
                    const category = categories.find(c => c.id === exp.categoryId) || {};
                    return (
                      <div key={exp.id} className={styles.transactionItem}>
                        <div className={styles.transactionIcon} style={{ backgroundColor: `${category.color}20`, color: category.color }}>{category.icon || '💸'}</div>
                        <div className={styles.transactionDetails}>
                          <span className={styles.transactionDesc}>{exp.description}</span>
                          <div className={styles.transactionMeta}>
                            <span className={styles.transactionDate}>{new Date(exp.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                            {/* O span de status vazio foi removido */}
                          </div>
                        </div>
                        <span className={styles.transactionAmount}>- R$ {parseFloat(exp.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        <button onClick={() => handleRemove(exp.id)} className={styles.deleteBtn}><FaTrash /></button>
                      </div>
                    );
                  })
                ) : (
                  <div className={styles.emptyState}>Nenhum gasto encontrado.</div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}