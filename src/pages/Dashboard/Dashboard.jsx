// pages/Dashboard/Dashboard.jsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import {
  FaMoneyBillWave, FaPlus, FaTrash, FaSearch, FaArrowUp, FaArrowDown
} from 'react-icons/fa';

import styles from './Dashboard.module.css';
/* Gráficos */
import PositiveAndNegativeBarChart from '../../components/PositiveAndNegativeBarChart/PositiveAndNegativeBarChart';
import CustomActiveShapePieChart from '../../components/CustomActiveShapePieChart/CustomActiveShapePieChart';
import SynchronizedLineChart from '../../components/SynchronizedLineChart/SynchronizedLineChart';

/* Categorias */
const categories = [
  { id: 1, name: 'Alimentação', color: '#FF6B6B', icon: '🍽️' },
  { id: 2, name: 'Transporte', color: '#4ECDC4', icon: '🚗' },
  { id: 3, name: 'Moradia', color: '#45B7D1', icon: '🏠' },
  { id: 4, name: 'Lazer', color: '#FFA07A', icon: '🎮' },
  { id: 5, name: 'Saúde', color: '#98D8C8', icon: '🏥' },
  { id: 6, name: 'Educação', color: '#F7DC6F', icon: '📚' },
  { id: 7, name: 'Outros', color: '#BB8FCE', icon: '📦' }
];

export default function Dashboard() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({
    description: '',
    amount: '',
    categoryId: 1,
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;

      const token = localStorage.getItem('investiwise_token');
      try {
        const response = await axios.get('/api/transaction', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpenses(response.data);
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
      } finally {
        setTransactionsLoading(false); 
      }
    };

    fetchTransactions();
  }, [user]);

  /* ---------- MÉTRICAS ---------- */

  const totalExpenses = useMemo(() => expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0), [expenses]);
  const patrimonio = user ? parseFloat(user.patrimonio) : 0;
  const remaining = patrimonio - totalExpenses;
  const usedPercent = patrimonio > 0 ? (totalExpenses / patrimonio) * 100 : 0;

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter(e => e.description.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses, searchTerm]);

  const weekSpending = useMemo(() => {
    const week = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toISOString().split('T')[0];
      const daySpent = expenses
        .filter(e => e.date.startsWith(dayStr))
        .reduce((s, e) => s + parseFloat(e.amount), 0);
      week.push({ name: d.toLocaleDateString('pt-BR', { weekday: 'short' }), gastos: daySpent });
    }
    return week;
  }, [expenses]);

  const pieData = useMemo(() => {
    if (expenses.length === 0) return [{ name: 'Nenhum gasto', value: 1, color: '#e0e0e0' }];
    return categories.map(c => ({
      name: c.name,
      value: expenses.filter(e => e.categoryId === c.id).reduce((s, e) => s + parseFloat(e.amount), 0),
      color: c.color
    })).filter(d => d.value > 0);
  }, [expenses]);

  const barData = useMemo(() => {
    const monthlyBudget = patrimonio / 12;
    return categories.map(c => ({
      name: c.name,
      lucro: Math.max(0, monthlyBudget / categories.length - expenses.filter(e => e.categoryId === c.id).reduce((s, e) => s + parseFloat(e.amount), 0)),
      prejuizo: expenses.filter(e => e.categoryId === c.id).reduce((s, e) => s + parseFloat(e.amount), 0)
    }));
  }, [expenses, patrimonio]);

  /* ---------- HANDLERS ---------- */

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

  if (transactionsLoading) {
    return <div className={styles.contentLoading}>Carregando transações...</div>;
  }

  return (
    <div className={styles.mainContent}>
      <main className={styles.main}>
        {/* ... o resto do seu JSX ... */}
         <div className={styles.pageHeader}>
            <h1>Dashboard Financeiro</h1>
            <p>Sua visão geral de gastos e patrimônio.</p>
          </div>

          <section className={styles.formCard}>
            <form onSubmit={handleAdd} className={styles.modernForm}>
              <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Descrição do gasto..." required />
              <input type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="R$ 0,00" required />
              <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}>
                {categories.map(c => (<option key={c.id} value={c.id}>{c.icon} {c.name}</option>))}
              </select>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              <button type="submit" className={styles.submitBtn}><FaPlus /> Adicionar</button>
            </form>
          </section>

          <section className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <h3 className={styles.metricTitle}>Patrimônio</h3>
              <div className={styles.metricValueWrapper}>
                <span className={styles.metricValue}>R$ {patrimonio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            <div className={styles.metricCard}>
              <h3 className={styles.metricTitle}>Total Gasto (Mês)</h3>
              <div className={styles.metricValueWrapper}>
                <span className={styles.metricValue}>R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            <div className={styles.metricCard}>
              <h3 className={styles.metricTitle}>% Patrimônio Usado</h3>
              <div className={styles.metricValueWrapper}>
                <span className={styles.metricValue}>{usedPercent.toFixed(1)}%</span>
              </div>
            </div>
            <div className={styles.metricCard}>
              <h3 className={styles.metricTitle}>Saldo Restante</h3>
              <div className={styles.metricValueWrapper}>
                <span className={styles.metricValue}>R$ {remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </section>

          <div className={styles.contentGrid}>
            <section className={styles.chartsArea}>
              <div className={`${styles.chartCard} ${styles.large}`}>
                <h3 className={styles.chartTitle}>Evolução Semanal</h3>
                <div className={styles.chartWrapper}><SynchronizedLineChart data={weekSpending} /></div>
              </div>
              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>Balanço por Categoria</h3>
                <div className={styles.chartWrapper}><PositiveAndNegativeBarChart data={barData} /></div>
              </div>
              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>Distribuição de Gastos</h3>
                <div className={styles.chartWrapper}><CustomActiveShapePieChart data={pieData} /></div>
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
                  {filteredExpenses.length > 0 ? (
                    filteredExpenses.map(exp => {
                      const category = categories.find(c => c.id === exp.categoryId) || {};
                      return (
                        <div key={exp.id} className={styles.transactionItem}>
                          <div className={styles.transactionIcon} style={{ backgroundColor: `${category.color}20`, color: category.color }}>{category.icon || '💸'}</div>
                          <div className={styles.transactionDetails}>
                            <span className={styles.transactionDesc}>{exp.description}</span>
                            <span className={styles.transactionDate}>{new Date(exp.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
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