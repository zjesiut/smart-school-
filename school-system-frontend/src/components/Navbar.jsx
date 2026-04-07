import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = {
  Admin:   [
    { to: '/dashboard', label: '🏠 Home' },
    { to: '/users',     label: '👤 Register' },
    { to: '/students',  label: '👨‍🎓 Students' },
    { to: '/teachers',  label: '👩‍🏫 Teachers' },
    { to: '/courses',   label: '📚 Courses' },
    { to: '/results',   label: '📊 Results' },
    { to: '/payments',  label: '💰 Payments' },
  ],
  Teacher: [
    { to: '/dashboard', label: '🏠 Home' },
    { to: '/students',  label: '👨‍🎓 Students' },
    { to: '/courses',   label: '📚 Courses' },
    { to: '/results',   label: '📊 Grades' },
  ],
  Student: [
    { to: '/dashboard', label: '🏠 Home' },
    { to: '/courses',   label: '📚 Courses' },
    { to: '/results',   label: '📊 My Grades' },
    { to: '/payments',  label: '💰 Payments' },
  ],
};

const ROLE_COLORS = { Admin: '#4f46e5', Teacher: '#059669', Student: '#0891b2' };
const ROLE_ICONS  = { Admin: '👑', Teacher: '👩‍🏫', Student: '👨‍🎓' };

const Navbar = ({ user, logout }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = user ? (NAV_LINKS[user.role] || []) : [];
  const roleColor = ROLE_COLORS[user?.role] || '#4f46e5';

  const linkStyle = (to) => ({
    color: location.pathname === to ? '#fff' : 'rgba(255,255,255,.7)',
    textDecoration: 'none',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '13.5px',
    fontWeight: location.pathname === to ? 700 : 500,
    background: location.pathname === to ? 'rgba(255,255,255,.18)' : 'transparent',
    transition: 'all .2s',
    whiteSpace: 'nowrap',
  });

  return (
    <nav style={{
      background: 'linear-gradient(90deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)',
      boxShadow: '0 2px 12px rgba(0,0,0,.25)',
      position: 'sticky', top: 0, zIndex: 100,
      fontFamily: "'Inter', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '62px' }}>

        {/* Logo */}
        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>🏫</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: '15px', lineHeight: 1.2 }}>Smart School</div>
            <div style={{ color: 'rgba(255,255,255,.5)', fontSize: '10px', lineHeight: 1 }}>Management System</div>
          </div>
        </Link>

        {/* Nav links — desktop */}
        {user && (
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', overflowX: 'auto' }}>
            {links.map(l => (
              <Link key={l.to} to={l.to} style={linkStyle(l.to)}>{l.label}</Link>
            ))}
          </div>
        )}

        {/* Right side */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            {/* Role pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(255,255,255,.1)', borderRadius: '20px', border: '1px solid rgba(255,255,255,.15)' }}>
              <span style={{ fontSize: '14px' }}>{ROLE_ICONS[user.role]}</span>
              <div>
                <div style={{ color: '#fff', fontSize: '13px', fontWeight: 700, lineHeight: 1.2 }}>{user.name?.split(' ')[0]}</div>
                <div style={{ color: roleColor, fontSize: '10px', fontWeight: 600 }}>{user.role}</div>
              </div>
            </div>
            <button
              id="navbar-logout"
              onClick={logout}
              style={{ background: 'rgba(239,68,68,.85)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit', transition: 'background .2s' }}
              onMouseOver={e => e.target.style.background = '#dc2626'}
              onMouseOut={e => e.target.style.background = 'rgba(239,68,68,.85)'}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" style={{ color: '#fff', textDecoration: 'none', padding: '9px 20px', background: '#4f46e5', borderRadius: '8px', fontSize: '14px', fontWeight: 600 }}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
