// components/Metas.js
import React, { useState } from 'react';

const Metas = ({ userData, setUserData }) => {
  const [novaMeta, setNovaMeta] = useState({
    descricao: '',
    valor: '',
    prazo: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovaMeta({
      ...novaMeta,
      [name]: value
    });
  };

  const atualizarMetaMensal = (e) => {
    e.preventDefault();
    if (!novaMeta.valor) return;

    setUserData({
      ...userData,
      metaMensal: parseFloat(novaMeta.valor)
    });

    setNovaMeta({
      descricao: '',
      valor: '',
      prazo: ''
    });
  };

  return (
    <div className="metas">
      <h3>Metas Financeiras</h3>
      
          <div className="meta-atual">
            <h4>Meta Mensal de Gastos</h4>
            <p>Valor: <strong>R$ {userData.metaMensal.toFixed(2)}</strong></p>
          </div>
    
          <form onSubmit={atualizarMetaMensal} className="meta-form">
            <div className="form-group">
              <label>Nova Meta Mensal (R$):</label>
              <input
                type="number"
                step="0.01"
                name="valor"
                value={novaMeta.valor}
                onChange={handleInputChange}
                placeholder="Digite o valor da meta"
              />
            </div>
            <button type="submit" className="btn-secondary">Atualizar Meta</button>
          </form>
          
          <div className="dicas-metas">
            <h4>Dicas para Alcançar suas Metas:</h4>
            <ul>
              <li>Estabeleça metas realistas e mensuráveis</li>
              <li>Divida metas grandes em etapas menores</li>
              <li>Celebre pequenas conquistas</li>
              <li>Ajuste suas metas conforme necessário</li>
            </ul>
          </div>
        </div>
      );
    };
    
    export default Metas;