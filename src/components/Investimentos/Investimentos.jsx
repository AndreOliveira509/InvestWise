// components/Investimentos.js
import React, { useState, useEffect } from 'react';

const Investimentos = ({ userData, setUserData }) => {
  const [investimentos, setInvestimentos] = useState([]);
  const [novoInvestimento, setNovoInvestimento] = useState({
    nome: '',
    tipo: 'renda-fixa',
    valor: '',
    rentabilidade: '',
    data: new Date().toISOString().split('T')[0]
  });

  // Carregar investimentos do localStorage
  useEffect(() => {
    const savedInvestimentos = localStorage.getItem('investimentosData');
    if (savedInvestimentos) {
      setInvestimentos(JSON.parse(savedInvestimentos));
    }
  }, []);

  // Salvar investimentos no localStorage
  useEffect(() => {
    localStorage.setItem('investimentosData', JSON.stringify(investimentos));
  }, [investimentos]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoInvestimento({
      ...novoInvestimento,
      [name]: value
    });
  };

  const adicionarInvestimento = (e) => {
    e.preventDefault();
    if (!novoInvestimento.nome || !novoInvestimento.valor) return;

    const investimento = {
      id: Date.now(),
      ...novoInvestimento,
      valor: parseFloat(novoInvestimento.valor),
      rentabilidade: parseFloat(novoInvestimento.rentabilidade) || 0
    };

    setInvestimentos([...investimentos, investimento]);
    
    // Atualizar saldo
    setUserData({
      ...userData,
      saldo: userData.saldo - investimento.valor
    });

    // Reset form
    setNovoInvestimento({
      nome: '',
      tipo: 'renda-fixa',
      valor: '',
      rentabilidade: '',
      data: new Date().toISOString().split('T')[0]
    });
  };

  const removerInvestimento = (id) => {
    const investimento = investimentos.find(i => i.id === id);
    setInvestimentos(investimentos.filter(i => i.id !== id));
    
    // Restaurar saldo
    if (investimento) {
      setUserData({
        ...userData,
        saldo: userData.saldo + investimento.valor
      });
    }
  };

  const tiposInvestimento = {
    'renda-fixa': 'Renda Fixa',
    'renda-variavel': 'Renda Variável',
    'fundo': 'Fundo de Investimento',
    'cripto': 'Criptomoedas',
    'outros': 'Outros'
  };

  const calcularValorAtual = (investimento) => {
    const meses = (new Date().getFullYear() - new Date(investimento.data).getFullYear()) * 12 + 
                 (new Date().getMonth() - new Date(investimento.data).getMonth());
    const rentabilidadeMensal = investimento.rentabilidade / 100 / 12;
    return investimento.valor * Math.pow(1 + rentabilidadeMensal, meses);
  };

  const totalInvestido = investimentos.reduce((total, inv) => total + inv.valor, 0);
  const totalAtual = investimentos.reduce((total, inv) => total + calcularValorAtual(inv), 0);
  const lucroPrejuizo = totalAtual - totalInvestido;

  return (
    <div className="investimentos">
      <h2>Meus Investimentos</h2>
      
      <div className="investimentos-content">
        <div className="investimentos-form">
          <h3>Adicionar Investimento</h3>
          <form onSubmit={adicionarInvestimento}>
            <div className="form-group">
              <label>Nome do Investimento:</label>
              <input
                type="text"
                name="nome"
                value={novoInvestimento.nome}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Tipo:</label>
              <select
                name="tipo"
                value={novoInvestimento.tipo}
                onChange={handleInputChange}
              >
                {Object.entries(tiposInvestimento).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Valor Investido (R$):</label>
              <input
                type="number"
                step="0.01"
                name="valor"
                value={novoInvestimento.valor}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Rentabilidade Anual (%):</label>
              <input
                type="number"
                step="0.01"
                name="rentabilidade"
                value={novoInvestimento.rentabilidade}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label>Data do Investimento:</label>
              <input
                type="date"
                name="data"
                value={novoInvestimento.data}
                onChange={handleInputChange}
              />
            </div>
            
            <button type="submit" className="btn-primary">Adicionar Investimento</button>
          </form>
        </div>
        
        <div className="investimentos-list">
          <h3>Resumo dos Investimentos</h3>
          <div className="resumo-investimentos">
            <p>Total Investido: <strong>R$ {totalInvestido.toFixed(2)}</strong></p>
            <p>Valor Atual: <strong>R$ {totalAtual.toFixed(2)}</strong></p>
            <p className={lucroPrejuizo >= 0 ? 'positivo' : 'negativo'}>
              Lucro/Prejuízo: <strong>R$ {lucroPrejuizo.toFixed(2)}</strong>
            </p>
            <p>Rentabilidade Total: <strong>{(lucroPrejuizo / totalInvestido * 100).toFixed(2)}%</strong></p>
          </div>
          
          {investimentos.length === 0 ? (
            <p>Nenhum investimento registrado.</p>
          ) : (
            <div className="investimentos-table">
              {investimentos.map(investimento => {
                const valorAtual = calcularValorAtual(investimento);
                const lucro = valorAtual - investimento.valor;
                
                return (
                  <div key={investimento.id} className="investimento-item">
                    <div className="investimento-info">
                      <span className="investimento-nome">{investimento.nome}</span>
                      <span className="investimento-tipo">{tiposInvestimento[investimento.tipo]}</span>
                      <span className="investimento-data">{investimento.data}</span>
                      <span className="investimento-valor">R$ {investimento.valor.toFixed(2)}</span>
                      <span className="investimento-atual">R$ {valorAtual.toFixed(2)}</span>
                      <span className={`investimento-lucro ${lucro >= 0 ? 'positivo' : 'negativo'}`}>
                        {lucro >= 0 ? '+' : ''}R$ {lucro.toFixed(2)}
                      </span>
                    </div>
                    <button 
                      onClick={() => removerInvestimento(investimento.id)}
                      className="btn-remover"
                    >
                      Remover
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Investimentos;