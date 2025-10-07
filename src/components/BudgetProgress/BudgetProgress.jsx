const BudgetProgress = ({ spent, budget, percentage }) => {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '0.5rem' 
      }}>
        <span>Progresso do Orçamento</span>
        <span>{percentage.toFixed(1)}%</span>
      </div>
      <div style={{
        width: '100%',
        height: '12px',
        backgroundColor: '#e5e7eb',
        borderRadius: '6px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${Math.min(percentage, 100)}%`,
          height: '100%',
          backgroundColor: percentage >= 100 ? '#EF4444' : 
                         percentage >= 80 ? '#F59E0B' : '#10B981',
          borderRadius: '6px',
          transition: 'all 0.3s ease'
        }} />
      </div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginTop: '0.5rem',
        fontSize: '0.875rem',
        color: '#6b7280'
      }}>
        <span>Gasto: R$ {spent.toLocaleString('pt-BR')}</span>
        <span>Orçamento: R$ {budget.toLocaleString('pt-BR')}</span>
      </div>
    </div>
  );
};

export default BudgetProgress;