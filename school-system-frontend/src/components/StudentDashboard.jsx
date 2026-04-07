import React, { useState, useEffect } from 'react';
import api from '../services/api';

const S = {
  page: { padding: '30px', maxWidth: '1100px', margin: '0 auto', fontFamily: "'Inter', sans-serif", minHeight: 'calc(100vh - 80px)', background: '#f8fafc' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
  card: (accent = '#4f46e5') => ({ background: '#fff', borderRadius: '14px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,.08), 0 4px 16px rgba(0,0,0,.04)', borderTop: `4px solid ${accent}` }),
  title: { fontSize: '13px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '16px' },
  stat: { fontSize: '32px', fontWeight: 800, color: '#1a202c', marginBottom: '4px' },
  statSub: { fontSize: '13px', color: '#9ca3af' },
  profileRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '14px' },
  label: { color: '#6b7280', fontWeight: 500 },
  value: { color: '#1a202c', fontWeight: 600 },
  badge: (color = '#4f46e5') => ({ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, background: color + '1a', color }),
  gradeRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '8px', background: '#f8fafc', marginBottom: '8px', border: '1px solid #e2e8f0', fontSize: '14px' },
  gradeScore: (score) => { const n = parseFloat(score); return { fontWeight: 800, color: n >= 80 ? '#059669' : n >= 60 ? '#d97706' : '#dc2626' }; },
  welcome: { marginBottom: '28px' },
  welcomeTitle: { fontSize: '24px', fontWeight: 800, color: '#1a202c', marginBottom: '4px' },
  welcomeSub: { color: '#6b7280', fontSize: '15px' },
  avatar: { width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '24px', fontWeight: 800, marginBottom: '16px' },
  payRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '8px', background: '#f8fafc', marginBottom: '8px', border: '1px solid #e2e8f0', fontSize: '14px' },
};

const gradeColor = (score) => {
  const n = parseFloat(score);
  if (n >= 80) return '#059669';
  if (n >= 60) return '#d97706';
  return '#dc2626';
};

const StudentDashboard = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [results, setResults] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profRes, resRes] = await Promise.allSettled([
          api.get('/students/me'),
          api.get('/results/my'),
        ]);
        if (profRes.status === 'fulfilled') setProfile(profRes.value.data);
        if (resRes.status === 'fulfilled') {
          // /results/my returns { results, gpa }
          const data = resRes.value.data;
          setResults(data.results || data || []);
        }
      } catch (e) { /* graceful */ }
      setLoading(false);
    };
    fetchAll();
  }, []);

  const initials = (user?.name || 'S').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const avgScore = results.length
    ? (results.reduce((sum, r) => sum + (parseFloat(r.score) || 0), 0) / results.length).toFixed(1)
    : null;

  return (
    <div style={S.page}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Welcome header */}
      <div style={S.welcome}>
        <div style={S.avatar}>{initials}</div>
        <div style={S.welcomeTitle}>Welcome back, {user?.name}! 👋</div>
        <div style={S.welcomeSub}>Here's your academic overview for 2016 E.C.</div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Grade', val: profile?.grade ? `Grade ${profile.grade}` : '—', color: '#4f46e5', icon: '🎓' },
          { label: 'Section', val: profile?.section || '—', color: '#0891b2', icon: '🏫' },
          { label: 'Stream', val: profile?.stream || '—', color: '#7c3aed', icon: '📚' },
          { label: 'Avg. Score', val: avgScore ? `${avgScore}%` : '—', color: avgScore ? (parseFloat(avgScore) >= 70 ? '#059669' : '#dc2626') : '#6b7280', icon: '📊' },
          { label: 'Subjects', val: results.length || 0, color: '#d97706', icon: '📝' },
        ].map(item => (
          <div key={item.label} style={{ background: '#fff', borderRadius: '12px', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,.06)', borderLeft: `4px solid ${item.color}` }}>
            <div style={{ fontSize: '22px', marginBottom: '8px' }}>{item.icon}</div>
            <div style={{ ...S.stat, fontSize: '22px', color: item.color }}>{loading ? '…' : item.val}</div>
            <div style={S.statSub}>{item.label}</div>
          </div>
        ))}
      </div>

      <div style={S.grid}>
        {/* Profile Card */}
        <div style={S.card('#4f46e5')}>
          <div style={S.title}>My Profile</div>
          {[
            ['Full Name', user?.name],
            ['Email', user?.email],
            ['School ID', user?.schoolId || profile?.schoolId || '—'],
            ['Role', user?.role],
            ['Guardian', profile?.guardianName || '—'],
            ['Guardian Phone', profile?.guardianPhone || '—'],
            ['Academic Year', profile?.academicYear || '2016 E.C.'],
          ].map(([k, v]) => (
            <div key={k} style={S.profileRow}>
              <span style={S.label}>{k}</span>
              <span style={S.value}>{loading ? '…' : v}</span>
            </div>
          ))}
        </div>

        {/* Grades Card */}
        <div style={S.card('#059669')}>
          <div style={S.title}>My Grades</div>
          {loading ? <div style={{ color: '#9ca3af', fontSize: '14px' }}>Loading grades…</div>
            : results.length === 0 ? <div style={{ color: '#9ca3af', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>No grades recorded yet</div>
            : results.map((r, i) => (
              <div key={i} style={S.gradeRow}>
                <span style={{ fontWeight: 600, color: '#374151' }}>{r.subject || r.course?.name || 'Subject'}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ ...S.gradeScore(r.score), fontSize: '18px' }}>{r.score}%</span>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '12px', background: gradeColor(r.score) + '1a', color: gradeColor(r.score), fontWeight: 700 }}>
                    {parseFloat(r.score) >= 80 ? 'A' : parseFloat(r.score) >= 70 ? 'B' : parseFloat(r.score) >= 60 ? 'C' : 'F'}
                  </span>
                </div>
              </div>
            ))
          }
          {avgScore && (
            <div style={{ marginTop: '12px', padding: '10px 14px', background: '#f0fdf4', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '14px', color: '#166534' }}>
              <span>Overall Average</span>
              <span>{avgScore}%</span>
            </div>
          )}
        </div>

        {/* Academic Info */}
        <div style={S.card('#0891b2')}>
          <div style={S.title}>Academic Details</div>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>
              {profile?.grade ? (profile.grade >= 11 ? (profile.stream === 'Natural Science' ? '🔬' : '📖') : '🏫') : '🎒'}
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#1a202c', marginBottom: '4px' }}>
              Grade {loading ? '…' : profile?.grade || '—'} — Section {loading ? '…' : profile?.section || '—'}
            </div>
            <div style={{ marginTop: '8px' }}>
              <span style={S.badge('#0891b2')}>{loading ? '…' : profile?.stream || 'General'}</span>
            </div>
            <div style={{ marginTop: '20px', padding: '14px', background: '#f0f9ff', borderRadius: '10px', fontSize: '13px', color: '#0369a1' }}>
              <strong>Academic Year:</strong> {loading ? '…' : profile?.academicYear || '2016 E.C.'}
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div style={S.card('#d97706')}>
          <div style={S.title}>School Info</div>
          <div style={{ padding: '12px 0' }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>Your registered school details and account information.</div>
            {[
              ['Registered Email', user?.email],
              ['Account Type', 'Student'],
              ['Status', '✅ Active'],
              ['School', 'Ethiopian Smart School'],
              ['Location', 'Addis Ababa, Ethiopia'],
            ].map(([k, v]) => (
              <div key={k} style={S.profileRow}>
                <span style={S.label}>{k}</span>
                <span style={S.value}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
