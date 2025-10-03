import React from 'react';
import './Preview.module.css';
// Crie a pasta 'assets' dentro de 'src' e coloque sua imagem lá

const Preview = () => {
  return (
    <section className="preview-section">
      <div className="container">
        <h2>Visualize seu sucesso financeiro</h2>
        <p>
          Gráficos intuitivos, como os do Chart.js, te ajudam a entender
          seus hábitos financeiros em segundos.
        </p>
        <div className="image-container">
        </div>
      </div>
    </section>
  );
};

export default Preview;