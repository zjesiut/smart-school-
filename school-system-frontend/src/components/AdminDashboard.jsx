import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const S = {
  page: { padding: '30px', maxWidth: '1200px', margin: '0 auto', fontFamily: "'Inter', sans-serif", minHeight: 'calc(100vh - 80px)', background: '#f8fafc' },
  welcome: { marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' },
  welcomeLeft: {},
  welcomeTitle: { fontSize: '26px', fontWeight: 800, color: '#1a202c', marginBottom: '4px' },
  welcomeSub: { color: '#6b7280', fontSize: '15px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' },
  statCard: (color) => ({ background: '#fff', borderRadius: '14px', padding: '22px 24px', boxShadow: '0 1px 3px rgba(0,0,0,.06)', borderLeft: `5px solid ${color}`, display: 'flex', alignItems: 'center', gap: '16px' }),
  statIcon: (color) => ({ width: '52px', height: '52px', borderRadius: '12px', background: color + '1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }),
  statNum: { fontSize: '28px', fontWeight: 800, color: '#1a202c', lineHeight: 1 },
  statLabel: { fontSize: '13px', color: '#6b7280', marginTop: '4px', fontWeight: 500 },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' },
  card: (accent = '#4f46e5') => ({ background: '#fff', borderRadius: '14px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,.08)', borderTop: `4px solid ${accent}` }),
  cardTitle: { fontSize: '16px', fontWeight: 700, color: '#1a202c', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardLink: { fontSize: '13px', color: '#4f46e5', fontWeight: 600, textDecoration: 'none' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontSize: '14px' },
  name: { fontWeight: 600, color: '#1a202c' },
  sub: { fontSize: '12px', color: '#9ca3af', marginTop: '1px' },
  badge: (color = '#4f46e5') => ({ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, background: color + '1a', color }),
  quickBtn: (color) => ({ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 18px', background: '#fff', border: `1.5px solid ${color}20`, borderRadius: '10px', textDecoration: 'none', color: '#1a202c', fontWeight: 600, fontSize: '14px', transition: 'all .2s', boxShadow: '0 1px 3px rgba(0,0,0,.04)', cursor: 'pointer' }),
  quickIcon: (color) => ({ width: '36px', height: '36px', background: color + '1a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }),
};

const AdminDashboard = ({ user }) => {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([api.get('/students'), api.get('/teachers')])
      .then(([s, t]) => {
        if (s.status === 'fulfilled') setStudents(s.value.data || []);
        if (t.status === 'fulfilled') setTeachers(t.value.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  // Grade distribution
  const gradeMap = {};
  students.forEach(s => { gradeMap[s.grade] = (gradeMap[s.grade] || 0) + 1; });

  // Recent additions (last 5)
  const recentStudents = [...students].reverse().slice(0, 5);
  const recentTeachers = [...teachers].reverse().slice(0, 5);

  return (
    <div style={S.page}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={S.welcome}>
        <div style={S.welcomeLeft}>
          <div style={S.welcomeTitle}>🏫 Admin Dashboard</div>
          <div style={S.welcomeSub}>Welcome back, <strong>{user?.name}</strong> — here's your school at a glance.</div>
        </div>
        <div style={{ fontSize: '13px', color: '#9ca3af', textAlign: 'right' }}>
          <div>Academic Year 2016 E.C.</div>
          <div>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
      </div>

      {/* Stats */}
      <div style={S.statsGrid}>
        {[
          { label: 'Total Students', val: students.length, color: '#4f46e5', icon: '👨‍🎓' },
          { label: 'Total Teachers', val: teachers.length, color: '#059669', icon: '👩‍🏫' },
          { label: 'Grade 9 Students', val: students.filter(s => s.grade === 9).length, color: '#0891b2', icon: '📘' },
          { label: 'Nat. Science (11-12)', val: students.filter(s => s.stream === 'Natural Science').length, color: '#7c3aed', icon: '🔬' },
          { label: 'Social Science (11-12)', val: students.filter(s => s.stream === 'Social Science').length, color: '#d97706', icon: '📖' },
        ].map(item => (
          <div key={item.label} style={S.statCard(item.color)}>
            <div style={S.statIcon(item.color)}>{item.icon}</div>
            <div>
              <div style={S.statNum}>{loading ? '…' : item.val}</div>
              <div style={S.statLabel}>{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Grade Distribution Bar */}
      <div style={{ ...S.card('#0891b2'), marginBottom: '20px' }}>
        <div style={S.cardTitle}>Grade Distribution</div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', height: '80px' }}>
          {[9, 10, 11, 12].map(g => {
            const count = gradeMap[g] || 0;
            const max = Math.max(...Object.values(gradeMap), 1);
            const pct = (count / max) * 100;
            return (
              <div key={g} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a202c' }}>{loading ? '…' : count}</div>
                <div style={{ width: '100%', height: `${Math.max(pct, 4)}%`, background: 'linear-gradient(180deg, #4f46e5, #7c3aed)', borderRadius: '6px 6px 0 0', transition: 'height .5s' }} />
                <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>Gr {g}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent tables */}
      <div style={S.grid2}>
        {/* Recent Students */}
        <div style={S.card('#4f46e5')}>
          <div style={S.cardTitle}>
            <span>Recent Students</span>
            <Link to="/students" style={S.cardLink}>View all →</Link>
          </div>
          {loading ? <div style={{ color: '#9ca3af', fontSize: '14px' }}>Loading…</div>
            : recentStudents.length === 0 ? <div style={{ color: '#9ca3af', fontSize: '14px' }}>No students yet</div>
            : recentStudents.map((s, i) => (
              <div key={i} style={S.row}>
                <div>
                  <div style={S.name}>{s.user?.name || '—'}</div>
                  <div style={S.sub}>{s.user?.email}</div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={S.badge('#4f46e5')}>Gr {s.grade}</span>
                  <span style={S.badge('#0891b2')}>Sec {s.section}</span>
                </div>
              </div>
            ))
          }
        </div>

        {/* Recent Teachers */}
        <div style={S.card('#059669')}>
          <div style={S.cardTitle}>
            <span>Recent Teachers</span>
            <Link to="/teachers" style={S.cardLink}>View all →</Link>
          </div>
          {loading ? <div style={{ color: '#9ca3af', fontSize: '14px' }}>Loading…</div>
            : recentTeachers.length === 0 ? <div style={{ color: '#9ca3af', fontSize: '14px' }}>No teachers yet</div>
            : recentTeachers.map((t, i) => (
              <div key={i} style={S.row}>
                <div>
                  <div style={S.name}>{t.user?.name || '—'}</div>
                  <div style={S.sub}>{t.user?.email}</div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', maxWidth: '160px', justifyContent: 'flex-end' }}>
                  {(t.assignedSubjects || []).slice(0, 2).map((subj, j) => (
                    <span key={j} style={S.badge('#059669')}>{subj}</span>
                  ))}
                  {(t.assignedSubjects || []).length > 2 && <span style={S.badge('#6b7280')}>+{t.assignedSubjects.length - 2}</span>}
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ ...S.card('#d97706'), marginBottom: '0' }}>
        <div style={S.cardTitle}>Quick Actions</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          {[
            { to: '/users', icon: '👤', label: 'Register User', color: '#4f46e5' },
            { to: '/users', icon: '📋', label: 'Bulk Register', color: '#059669' },
            { to: '/students', icon: '👨‍🎓', label: 'Manage Students', color: '#0891b2' },
            { to: '/teachers', icon: '👩‍🏫', label: 'Manage Teachers', color: '#7c3aed' },
            { to: '/results', icon: '📊', label: 'View Results', color: '#d97706' },
            { to: '/payments', icon: '💰', label: 'Payments', color: '#dc2626' },
          ].map(item => (
            <Link key={item.label} to={item.to} style={S.quickBtn(item.color)}>
              <div style={S.quickIcon(item.color)}>{item.icon}</div>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
