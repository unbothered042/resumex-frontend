import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Results from './pages/Results';
import History from './pages/History';
import AdminUsers from './pages/AdminUsers';
import Plans from './pages/Plans';
import Rebuild from './pages/Rebuild';
import CreateCV from './pages/CreateCV';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/results" element={<Results />} />
        <Route path="/history" element={<History />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/rebuild" element={<Rebuild />} />
        <Route path="/create" element={<CreateCV />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </Router>
  );
}

export default App;