import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaPlus, FaTrash, FaSearch, FaArrowUp, FaArrowDown } from 'react-icons/fa';
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
  fiis: {id: 1, name: 'Fundos Imobiliários', color: '#3498db' },
  acoes: { id: 2, name: 'Ações', color: '#2ecc71' },
  rendaFixa: { id: 3, name: 'Renda Fixa', color: '#f1c40f' },
  crypto: { id: 4, name: 'Criptomoedas', color: '#e67e22' },
};

export default function Dashboard() {
  const { user } = useAuth();

  // Estados com localStorage para persistir os dados
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [investments, setInvestments] = useState(() => {
    const savedInvestments = localStorage.getItem('investments');
    return savedInvestments ? JSON.parse(savedInvestments) : [];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ description: '', amount: '', categoryId: 1, date: new Date().toISOString().split('T')[0] });
  const [investmentForm, setInvestmentForm] = useState({ name: '', value: '', category: 'fiis', date: new Date().toISOString().split('T')[0] });

useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return; 

      const token = localStorage.getItem('investiwise_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get('/api/transaction', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpenses(response.data); 
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);
  
  useEffect(() => { localStorage.setItem('investments', JSON.stringify(investments)); }, [investments]);

  // --- Métricas Financeiras ---
  const totalExpenses = useMemo(() => expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0), [expenses]);
  const patrimonio = user ? parseFloat(user.patrimonio) : 50000; // Usando um valor padrão para visualização
  const remaining = patrimonio - totalExpenses;
  const usedPercent = patrimonio > 0 ? (totalExpenses / patrimonio) * 100 : 0;

  const filteredExpenses = useMemo(() => (
    expenses
      .filter(e => e.description.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  ), [expenses, searchTerm]);

  const weekSpending = useMemo(() => {
    const week = [];
    const budget = patrimonio / 4; // Orçamento semanal exemplo
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toISOString().split('T')[0];
      const daySpent = expenses.filter(e => e.date.startsWith(dayStr)).reduce((s, e) => s + parseFloat(e.amount || 0), 0);
      week.push({ name: d.toLocaleDateString('pt-BR', { weekday: 'short' }), gastos: daySpent, orcamento: budget / 7 });
    }
    return week;
  }, [expenses, patrimonio]);

  const pieData = useMemo(() => {
    if (expenses.length === 0) return [{ name: 'Nenhum gasto', value: 1, color: '#e0e0e0' }];
    return categories.map(c => ({
      name: c.name,
      value: expenses.filter(e => e.categoryId === c.id).reduce((s, e) => s + parseFloat(e.amount || 0), 0),
      color: c.color
    })).filter(d => d.value > 0);
  }, [expenses]);

  const barData = useMemo(() => {
    const monthlyBudget = patrimonio / 12;
    return categories.map(c => ({
      name: c.name,
      lucro: Math.max(0, monthlyBudget / categories.length - expenses.filter(e => e.categoryId === c.id).reduce((s, e) => s + parseFloat(e.amount || 0), 0)),
      prejuizo: expenses.filter(e => e.categoryId === c.id).reduce((s, e) => s + parseFloat(e.amount || 0), 0)
    }));
  }, [expenses, patrimonio]);
  
  const investmentHistoryData = useMemo(() => {
    if (investments.length === 0) return [];
    const totalInvested = investments.reduce((sum, inv) => sum + parseFloat(inv.value || 0), 0);
    const totalChange = investments.reduce((sum, inv) => sum + parseFloat(inv.change || 0), 0);
    if (totalInvested === 0) return [];
    
    const history = [];
    const days = 30;
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const simulatedPatrimonio = totalInvested + (totalChange / (days - 1)) * (days - 1 - i);
      const randomFactor = 1 + (Math.random() - 0.5) * 0.02;
      const finalValue = simulatedPatrimonio * randomFactor;
      history.push({
        date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        patrimonio: parseFloat(finalValue.toFixed(2)),
      });
    }
    return history;
  }, [investments]);

  // --- Handlers ---
const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;

    const token = localStorage.getItem('investiwise_token');
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
    }
  };
  
  const handleRemove = async (id) => {
    const token = localStorage.getItem('investiwise_token');
    try {
      await axios.delete(`/api/transaction/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(expenses.filter(e => e.id !== id));
    } catch (error) {
      console.error("Erro ao remover transação:", error);
    }
  };

  const handleAddInvestment = e => {
    e.preventDefault();
    if (!investmentForm.name || !investmentForm.value) return;
    const newInvestment = { 
        id: Date.now(), 
        ...investmentForm, 
        value: parseFloat(investmentForm.value), 
        change: (Math.random() - 0.4) * parseFloat(investmentForm.value) * 0.1 
    };
    setInvestments([newInvestment, ...investments]);
    setInvestmentForm({ name: '', value: '', category: 'fiis', date: new Date().toISOString().split('T')[0] });
  };

  const handleRemoveInvestment = id => setInvestments(investments.filter(inv => inv.id !== id));

  if (loading) {
    return <div className={styles.contentLoading}>Carregando dados...</div>;
  }
  
  return (
    <div className={styles.mainContent}>
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h1>Dashboard Financeiro</h1>
          <p>Sua visão geral de gastos e investimentos.</p>
        </div>
        <hr />

        <section className={styles.investmentsSection}>
          <div className={styles.sectionHeader}><h2 className={styles.sectionTitle}>Meus Investimentos</h2></div>
          <FormCard onSubmit={handleAddInvestment}>
            <input type="text" placeholder="Nome do Ativo" value={investmentForm.name} onChange={e => setInvestmentForm({ ...investmentForm, name: e.target.value })} required />
            <input type="number" step="0.01" placeholder="Valor (R$)" value={investmentForm.value} onChange={e => setInvestmentForm({ ...investmentForm, value: e.target.value })} required />
            <select value={investmentForm.category} onChange={e => setInvestmentForm({ ...investmentForm, category: e.target.value })}>
              {Object.keys(investmentCategories).map(catId => (<option key={catId} value={catId}>{investmentCategories[catId].name}</option>))}
            </select>
            <input type="date" value={investmentForm.date} onChange={e => setInvestmentForm({ ...investmentForm, date: e.target.value })}/>
            <button type="submit"><FaPlus /> Adicionar</button>
          </FormCard>
          
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}><h3 className={styles.metricTitle}>Fundo Imobiliário MXRF11</h3><div className={styles.metricValueWrapper}><span className={styles.metricValue}>R$ 5.250,00</span><div className={`${styles.metricChange} ${styles.positive}`}><FaArrowUp /><span>+R$ 52,10</span></div></div></div>
            <div className={styles.metricCard}><h3 className={styles.metricTitle}>Ações da Petrobras</h3><div className={styles.metricValueWrapper}><span className={styles.metricValue}>R$ 10.800,00</span><div className={`${styles.metricChange} ${styles.positive}`}><FaArrowUp /><span>+R$ 180,50</span></div></div></div>
            <div className={styles.metricCard}><h3 className={styles.metricTitle}>Tesouro Selic 2029</h3><div className={styles.metricValueWrapper}><span className={styles.metricValue}>R$ 15.000,00</span><div className={`${styles.metricChange} ${styles.positive}`}><FaArrowUp /><span>+R$ 112,00</span></div></div></div>
            <div className={styles.metricCard}><h3 className={styles.metricTitle}>Bitcoin</h3><div className={styles.metricValueWrapper}><span className={styles.metricValue}>R$ 2.300,00</span><div className={`${styles.metricChange} ${styles.negative}`}><FaArrowDown /><span>-R$ 98,40</span></div></div></div>
          </div>
          
          <div className={styles.investmentListCard}>
            <h3 className={styles.chartTitle}>Ativos na Carteira</h3>
            <div className={styles.investmentList}>
              {investments.length > 0 ? (investments.map(inv => (
                <div key={inv.id} className={styles.investmentItem}>
                  <div className={styles.investmentDetails}>
                    <span className={styles.investmentName}>{inv.name}</span>
                    <span 
                      className={styles.investmentCategory} 
                      style={{ 
                        backgroundColor: `${investmentCategories[inv.category]?.color || '#cccccc'}30`, 
                        color: investmentCategories[inv.category]?.color || '#333333' 
                      }}>
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
          </div>

          {investments.length > 0 && (
            <div className={styles.profitabilityChartCard}>
              <h3 className={styles.chartTitle}>Evolução da Carteira (Últimos 30 dias)</h3>
              <div className={styles.chartWrapper}>
                <InvestmentProfitabilityChart data={investmentHistoryData} />
              </div>
            </div>
          )}
        </section>

        <section className={styles.expensesSection}>
            <div className={styles.sectionHeader}><h2 className={styles.sectionTitle}>Meus Gastos</h2></div>
            <FormCard onSubmit={handleAdd}>
              <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Descrição do gasto..." required />
              <input type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="R$ 0,00" required />
              <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}>{categories.map(c => (<option key={c.id} value={c.id}>{c.icon} {c.name}</option>))}</select>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}/>
              <button type="submit"><FaPlus /> Adicionar</button>
            </FormCard>
            <section className={styles.metricsGrid}>
              <div className={styles.metricCard}><h3 className={styles.metricTitle}>Orçamento</h3><div className={styles.metricValueWrapper}><span className={styles.metricValue}>R$ {patrimonio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span><div className={`${styles.metricChange} ${styles.positive}`}><FaArrowUp /><span>1.2%</span></div></div></div>
              <div className={styles.metricCard}><h3 className={styles.metricTitle}>Total Gasto (Mês)</h3><div className={styles.metricValueWrapper}><span className={styles.metricValue}>R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span><div className={`${styles.metricChange} ${styles.negative}`}><FaArrowDown /><span>-0.5%</span></div></div></div>
              <div className={styles.metricCard}><h3 className={styles.metricTitle}>% Orçamento Usado</h3><div className={styles.metricValueWrapper}><span className={styles.metricValue}>{usedPercent.toFixed(1)}%</span><div className={`${styles.metricChange} ${usedPercent > 80 ? styles.negative : styles.positive}`}><FaArrowUp /><span>+2.1%</span></div></div></div>
              <div className={styles.metricCard}><h3 className={styles.metricTitle}>Saldo Restante</h3><div className={styles.metricValueWrapper}><span className={styles.metricValue}>R$ {remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span><div className={`${styles.metricChange} ${styles.positive}`}><FaArrowDown /><span>+3.4%</span></div></div></div>
            </section>
          </section>

        <div className={styles.contentGrid}>
          <section className={styles.chartsArea}>
            <div className={`${styles.chartCard} ${styles.large}`}><h3 className={styles.chartTitle}>Evolução Semanal</h3><div className={styles.chartWrapper}><SynchronizedLineChart data={weekSpending} /></div></div>
            <div className={styles.chartCard}><h3 className={styles.chartTitle}>Balanço por Categoria</h3><div className={styles.chartWrapper}><PositiveAndNegativeBarChart data={barData} /></div></div>
            <div className={styles.chartCard}><h3 className={styles.chartTitle}>Distribuição de Gastos</h3><div className={styles.chartWrapper}><CustomActiveShapePieChart data={pieData} /></div></div>
          </section>
          <section className={styles.transactionsArea}>
            <div className={styles.transactionsCard}>
              <h3 className={styles.chartTitle}>Gastos Recentes</h3>
              <div className={styles.transactionControls}><div className={styles.searchWrapper}><FaSearch className={styles.searchIcon} /><input type="text" placeholder="Pesquisar gasto..." className={styles.searchInput} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div></div>
              <div className={styles.transactionList}>
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.map(exp => {
                    const category = categories.find(c => c.id === exp.categoryId) || {};
                    return (
                      <div key={exp.id} className={styles.transactionItem}>
                        <div className={styles.transactionIcon} style={{ backgroundColor: `${category.color}20`, color: category.color }}>{category.icon || '💸'}</div>
                        <div className={styles.transactionDetails}>
                          <span className={styles.transactionDesc}>{exp.description}</span>
                          {/* --- ALTERAÇÃO AQUI --- */}
                          <div className={styles.transactionMeta}>
                            <span className={styles.transactionDate}>{new Date(exp.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                            <span className={styles.transactionStatus} title="Pago"></span>
                          </div>
                          {/* --- FIM DA ALTERAÇÃO --- */}
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