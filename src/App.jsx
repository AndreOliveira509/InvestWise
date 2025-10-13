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
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'; // 1. Importe o ProtectedRoute
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
          
          {/* 2. Crie um grupo de rotas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/aiquestions" element={<AIQuestions />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;