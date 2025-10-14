// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Simulation from './pages/Simulation/Simulation';
import Profile from './pages/Profile/Profile';
import AIQuestions from './pages/AIQuestions/AIQuestions';
import AboutUs from './pages/AboutUs/AboutUs'; // 1. Importe a nova página
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import './App.css';


function App() {
  return (
    <Router>
      <div className="App">
       <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/aiquestions" element={<AIQuestions />} />
            <Route path="/about-us" element={<AboutUs />} /> {/* 2. Adicione a nova rota */}
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;