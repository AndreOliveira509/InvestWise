// components/EducacaoFinanceira.js
import React, { useState } from 'react';

const EducacaoFinanceira = () => {
  const [artigoAtivo, setArtigoAtivo] = useState(0);

  const artigos = [
    {
      titulo: "Como Criar um Orçamento Pessoal",
      conteudo: `
        <h3>Passo a passo para criar um orçamento eficiente:</h3>
        <ol>
          <li>Liste todas as suas fontes de renda</li>
          <li>Identifique seus gastos fixos (aluguel, contas, etc.)</li>
          <li>Registre seus gastos variáveis (alimentação, lazer, etc.)</li>
          <li>Estabeleça metas de economia</li>
          <li>Acompanhe e ajuste mensalmente</li>
        </ol>
        <p><strong>Dica:</strong> Use a regra 50-30-20: 50% para necessidades, 30% para desejos e 20% para poupança.</p>
      `
    },
    {
      titulo: "Fundamentos dos Investimentos",
      conteudo: `
        <h3>Conceitos básicos para começar a investir:</h3>
        <ul>
          <li><strong>Renda Fixa:</strong> Investimentos com retorno previsível (CDB, Tesouro Direto)</li>
          <li><strong>Renda Variável:</strong> Investimentos com retorno incerto (Ações, Fundos)</li>
          <li><strong>Diversificação:</strong> Não coloque todos os ovos na mesma cesta</li>
          <li><strong>Juros Compostos:</strong> Seu maior aliado no longo prazo</li>
          <li><strong>Liquidez:</strong> Facilidade de converter em dinheiro</li>
        </ul>
      `
    },
    {
      titulo: "Como Reduzir Gastos Desnecessários",
      conteudo: `
        <h3>Estratégias para economizar:</h3>
        <ul>
          <li>Faça uma lista antes de ir ao supermercado</li>
          <li>Compare preços antes de comprar</li>
          <li>Evite compras por impulso</li>
          <li>Utilize aplicativos de cashback</li>
          <li>Revise assinaturas e serviços não utilizados</li>
        </ul>
        <p><strong>Lembre-se:</strong> Pequenas economias diárias podem se tornar grandes montantes ao longo do tempo.</p>
      `
    },
    {
      titulo: "Planejamento para Aposentadoria",
      conteudo: `
        <h3>Como se preparar para o futuro:</h3>
        <ul>
          <li>Comece o mais cedo possível</li>
          <li>Estabeleça metas claras de aposentadoria</li>
          <li>Diversifique seus investimentos</li>
          <li>Considere a Previdência Privada</li>
          <li>Ajuste seu plano conforme sua idade e objetivos</li>
        </ul>
        <p><strong>Importante:</strong> Quanto antes você começar, menos precisará poupar mensalmente.</p>
      `
    }
  ];

  return (
    <div className="educacao-financeira">
      <h2>Educação Financeira</h2>
      
      <div className="educacao-content">
        <div className="artigos-lista">
          <h3>Artigos Educativos</h3>
          <ul>
            {artigos.map((artigo, index) => (
              <li key={index}>
                <button 
                  className={`artigo-btn ${artigoAtivo === index ? 'active' : ''}`}
                  onClick={() => setArtigoAtivo(index)}
                >
                  {artigo.titulo}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="artigo-conteudo">
          <h3>{artigos[artigoAtivo].titulo}</h3>
          <div 
            dangerouslySetInnerHTML={{ __html: artigos[artigoAtivo].conteudo }}
          />
        </div>
      </div>
      
      <div className="calculadoras">
        <h3>Calculadoras Financeiras</h3>
        <div className="calculadoras-grid">
          <div className="calculadora">
            <h4>Juros Compostos</h4>
            <p>Calcule quanto seu dinheiro pode render ao longo do tempo</p>
          </div>
          <div className="calculadora">
            <h4>Valor Futuro</h4>
            <p>Descubra quanto você precisa poupar para atingir seus objetivos</p>
          </div>
          <div className="calculadora">
            <h4>Financiamento</h4>
            <p>Simule parcelas de empréstimos e financiamentos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducacaoFinanceira;