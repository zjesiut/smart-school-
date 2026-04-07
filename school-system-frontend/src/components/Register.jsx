import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Register = ({ login }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Student',
    grade: '',
    stream: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/register', formData);
      login(res.data.user, res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const formStyle = {
    maxWidth: '400px',
    margin: '30px auto',
    padding: '30px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    background: '#fff',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  };

  const inputStyle = {
    display: 'block',
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    boxSizing: 'border-box'
  };

  const selectStyle = {
    ...inputStyle,
    background: 'white'
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    background: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px'
  };

  const buttonDisabledStyle = {
    ...buttonStyle,
    background: '#bdc3c7',
    cursor: 'not-allowed'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={formStyle}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: '#2c3e50'
        }}>
          Register for Smart School
        </h2>
        {error && (
          <div style={{
            background: '#ffeaea',
            color: '#e74c3c',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px',
            border: '1px solid #f5c6cb'
          }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={inputStyle}
            disabled={loading}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
            disabled={loading}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={inputStyle}
            disabled={loading}
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={selectStyle}
            disabled={loading}
          >
            <option value="Student">Student</option>
            <option value="Teacher">Teacher</option>
            <option value="Admin">Admin</option>
          </select>
          {formData.role === 'Student' && (
            <>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                required
                style={selectStyle}
                disabled={loading}
              >
                <option value="">Select Grade</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
              </select>
              <select
                name="stream"
                value={formData.stream}
                onChange={handleChange}
                required
                style={selectStyle}
                disabled={loading}
              >
                <option value="">Select Stream</option>
                <option value="Natural">Natural Science</option>
                <option value="Social">Social Science</option>
              </select>
            </>
          )}
          <button
            type="submit"
            style={loading ? buttonDisabledStyle : buttonStyle}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div style={{
          textAlign: 'center',
          marginTop: '20px'
        }}>
          <Link
            to="/login"
            style={{
              color: '#3498db',
              textDecoration: 'none'
            }}
          >
            Already have an account? Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;