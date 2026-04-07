import React, { useState } from 'react';
import api from '../services/api';

const Login = ({ login }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', formData);
      login(res.data.user, res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    const creds = {
      Admin: { email: 'admin@school.com', password: 'Admin@123' },
    };
    if (creds[role]) setFormData(creds[role]);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4f46e5 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Decorative blobs */}
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(124,58,237,.25)', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(8,145,178,.2)', filter: 'blur(60px)' }} />

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>
        {/* Logo / Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', margin: '0 auto 16px', border: '1px solid rgba(255,255,255,.2)' }}>
            🏫
          </div>
          <h1 style={{ color: '#fff', fontSize: '26px', fontWeight: 800, margin: '0 0 6px' }}>Smart School</h1>
          <p style={{ color: 'rgba(255,255,255,.65)', fontSize: '14px', margin: 0 }}>Ethiopian School Management System</p>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(255,255,255,.97)', borderRadius: '20px', padding: '36px', boxShadow: '0 24px 80px rgba(0,0,0,.3)', border: '1px solid rgba(255,255,255,.5)' }}>
          <h2 style={{ margin: '0 0 6px', color: '#1a202c', fontSize: '20px', fontWeight: 700 }}>Welcome back</h2>
          <p style={{ margin: '0 0 24px', color: '#6b7280', fontSize: '14px' }}>Sign in to your school account</p>

          {error && (
            <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '10px', marginBottom: '20px', fontSize: '14px', color: '#dc2626', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>📧</span>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  placeholder="you@school.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  style={{ width: '100%', padding: '12px 14px 12px 42px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit', transition: 'border .2s', background: loading ? '#f9fafb' : '#fff' }}
                  onFocus={e => e.target.style.borderColor = '#4f46e5'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>🔒</span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  style={{ width: '100%', padding: '12px 44px 12px 42px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit', transition: 'border .2s', background: loading ? '#f9fafb' : '#fff' }}
                  onFocus={e => e.target.style.borderColor = '#4f46e5'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '4px' }}>
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '14px', background: loading ? '#a5b4fc' : 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'all .2s', boxShadow: loading ? 'none' : '0 4px 14px rgba(79,70,229,.4)' }}>
              {loading ? '⏳ Signing in…' : '🚀 Sign In'}
            </button>
          </form>

          {/* Role hints */}
          <div style={{ marginTop: '24px', padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '10px' }}>Login as Role</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { role: 'Admin', icon: '👑', color: '#4f46e5', hint: 'admin@school.com' },
                { role: 'Teacher', icon: '👩‍🏫', color: '#059669', hint: 'use your school email' },
                { role: 'Student', icon: '👨‍🎓', color: '#0891b2', hint: 'use your school email' },
              ].map(item => (
                <div key={item.role} style={{ flex: 1, minWidth: '100px', padding: '10px', background: item.color + '08', border: `1px solid ${item.color}25`, borderRadius: '8px', cursor: item.role === 'Admin' ? 'pointer' : 'default' }}
                  onClick={() => item.role === 'Admin' && fillDemo(item.role)}
                  title={item.role === 'Admin' ? 'Click to fill admin credentials' : ''}>
                  <div style={{ fontSize: '18px', marginBottom: '4px' }}>{item.icon}</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: item.color }}>{item.role}</div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>{item.hint}</div>
                  {item.role === 'Admin' && <div style={{ fontSize: '10px', color: item.color, marginTop: '4px', fontWeight: 600 }}>Click to fill ↗</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', color: 'rgba(255,255,255,.5)', fontSize: '12px' }}>
          © 2016 E.C. Ethiopian Smart School Management System
        </div>
      </div>
    </div>
  );
};

export default Login;