// components/TesouroDireto.js
import React, { useState } from 'react';

const TesouroDireto = ({ userData, setUserData }) => {
  const [simulacao, setSimulacao] = useState({
    valor: '',
    tipo: 'selic',
    prazo: '12'
  });
  const [resultado, setResultado] = useState(null);

  const tiposTesouro = {
    selic: { nome: 'Tesouro Selic', rentabilidade: 0.1175 },
    prefixado: { nome: 'Tesouro Prefixado', rentabilidade: 0.105 },
    ipca: { nome: 'Tesouro IPCA+', rentabilidade: 0.055 }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSimulacao({
      ...simulacao,
      [name]: value
    });
  };

  const simularInvestimento = (e) => {
    e.preventDefault();
    if (!simulacao.valor) return;

    const valor = parseFloat(simulacao.valor);
    const prazo = parseInt(simulacao.prazo);
    const tipo = tiposTesouro[simulacao.tipo];
    
    const rentabilidadeMensal = tipo.rentabilidade / 12;
    const valorFinal = valor * Math.pow(1 + rentabilidadeMensal, prazo);
    const lucro = valorFinal - valor;

    setResultado({
      valorInicial: valor,
      valorFinal,
      lucro,
      rentabilidade: tipo.rentabilidade * 100,
      prazo
    });
  };

  return (
    <div className="tesouro-direto">
      <h2>Simulador Tesouro Direto</h2>
      
      <div className="tesouro-content">
        <div className="tesouro-form">
          <h3>Simular Investimento</h3>
          <form onSubmit={simularInvestimento}>
            <div className="form-group">
              <label>Valor do Investimento (R$):</label>
              <input
                type="number"
                step="0.01"
                name="valor"
                value={simulacao.valor}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Tipo de Tesouro:</label>
              <select
                name="tipo"
                value={simulacao.tipo}
                onChange={handleInputChange}
              >
                {Object.entries(tiposTesouro).map(([key, value]) => (
                  <option key={key} value={key}>{value.nome}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Prazo (meses):</label>
              <select
                name="prazo"
                value={simulacao.prazo}
                onChange={handleInputChange}
              >
                <option value="6">6 meses</option>
                <option value="12">1 ano</option>
                <option value="24">2 anos</option>
                <option value="36">3 anos</option>
                <option value="60">5 anos</option>
              </select>
            </div>
            
            <button type="submit" className="btn-primary">Simular</button>
          </form>
        </div>
        
        <div className="tesouro-info">
          <h3>Tipos de Tesouro Direto</h3>
          <div className="tipos-tesouro">
            {Object.entries(tiposTesouro).map(([key, value]) => (
              <div key={key} className="tipo-tesouro">
                <h4>{value.nome}</h4>
                <p>Rentabilidade anual estimada: {(value.rentabilidade * 100).toFixed(2)}%</p>
                <p>
                  {key === 'selic' && 'Vinculado à taxa Selic - pós-fixado'}
                  {key === 'prefixado' && 'Taxa fixa - prefixado'}
                  {key === 'ipca' && 'IPCA + taxa fixa - protegido da inflação'}
                </p>
              </div>
            ))}
          </div>
          
          {resultado && (
            <div className="resultado-simulacao">
              <h3>Resultado da Simulação</h3>
              <div className="resultado-item">
                <span>Valor Investido:</span>
                <span>R$ {resultado.valorInicial.toFixed(2)}</span>
              </div>
              <div className="resultado-item">
                <span>Valor Final ({resultado.prazo} meses):</span>
                <span>R$ {resultado.valorFinal.toFixed(2)}</span>
              </div>
              <div className="resultado-item">
                <span>Lucro:</span>
                <span className="positivo">R$ {resultado.lucro.toFixed(2)}</span>
              </div>
              <div className="resultado-item">
                <span>Rentabilidade Total:</span>
                <span className="positivo">{((resultado.valorFinal - resultado.valorInicial) / resultado.valorInicial * 100).toFixed(2)}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TesouroDireto;