// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Laddingpage/Landingpage';
import './App.css';

// Componentes placeholder para as outras páginas
const Login = () => <div style={{ padding: '2rem' }}>Página de Login - Em desenvolvimento</div>;
const Register = () => <div style={{ padding: '2rem' }}>Página de Registro - Em desenvolvimento</div>;
const Simulation = () => <div style={{ padding: '2rem' }}>Página de Simulação - Em desenvolvimento</div>;
const Dashboard = () => <div style={{ padding: '2rem' }}>Dashboard - Em desenvolvimento</div>;

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
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