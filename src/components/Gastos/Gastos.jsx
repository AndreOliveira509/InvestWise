// components/Gastos.js
import React, { useState, useEffect } from 'react';

const Gastos = ({ userData, setUserData }) => {
  const [gastos, setGastos] = useState([]);
  const [novoGasto, setNovoGasto] = useState({
    descricao: '',
    valor: '',
    categoria: 'alimentacao',
    data: new Date().toISOString().split('T')[0]
  });

  // Carregar gastos do localStorage
  useEffect(() => {
    const savedGastos = localStorage.getItem('gastosData');
    if (savedGastos) {
      setGastos(JSON.parse(savedGastos));
    }
  }, []);

  // Salvar gastos no localStorage
  useEffect(() => {
    localStorage.setItem('gastosData', JSON.stringify(gastos));
  }, [gastos]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoGasto({
      ...novoGasto,
      [name]: value
    });
  };

  const adicionarGasto = (e) => {
    e.preventDefault();
    if (!novoGasto.descricao || !novoGasto.valor) return;

    const gasto = {
      id: Date.now(),
      ...novoGasto,
      valor: parseFloat(novoGasto.valor)
    };

    setGastos([...gastos, gasto]);
    
    // Atualizar saldo
    setUserData({
      ...userData,
      saldo: userData.saldo - gasto.valor
    });

    // Reset form
    setNovoGasto({
      descricao: '',
      valor: '',
      categoria: 'alimentacao',
      data: new Date().toISOString().split('T')[0]
    });
  };

  const removerGasto = (id) => {
    const gasto = gastos.find(g => g.id === id);
    setGastos(gastos.filter(g => g.id !== id));
    
    // Restaurar saldo
    if (gasto) {
      setUserData({
        ...userData,
        saldo: userData.saldo + gasto.valor
      });
    }
  };

  const categorias = {
    alimentacao: 'Alimentação',
    transporte: 'Transporte',
    moradia: 'Moradia',
    lazer: 'Lazer',
    saude: 'Saúde',
    educacao: 'Educação',
    outros: 'Outros'
  };

  const totalGastos = gastos.reduce((total, gasto) => total + gasto.valor, 0);

  return (
    <div className="gastos">
      <h2>Controle de Gastos</h2>
      
      <div className="gastos-content">
        <div className="gastos-form">
          <h3>Adicionar Gasto</h3>
          <form onSubmit={adicionarGasto}>
            <div className="form-group">
              <label>Descrição:</label>
              <input
                type="text"
                name="descricao"
                value={novoGasto.descricao}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Valor (R$):</label>
              <input
                type="number"
                step="0.01"
                name="valor"
                value={novoGasto.valor}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Categoria:</label>
              <select
                name="categoria"
                value={novoGasto.categoria}
                onChange={handleInputChange}
              >
                {Object.entries(categorias).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Data:</label>
              <input
                type="date"
                name="data"
                value={novoGasto.data}
                onChange={handleInputChange}
              />
            </div>
            
            <button type="submit" className="btn-primary">Adicionar Gasto</button>
          </form>
        </div>
        
        <div className="gastos-list">
          <h3>Gastos Recentes</h3>
          <div className="resumo-gastos">
            <p>Total Gasto: <strong>R$ {totalGastos.toFixed(2)}</strong></p>
            <p>Meta Mensal: <strong>R$ {userData.metaMensal.toFixed(2)}</strong></p>
            <p className={totalGastos > userData.metaMensal ? 'negativo' : 'positivo'}>
              Status: {totalGastos > userData.metaMensal ? 'Acima da meta' : 'Dentro da meta'}
            </p>
          </div>
          
          {gastos.length === 0 ? (
            <p>Nenhum gasto registrado.</p>
          ) : (
            <div className="gastos-table">
              {gastos.map(gasto => (
                <div key={gasto.id} className="gasto-item">
                  <div className="gasto-info">
                    <span className="gasto-descricao">{gasto.descricao}</span>
                    <span className="gasto-categoria">{categorias[gasto.categoria]}</span>
                    <span className="gasto-data">{gasto.data}</span>
                    <span className="gasto-valor">R$ {gasto.valor.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={() => removerGasto(gasto.id)}
                    className="btn-remover"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gastos;