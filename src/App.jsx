// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'; // 1. Importe o ProtectedRoute
import './App.css';

const Simulation = () => <div style={{ padding: '2rem' }}>Página de Simulação - Em desenvolvimento</div>;
const Dashboard = () => <div style={{ padding: '2rem' }}>Dashboard - Em desenvolvimento</div>;

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* 2. Crie um grupo de rotas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/simulation" element={<Simulation />} />
          </Route>

        </Routes>
      </div>
    </Router>
  );
}

export default App;