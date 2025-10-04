// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage'; // Página inicial
import Home from './pages/Home/Home'; // Página home simples
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import './App.css';

// Componentes placeholder para as outras páginas
const Simulation = () => <div style={{ padding: '2rem' }}>Página de Simulação - Em desenvolvimento</div>;
const Dashboard = () => <div style={{ padding: '2rem' }}>Dashboard - Em desenvolvimento</div>;

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} /> {/* Página inicial */}
          <Route path="/home" element={<Home />} /> {/* Página home simples */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;