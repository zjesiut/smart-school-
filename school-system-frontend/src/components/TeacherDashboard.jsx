import React, { useState, useEffect } from 'react';
import api from '../services/api';

const S = {
  page: { padding: '30px', maxWidth: '1100px', margin: '0 auto', fontFamily: "'Inter', sans-serif", minHeight: 'calc(100vh - 80px)', background: '#f8fafc' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
  card: (accent = '#059669') => ({ background: '#fff', borderRadius: '14px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,.08), 0 4px 16px rgba(0,0,0,.04)', borderTop: `4px solid ${accent}` }),
  title: { fontSize: '13px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '16px' },
  stat: { fontSize: '32px', fontWeight: 800, color: '#1a202c', marginBottom: '4px' },
  statSub: { fontSize: '13px', color: '#9ca3af' },
  profileRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '14px' },
  label: { color: '#6b7280', fontWeight: 500 },
  value: { color: '#1a202c', fontWeight: 600 },
  badge: (color = '#059669') => ({ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, background: color + '1a', color }),
  welcome: { marginBottom: '28px' },
  welcomeTitle: { fontSize: '24px', fontWeight: 800, color: '#1a202c', marginBottom: '4px' },
  welcomeSub: { color: '#6b7280', fontSize: '15px' },
  avatar: { width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #059669, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '24px', fontWeight: 800, marginBottom: '16px' },
  studentRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '8px', background: '#f8fafc', marginBottom: '8px', border: '1px solid #e2e8f0', fontSize: '14px' },
  subjectChip: { padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: '#dcfce7', color: '#166534', display: 'inline-block', margin: '3px' },
  gradeChip: { padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: '#dbeafe', color: '#1d4ed8', display: 'inline-block', margin: '3px' },
};

const TeacherDashboard = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [teachRes, studRes] = await Promise.allSettled([
          api.get('/teachers'),
          api.get('/students'),
        ]);
        if (teachRes.status === 'fulfilled') {
          const list = teachRes.value.data || [];
          const mine = list.find(t => t.user?._id === user?.id || t.user?.email === user?.email);
          setProfile(mine);
        }
        if (studRes.status === 'fulfilled') setStudents(studRes.value.data || []);
      } catch (e) { /* graceful */ }
      setLoading(false);
    };
    fetchAll();
  }, [user]);

  const initials = (user?.name || 'T').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const subjects = profile?.assignedSubjects || [];
  const assignedGrades = profile?.assignedGrades || [];

  const filteredStudents = students.filter(s => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      s.user?.name?.toLowerCase().includes(q) ||
      s.user?.email?.toLowerCase().includes(q) ||
      String(s.grade)?.includes(q)
    );
  });

  return (
    <div style={S.page}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Welcome */}
      <div style={S.welcome}>
        <div style={S.avatar}>{initials}</div>
        <div style={S.welcomeTitle}>Welcome back, {user?.name}! 👩‍🏫</div>
        <div style={S.welcomeSub}>Manage your classes and track student progress.</div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Subjects', val: subjects.length || 0, color: '#059669', icon: '📚' },
          { label: 'Grades', val: assignedGrades.length || 0, color: '#0891b2', icon: '🎓' },
          { label: 'Total Students', val: students.length, color: '#4f46e5', icon: '👨‍🎓' },
          { label: 'My Classes', val: assignedGrades.length, color: '#d97706', icon: '🏫' },
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
        <div style={S.card('#059669')}>
          <div style={S.title}>My Profile</div>
          {[
            ['Full Name', user?.name],
            ['Email', user?.email],
            ['School ID', user?.schoolId || '—'],
            ['Role', 'Teacher'],
            ['Status', '✅ Active'],
          ].map(([k, v]) => (
            <div key={k} style={S.profileRow}>
              <span style={S.label}>{k}</span>
              <span style={S.value}>{v}</span>
            </div>
          ))}
        </div>

        {/* Subjects & Grades */}
        <div style={S.card('#0891b2')}>
          <div style={S.title}>Assigned Subjects & Grades</div>
          {loading ? <div style={{ color: '#9ca3af', fontSize: '14px' }}>Loading…</div> : (
            <>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Subjects</div>
                {subjects.length ? subjects.map((s, i) => <span key={i} style={S.subjectChip}>{s}</span>)
                  : <span style={{ color: '#9ca3af', fontSize: '13px' }}>No subjects assigned</span>}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Assigned Grades</div>
                {assignedGrades.length ? assignedGrades.map((g, i) => <span key={i} style={S.gradeChip}>Grade {g}</span>)
                  : <span style={{ color: '#9ca3af', fontSize: '13px' }}>No grades assigned</span>}
              </div>
              {!subjects.length && !assignedGrades.length && (
                <div style={{ marginTop: '12px', padding: '12px', background: '#fef3c7', borderRadius: '8px', fontSize: '13px', color: '#92400e' }}>
                  ⚠ Contact Admin to get subjects and grades assigned to your account.
                </div>
              )}
            </>
          )}
        </div>

        {/* School Info */}
        <div style={S.card('#7c3aed')}>
          <div style={S.title}>School Info</div>
          {[
            ['School', 'Ethiopian Smart School'],
            ['Location', 'Addis Ababa, Ethiopia'],
            ['Academic Year', '2016 E.C.'],
            ['Account Type', 'Teacher'],
            ['System', 'Smart School Management'],
          ].map(([k, v]) => (
            <div key={k} style={S.profileRow}>
              <span style={S.label}>{k}</span>
              <span style={S.value}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Student List */}
      <div style={{ ...S.card('#4f46e5'), marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={S.title}>All Students ({students.length})</div>
          <input
            style={{ padding: '8px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none', width: '220px' }}
            placeholder="🔍 Search students…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        {loading ? <div style={{ color: '#9ca3af', fontSize: '14px', padding: '20px 0' }}>Loading students…</div>
          : filteredStudents.length === 0 ? <div style={{ color: '#9ca3af', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>No students found</div>
          : filteredStudents.slice(0, 30).map((s, i) => (
            <div key={i} style={S.studentRow}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#4f46e51a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#4f46e5', fontSize: '14px' }}>
                  {(s.user?.name || 'S').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#1a202c' }}>{s.user?.name || '—'}</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>{s.user?.email}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={S.badge('#4f46e5')}>Grade {s.grade}</span>
                <span style={S.badge('#0891b2')}>Sec {s.section}</span>
                {s.stream && s.stream !== 'None' && <span style={S.badge('#7c3aed')}>{s.stream.split(' ')[0]}</span>}
              </div>
            </div>
          ))
        }
        {filteredStudents.length > 30 && (
          <div style={{ textAlign: 'center', padding: '12px', color: '#9ca3af', fontSize: '13px' }}>
            Showing 30 of {filteredStudents.length} students
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
