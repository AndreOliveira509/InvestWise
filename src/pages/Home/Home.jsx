import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaMoneyBillWave, FaTrash, FaPlus, FaHome, FaChartPie, FaCalendar,
  FaUser, FaSignOutAlt, FaSearch, FaFilter
} from 'react-icons/fa';
import { MdSavings } from 'react-icons/md';
import styles from './Home.module.css';
import Sidebar from '../../components/Sidebar/Sidebar';
/* Gráficos */
import PositiveAndNegativeBarChart from '../../components/PositiveAndNegativeBarChart/PositiveAndNegativeBarChart';
import CustomActiveShapePieChart from '../../components/CustomActiveShapePieChart/CustomActiveShapePieChart';
import SynchronizedLineChart from '../../components/SynchronizedLineChart/SynchronizedLineChart';

/* Categorias */
const categories = [
  { id: 'alimentacao', name: 'Alimentação', color: '#FF6B6B', icon: '🍽️' },
  { id: 'transporte', name: 'Transporte', color: '#4ECDC4', icon: '🚗' },
  { id: 'moradia',     name: 'Moradia',     color: '#45B7D1', icon: '🏠' },
  { id: 'lazer',       name: 'Lazer',       color: '#FFA07A', icon: '🎮' },
  { id: 'saude',       name: 'Saúde',       color: '#98D8C8', icon: '🏥' },
  { id: 'educacao',    name: 'Educação',    color: '#F7DC6F', icon: '📚' },
  { id: 'outros',      name: 'Outros',      color: '#BB8FCE', icon: '📦' }
];

export default function Home() {
  const navigate = useNavigate();

  /* ---------- ESTADOS ---------- */
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(3000);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [sort, setSort] = useState('date'); // date | amount
  const [form, setForm] = useState({
    description: '',
    amount: '',
    category: 'alimentacao',
    date: new Date().toISOString().split('T')[0]
  });

  /* ---------- PERSISTÊNCIA ---------- */
  useEffect(() => {
    const saved = localStorage.getItem('expenses');
    const bud = localStorage.getItem('budget');
    if (saved) setExpenses(JSON.parse(saved));
    if (bud) setBudget(parseFloat(bud));
  }, []);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  /* ---------- MÉTRICAS ---------- */
  const totalExpenses = useMemo(() => expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0), [expenses]);
  const remaining = budget - totalExpenses;
  const usedPercent = (totalExpenses / budget) * 100;

  const todayExpenses = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return expenses.filter(e => e.date === today).reduce((s, e) => s + parseFloat(e.amount), 0);
  }, [expenses]);

  const weekSpending = useMemo(() => {
    const week = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toISOString().split('T')[0];
      const daySpent = expenses.filter(e => e.date === dayStr).reduce((s, e) => s + parseFloat(e.amount), 0);
      week.push({ name: d.toLocaleDateString('pt-BR', { weekday: 'short' }), spent: daySpent });
    }
    return week;
  }, [expenses]);

  const pieData = useMemo(() => {
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

  /* ---------- FILTROS ---------- */
  const filtered = useMemo(() => {
    let list = expenses
      .filter(e => {
        const matchSearch = e.description.toLowerCase().includes(search.toLowerCase());
        const matchCat = filterCat === 'all' || e.category === filterCat;
        return matchSearch && matchCat;
      })
      .sort((a, b) => {
        if (sort === 'date') return new Date(b.date) - new Date(a.date);
        if (sort === 'amount') return b.amount - a.amount;
        return 0;
      });
    return list.slice(0, 8);
  }, [expenses, search, filterCat, sort]);

  /* ---------- HANDLERS ---------- */
  const handleAdd = e => {
    e.preventDefault();
    if (!form.description || !form.amount) return;
    const newExp = { id: Date.now(), ...form, amount: parseFloat(form.amount) };
    setExpenses([newExp, ...expenses]);
    setForm({ description: '', amount: '', category: 'alimentacao', date: new Date().toISOString().split('T')[0] });
  };

  const handleRemove = id => setExpenses(expenses.filter(e => e.id !== id));
  const handleBudgetEdit = () => {
    const val = prompt('Novo orçamento:', budget);
    if (val && !isNaN(val)) setBudget(parseFloat(val));
  };

  /* ---------- ALERTAS ---------- */
  const alerts = [];
  if (usedPercent >= 100) alerts.push({ type: 'error', msg: 'Orçamento ultrapassado!' });
  else if (usedPercent >= 80) alerts.push({ type: 'warning', msg: 'Mais de 80 % usados.' });

  /* ---------- RENDER ---------- */
  return (
    <div className={styles.home}>
      {/* SIDEBAR */}
         <Sidebar isSidebarOpen={true} setIsSidebarOpen={() => {}} />

      {/* CONTEÚDO */}
      <div className={`${styles.mainContent} ${styles.sidebarOpen}`}>
        {/* TOPBAR */}
        <header className={styles.topBar}>
          <div className={styles.topBarContent}>
            <span className={styles.pageTitle}>Dashboard Financeira</span>
            <div className={styles.userActions}>
              <div className={styles.userInfo}>
                <div className={styles.userAvatar}><FaUser /></div>
                <div>
                  <span className={styles.userName}>Usuário</span>
                  <span className={styles.userPlan}>Premium</span>
                </div>
              </div>
              <button className={styles.logoutButton} onClick={() => { localStorage.removeItem('isAuthenticated'); navigate('/'); }}>
                <FaSignOutAlt /> Sair
              </button>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className={styles.main}>

            {/* GASTOS */}
            <section className={styles.expenseSection}>
          <div className={styles.expenseWrapper}>
            {/* Formulário moderno (sem input de data) */}
            <div className={styles.formCard}>
              <h2>Adicionar Gasto</h2>
              <form onSubmit={handleAdd} className={styles.modernForm}>
                <input
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Ex: Almoço, Uber, Netflix"
                  required
                />
                <input
                  type="number"
                  step="0.01"
                  value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })}
                  placeholder="R$ 0,00"
                  required
                />
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
                <button type="submit" className={styles.submitBtn}>
                  <FaPlus /> Adicionar
                </button>
              </form>
            </div>

            {/* Lista estilosa */}
            {/* <div className={styles.listCardModern}>
              <div className={styles.listHeaderModern}>
                <h2>Gastos Recentes</h2>
                <div className={styles.chips}>
                  <div className={styles.searchChip}>
                    <FaSearch />
                    <input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Buscar"
                    />
                  </div>
                  <select value={filterCat} onChange={e => setFilterCat(e.target.value)}>
                    <option value="all">Todas</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className={styles.emptyModern}>
                  <MdSavings />
                  <p>Sem gastos por aqui...</p>
                </div>
              ) : (
                <ul className={styles.modernList}>
                  {filtered.map(exp => {
                    const cat = categories.find(c => c.id === exp.category);
                    return (
                      <li key={exp.id} className={styles.modernItem}>
                        <div className={styles.itemLeft}>
                          <div className={styles.itemColor} style={{ background: cat.color }}></div>
                          <div>
                            <div className={styles.itemTitle}>{exp.description}</div>
                            <div className={styles.itemMeta}>
                              {cat.icon} {cat.name} • {new Date(exp.date).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                        </div>
                        <div className={styles.itemRight}>
                          <span className={styles.itemValue}>R$ {exp.amount.toLocaleString('pt-BR')}</span>
                          <button onClick={() => handleRemove(exp.id)} className={styles.itemRemove}>
                            <FaTrash />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div> */}
          </div>
        </section>
          <div className={styles.container}>

            {/* CARDS RESUMO */}
            <section className={styles.summarySection}>
              {/* Card 1 – Orçamento com barra */}
              <div className={styles.summaryCard} onClick={handleBudgetEdit} style={{ cursor: 'pointer' }}>
                <div className={styles.cardLeft}>
                  <div className={styles.cardIcon}><FaMoneyBillWave /></div>
                  <div>
                    <h3>Orçamento</h3>
                    <p>R$ {budget.toLocaleString('pt-BR')}</p>
                  </div>
                </div>
                <div className={styles.cardRight}>
                  <div className={styles.progressCircle} style={{ '--percent': Math.min(usedPercent, 100) }}>
                    <span>{usedPercent.toFixed(0)}%</span>
                  </div>
                </div>
              </div>

              {/* Card 2 – Total gasto com barra */}
              <div className={styles.summaryCard}>
                <div className={styles.cardLeft}>
                  <div className={styles.cardIcon}><FaChartPie /></div>
                  <div>
                    <h3>Total Gasto</h3>
                    <p>R$ {totalExpenses.toLocaleString('pt-BR')}</p>
                  </div>
                </div>
                <div className={styles.cardRight}>
                  <div className={styles.progressBar} style={{ '--percent': usedPercent }}></div>
                </div>
              </div>

              {/* Card 3 – Saldo restante */}
              <div className={`${styles.summaryCard} ${remaining >= 0 ? 'positive' : 'negative'}`}>
                <div className={styles.cardLeft}>
                  <div className={styles.cardIcon}><FaMoneyBillWave /></div>
                  <div>
                    <h3>Saldo</h3>
                    <p>R$ {Math.abs(remaining).toLocaleString('pt-BR')}</p>
                  </div>
                </div>
                <div className={styles.cardRight}>
                  <div className={styles.progressCircle} style={{ '--percent': Math.max(0, 100 - usedPercent) }}>
                    <span>{Math.max(0, 100 - usedPercent).toFixed(0)}%</span>
                  </div>
                </div>
              </div>

              {/* Card 4 – Hoje */}
              <div className={styles.summaryCard}>
                <div className={styles.cardLeft}>
                  <div className={styles.cardIcon}><FaCalendar /></div>
                  <div>
                    <h3>Hoje</h3>
                    <p>R$ {todayExpenses.toLocaleString('pt-BR')}</p>
                  </div>
                </div>
                <div className={styles.cardRight}>
                  <div className={styles.todaySpark}></div>
                </div>
              </div>
            </section>

            {/* ALERTAS */}
            {alerts.length > 0 && (
              <section className={styles.alerts}>
                {alerts.map((a, i) => (
                  <div key={i} className={`${styles.alert} ${styles[a.type]}`}>
                    <span>{a.msg}</span>
                  </div>
                ))}
              </section>
            )}

            {/* GRÁFICOS GRANDES */}
         {/* GRÁFICOS */}
            <section className={styles.chartsSection}>
              <h2>Análise Visual</h2>
              <div className={styles.chartsGrid}>
                <div className={styles.chartCard}><h3>Evolução Semanal</h3><SynchronizedLineChart data={weekSpending} /></div>
                <div className={styles.chartCard}><h3>Balanço por Categoria</h3><PositiveAndNegativeBarChart data={barData} /></div>
                <div className={styles.chartCard}><h3>Distribuição %</h3><CustomActiveShapePieChart data={pieData} /></div>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}