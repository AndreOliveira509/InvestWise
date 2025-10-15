// src/pages/Dashboard/Dashboard.jsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaMoneyBillWave, FaPlus, FaTrash, FaSearch, FaArrowUp, FaArrowDown
} from 'react-icons/fa';

import styles from './Dashboard.module.css';
import Header from '../../components/Header/Header';
/* Gráficos */
import PositiveAndNegativeBarChart from '../../components/PositiveAndNegativeBarChart/PositiveAndNegativeBarChart';
import CustomActiveShapePieChart from '../../components/CustomActiveShapePieChart/CustomActiveShapePieChart';
import SynchronizedLineChart from '../../components/SynchronizedLineChart/SynchronizedLineChart';


/* Categorias */
const categories = [
  { id: 'alimentacao', name: 'Alimentação', color: '#FF6B6B', icon: '🍽️' },
  { id: 'transporte', name: 'Transporte', color: '#4ECDC4', icon: '🚗' },
  { id: 'moradia', name: 'Moradia', color: '#45B7D1', icon: '🏠' },
  { id: 'lazer', name: 'Lazer', color: '#FFA07A', icon: '🎮' },
  { id: 'saude', name: 'Saúde', color: '#98D8C8', icon: '🏥' },
  { id: 'educacao', name: 'Educação', color: '#F7DC6F', icon: '📚' },
  { id: 'outros', name: 'Outros', color: '#BB8FCE', icon: '📦' }
];

const investmentCategories = {
  fiis: { name: 'Fundos Imobiliários', color: '#3498db' },
  acoes: { name: 'Ações', color: '#2ecc71' },
  rendaFixa: { name: 'Renda Fixa', color: '#f1c40f' },
  crypto: { name: 'Criptomoedas', color: '#e67e22' },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  /* ---------- ESTADOS ---------- */
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  const [investments, setInvestments] = useState(() => {
    const savedInvestments = localStorage.getItem('investments');
    return savedInvestments ? JSON.parse(savedInvestments) : [];
  });
  
  const [investmentForm, setInvestmentForm] = useState({ name: '', value: '', category: 'fiis' });

  const [budget, setBudget] = useState(3000);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({
    description: '',
    amount: '',
    category: 'alimentacao',
    date: new Date().toISOString().split('T')[0]
  });

  /* ---------- PERSISTÊNCIA ---------- */
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('investments', JSON.stringify(investments));
  }, [investments]);

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

  /* ---------- DADOS PARA GRÁFICOS ---------- */
  const weekSpending = useMemo(() => {
    const week = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toISOString().split('T')[0];
      const daySpent = expenses.filter(e => e.date === dayStr).reduce((s, e) => s + parseFloat(e.amount), 0);
      week.push({ name: d.toLocaleDateString('pt-BR', { weekday: 'short' }), gastos: daySpent, orcamento: budget / 30 });
    }
    return week;
  }, [expenses, budget]);

  const pieData = useMemo(() => {
    if (expenses.length === 0) return [{ name: 'Nenhum gasto', value: 1, color: '#e0e0e0' }];
    return categories.map(c => ({
      name: c.name,
      value: expenses.filter(e => e.category === c.id).reduce((s, e) => s + parseFloat(e.amount), 0),
      color: c.color
    })).filter(d => d.value > 0);
  }, [expenses]);

  const barData = useMemo(() => {
    return categories.map(c => ({
      name: c.name,
      lucro: Math.max(0, budget / 7 - expenses.filter(e => e.category === c.id).reduce((s, e) => s + parseFloat(e.amount), 0)),
      prejuizo: expenses.filter(e => e.category === c.id).reduce((s, e) => s + parseFloat(e.amount), 0)
    }));
  }, [expenses, budget]);

  const investmentPieData = useMemo(() => {
    if (investments.length === 0) return [{ name: 'Nenhum investimento', value: 1, color: '#e0e0e0' }];
    const categoryTotals = investments.reduce((acc, inv) => {
      acc[inv.category] = (acc[inv.category] || 0) + inv.value;
      return acc;
    }, {});
    return Object.keys(categoryTotals).map(catId => ({
      name: investmentCategories[catId].name,
      value: categoryTotals[catId],
      color: investmentCategories[catId].color,
    }));
  }, [investments]);

  /* ---------- HANDLERS ---------- */
  const handleAdd = e => {
    e.preventDefault();
    if (!form.description || !form.amount) return;
    const newExp = { id: Date.now(), ...form, amount: parseFloat(form.amount) };
    setExpenses([newExp, ...expenses]);
    setForm({ description: '', amount: '', category: 'alimentacao', date: new Date().toISOString().split('T')[0] });
  };
  
  const handleRemove = id => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const handleAddInvestment = e => {
    e.preventDefault();
    if (!investmentForm.name || !investmentForm.value) return;
    const newInvestment = {
      id: Date.now(),
      name: investmentForm.name,
      value: parseFloat(investmentForm.value),
      category: investmentForm.category,
      change: 0 
    };
    setInvestments([...investments, newInvestment]);
    setInvestmentForm({ name: '', value: '', category: 'fiis' });
  };

  const handleRemoveInvestment = id => {
    setInvestments(investments.filter(inv => inv.id !== id));
  };

  return (
    <div className={styles.dashboard}>
      <Header />
      <div className={styles.mainContent}>
        <main className={styles.main}>
          <div className={styles.pageHeader}>
            <h1>Dashboard Financeiro</h1>
            <p>Sua visão geral de gastos e investimentos.</p>
          </div>
      <hr></hr>
          <section className={styles.investmentsSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Meus Investimentos</h2>
            </div>
            <section className={styles.formCard}>
              <form onSubmit={handleAddInvestment} className={styles.addForm}>
                <input
                  type="text"
                  placeholder="Nome do Ativo"
                  className={styles.formInput}
                  value={investmentForm.name}
                  onChange={e => setInvestmentForm({ ...investmentForm, name: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Valor (R$)"
                  className={styles.formInput}
                  value={investmentForm.value}
                  onChange={e => setInvestmentForm({ ...investmentForm, value: e.target.value })}
                />
                <select 
                  className={styles.formInput} 
                  value={investmentForm.category}
                  onChange={e => setInvestmentForm({ ...investmentForm, category: e.target.value })}>
                  {Object.keys(investmentCategories).map(catId => (
                    <option key={catId} value={catId}>{investmentCategories[catId].name}</option>
                  ))}
                </select>
                <button type="submit" className={styles.addButton}>
                  <FaPlus /> Adicionar
                </button>
              </form>
            </section>
            
            {/* --- CARDS DE INVESTIMENTO MANTIDOS --- */}
            <div className={styles.metricsGrid}>
              <div className={styles.metricCard}>
                <h3 className={styles.metricTitle}>Fundo Imobiliário MXRF11</h3>
                <div className={styles.metricValueWrapper}>
                  <span className={styles.metricValue}>R$ 5.250,00</span>
                  <div className={`${styles.metricChange} ${styles.positive}`}>
                    <FaArrowUp />
                    <span>+R$ 52,10</span>
                  </div>
                </div>
              </div>
              <div className={styles.metricCard}>
                <h3 className={styles.metricTitle}>Ações da Petrobras</h3>
                <div className={styles.metricValueWrapper}>
                  <span className={styles.metricValue}>R$ 10.800,00</span>
                  <div className={`${styles.metricChange} ${styles.positive}`}>
                    <FaArrowUp />
                    <span>+R$ 180,50</span>
                  </div>
                </div>
              </div>
              <div className={styles.metricCard}>
                <h3 className={styles.metricTitle}>Tesouro Selic 2029</h3>
                <div className={styles.metricValueWrapper}>
                  <span className={styles.metricValue}>R$ 15.000,00</span>
                  <div className={`${styles.metricChange} ${styles.positive}`}>
                    <FaArrowUp />
                    <span>+R$ 112,00</span>
                  </div>
                </div>
              </div>
              <div className={styles.metricCard}>
                <h3 className={styles.metricTitle}>Bitcoin</h3>
                <div className={styles.metricValueWrapper}>
                  <span className={styles.metricValue}>R$ 2.300,00</span>
                  <div className={`${styles.metricChange} ${styles.negative}`}>
                    <FaArrowDown />
                    <span>-R$ 98,40</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* --- LISTA DE ATIVOS E GRÁFICO DE VOLTA --- */}
            <div className={styles.investmentContentGrid}>
              <div className={styles.investmentListCard}>
                <h3 className={styles.chartTitle}>Ativos na Carteira</h3>
                <div className={styles.investmentList}>
                  {investments.length > 0 ? (
                    investments.map(inv => (
                      <div key={inv.id} className={styles.investmentItem}>
                        <div className={styles.investmentDetails}>
                          <span className={styles.investmentName}>{inv.name}</span>
                          <span className={styles.investmentCategory} style={{ backgroundColor: `${investmentCategories[inv.category].color}30`, color: investmentCategories[inv.category].color }}>
                            {investmentCategories[inv.category].name}
                          </span>
                        </div>
                        <div className={styles.investmentValues}>
                          <span className={styles.investmentValue}>R$ {inv.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          <span className={`${styles.investmentChange} ${inv.change >= 0 ? styles.positive : styles.negative}`}>
                            {inv.change >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                            R$ {Math.abs(inv.change).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <button onClick={() => handleRemoveInvestment(inv.id)} className={styles.deleteBtn}><FaTrash /></button>
                      </div>
                    ))
                  ) : (
                    <div className={styles.emptyState}>Nenhum investimento encontrado.</div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* --- SEÇÃO DE GASTOS --- */}
          <section className={styles.expensesSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Meus Gastos</h2>
            </div>
            <section className={styles.formCard}>
              <form onSubmit={handleAdd} className={styles.modernForm}>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Descrição do gasto..." required />
                <input type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="R$ 0,00" required />
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {categories.map(c => (<option key={c.id} value={c.id}>{c.icon} {c.name}</option>))}
                </select>
                <button type="submit" className={styles.submitBtn}><FaPlus /> Adicionar</button>
              </form>
            </section>
            <section className={styles.metricsGrid}>
              <div className={styles.metricCard}>
                <h3 className={styles.metricTitle}>Patrimônio</h3>
                <div className={styles.metricValueWrapper}>
                  <span className={styles.metricValue}>R$ {patrimonio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  <div className={`${styles.metricChange} ${styles.positive}`}><FaArrowUp /><span>1.2%</span></div>
                </div>
              </div>
              <div className={styles.metricCard}>
                <h3 className={styles.metricTitle}>Total Gasto (Mês)</h3>
                <div className={styles.metricValueWrapper}>
                  <span className={styles.metricValue}>R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  <div className={`${styles.metricChange} ${styles.negative}`}><FaArrowDown /><span>-0.5%</span></div>
                </div>
              </div>
              <div className={styles.metricCard}>
                <h3 className={styles.metricTitle}>% Orçamento Usado</h3>
                <div className={styles.metricValueWrapper}>
                  <span className={styles.metricValue}>{usedPercent.toFixed(1)}%</span>
                  <div className={`${styles.metricChange} ${usedPercent > 80 ? styles.negative : styles.positive}`}><FaArrowUp /><span>+2.1%</span></div>
                </div>
              </div>
              <div className={styles.metricCard}>
                <h3 className={styles.metricTitle}>Saldo Restante</h3>
                <div className={styles.metricValueWrapper}>
                  <span className={styles.metricValue}>R$ {remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  <div className={`${styles.metricChange} ${styles.positive}`}><FaArrowDown /><span>+3.4%</span></div>
                </div>
              </div>
            </section>
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
                      const category = categories.find(c => c.id === exp.category) || {};
                      return (
                        <div key={exp.id} className={styles.transactionItem}>
                          <div className={styles.transactionIcon} style={{ backgroundColor: `${category.color}20`, color: category.color }}>{category.icon || '💸'}</div>
                          <div className={styles.transactionDetails}>
                            <span className={styles.transactionDesc}>{exp.description}</span>
                            <span className={styles.transactionDate}>{new Date(exp.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                          </div>
                          <span className={styles.transactionAmount}>- R$ {exp.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
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
    </div>
  );
}