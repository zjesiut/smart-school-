import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Students from './components/Students';
import Teachers from './components/Teachers';
import Courses from './components/Courses';
import Results from './components/Results';
import Payments from './components/Payments';
import UserManagement from './components/UserManagement';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try { setUser(JSON.parse(userData)); } catch (_) {}
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Protected route helper
  const Protected = ({ element, roles }) => {
    if (!user) return <Navigate to="/login" />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />;
    return element;
  };

  return (
    <Router>
      <div className="App">
        <Navbar user={user} logout={logout} />
        <Routes>
          {/* Auth */}
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login login={login} />} />

          {/* Dashboard — routes internally to Admin/Teacher/Student dashboard */}
          <Route path="/dashboard" element={<Protected element={<Dashboard user={user} />} />} />

          {/* Admin routes */}
          <Route path="/users"    element={<Protected element={<UserManagement />} roles={['Admin']} />} />
          <Route path="/students" element={<Protected element={<Students />} roles={['Admin', 'Teacher']} />} />
          <Route path="/teachers" element={<Protected element={<Teachers />} roles={['Admin']} />} />

          {/* Shared routes */}
          <Route path="/courses"  element={<Protected element={<Courses />} />} />
          <Route path="/results"  element={<Protected element={<Results />} />} />
          <Route path="/payments" element={<Protected element={<Payments />} />} />

          {/* Default */}
          <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
          <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;