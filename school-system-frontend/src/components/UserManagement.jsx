import React, { useState, useRef } from 'react';
import api from '../services/api';

/* ─────────────────────────── helpers ─────────────────────────── */
const emptyStudent = () => ({ name: '', email: '', password: '', grade: '9', section: 'A', stream: 'None', guardianName: '', guardianPhone: '' });
const emptyTeacher = () => ({ name: '', email: '', password: '', assignedSubjects: '', assignedGrades: '' });

function parseCSV(text, role) {
  const lines = text.trim().split('\n').slice(1); // skip header
  return lines.map(line => {
    const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    if (role === 'Student') {
      const [name, email, password, grade, section, stream, guardianName, guardianPhone] = cols;
      return { name, email, password, grade, section, stream, guardianName, guardianPhone };
    } else {
      const [name, email, password, assignedSubjects, assignedGrades] = cols;
      return { name, email, password, assignedSubjects, assignedGrades };
    }
  }).filter(r => r.name && r.email);
}

/* ─────────────────────────── styles ─────────────────────────── */
const S = {
  page: { padding: '30px', maxWidth: '1100px', margin: '0 auto', fontFamily: "'Inter', sans-serif" },
  header: { marginBottom: '8px', color: '#1a202c', fontSize: '26px', fontWeight: 700 },
  sub: { color: '#718096', marginBottom: '28px', fontSize: '14px' },
  tabs: { display: 'flex', gap: '6px', marginBottom: '28px', borderBottom: '2px solid #e2e8f0', paddingBottom: '0' },
  tab: (active) => ({
    padding: '10px 22px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px',
    borderRadius: '8px 8px 0 0', transition: 'all .2s',
    background: active ? '#4f46e5' : 'transparent',
    color: active ? '#fff' : '#718096',
    borderBottom: active ? '2px solid #4f46e5' : '2px solid transparent',
    marginBottom: '-2px'
  }),
  card: { background: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,.08), 0 4px 16px rgba(0,0,0,.04)' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' },
  label: { display: 'block', marginBottom: '5px', fontWeight: 600, fontSize: '13px', color: '#374151' },
  input: { width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', outline: 'none', transition: 'border .2s', fontFamily: 'inherit' },
  select: { width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', background: '#fff', cursor: 'pointer', fontFamily: 'inherit' },
  btn: (color = '#4f46e5') => ({ padding: '12px 24px', background: color, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', transition: 'opacity .2s', fontFamily: 'inherit' }),
  btnSm: (color = '#4f46e5') => ({ padding: '7px 14px', background: color, color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }),
  alert: (type) => ({ padding: '14px 18px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', fontWeight: 500, background: type === 'success' ? '#f0fdf4' : '#fef2f2', color: type === 'success' ? '#166534' : '#991b1b', border: `1.5px solid ${type === 'success' ? '#bbf7d0' : '#fecaca'}` }),
  sectionTitle: { fontSize: '16px', fontWeight: 700, color: '#1a202c', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' },
  row: { display: 'grid', gap: '12px', alignItems: 'end', background: '#f8fafc', padding: '14px 16px', borderRadius: '10px', marginBottom: '12px', border: '1px solid #e2e8f0' },
  resultRow: (s) => ({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', background: s === 'created' ? '#f0fdf4' : s === 'skipped' ? '#fefce8' : '#fef2f2', border: `1px solid ${s === 'created' ? '#bbf7d0' : s === 'skipped' ? '#fde68a' : '#fecaca'}`, marginBottom: '6px' }),
  badge: (s) => ({ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, background: s === 'created' ? '#dcfce7' : s === 'skipped' ? '#fef9c3' : '#fee2e2', color: s === 'created' ? '#166534' : s === 'skipped' ? '#854d0e' : '#991b1b' })
};

/* ═════════════════════════ SINGLE REGISTER ═════════════════════════ */
const SingleRegister = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Student', phoneNumber: '', address: '', grade: '', section: 'A', stream: 'None', guardianName: '', guardianPhone: '', assignedSubjects: '', assignedGrades: '' });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault(); setLoading(true); setMsg(null);
    const payload = { ...form };
    if (form.role === 'Teacher') {
      payload.assignedSubjects = form.assignedSubjects.split(',').map(s => s.trim()).filter(Boolean);
      payload.assignedGrades = form.assignedGrades.split(',').map(g => parseInt(g)).filter(g => !isNaN(g));
    }
    try {
      const res = await api.post('/auth/register', payload);
      setMsg({ type: 'success', text: `✅ ${res.data.user.name} created — School ID: ${res.data.user.schoolId}` });
      setForm({ name: '', email: '', password: '', role: 'Student', phoneNumber: '', address: '', grade: '', section: 'A', stream: 'None', guardianName: '', guardianPhone: '', assignedSubjects: '', assignedGrades: '' });
    } catch (err) {
      setMsg({ type: 'error', text: `❌ ${err.response?.data?.message || 'Registration failed'}` });
    } finally { setLoading(false); }
  };

  return (
    <div style={S.card}>
      <div style={S.sectionTitle}>Register a Single User</div>
      {msg && <div style={S.alert(msg.type)}>{msg.text}</div>}
      <form onSubmit={submit}>
        <div style={{ ...S.grid2, marginBottom: '16px' }}>
          <div><label style={S.label}>Full Name *</label><input style={S.input} name="name" value={form.name} onChange={set} required placeholder="Full name" /></div>
          <div><label style={S.label}>Email Address *</label><input style={S.input} type="email" name="email" value={form.email} onChange={set} required placeholder="user@school.com" /></div>
          <div><label style={S.label}>Temporary Password *</label><input style={S.input} type="password" name="password" value={form.password} onChange={set} required placeholder="Min 6 chars" /></div>
          <div><label style={S.label}>Role *</label>
            <select style={S.select} name="role" value={form.role} onChange={set}>
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div><label style={S.label}>Phone Number</label><input style={S.input} name="phoneNumber" value={form.phoneNumber} onChange={set} placeholder="09xxxxxxxx" /></div>
          <div><label style={S.label}>Address</label><input style={S.input} name="address" value={form.address} onChange={set} placeholder="City, Region" /></div>
        </div>

        {form.role === 'Student' && (
          <>
            <div style={{ ...S.sectionTitle, color: '#2563eb' }}>Student Academic Info</div>
            <div style={{ ...S.grid2, marginBottom: '16px' }}>
              <div><label style={S.label}>Grade Level *</label>
                <select style={S.select} name="grade" value={form.grade} onChange={set} required>
                  <option value="">Select Grade</option>
                  {[9,10,11,12].map(g => <option key={g} value={g}>Grade {g}</option>)}
                </select>
              </div>
              <div><label style={S.label}>Section</label>
                <select style={S.select} name="section" value={form.section} onChange={set}>
                  {['A','B','C','D','E'].map(s => <option key={s} value={s}>Section {s}</option>)}
                </select>
              </div>
              {(form.grade === '11' || form.grade === '12') && (
                <div><label style={S.label}>Stream</label>
                  <select style={S.select} name="stream" value={form.stream} onChange={set}>
                    <option value="None">None</option>
                    <option value="Natural Science">Natural Science</option>
                    <option value="Social Science">Social Science</option>
                  </select>
                </div>
              )}
              <div><label style={S.label}>Guardian Name</label><input style={S.input} name="guardianName" value={form.guardianName} onChange={set} /></div>
              <div><label style={S.label}>Guardian Phone</label><input style={S.input} name="guardianPhone" value={form.guardianPhone} onChange={set} /></div>
            </div>
          </>
        )}

        {form.role === 'Teacher' && (
          <>
            <div style={{ ...S.sectionTitle, color: '#059669' }}>Teacher Assignment</div>
            <div style={{ ...S.grid2, marginBottom: '16px' }}>
              <div><label style={S.label}>Subjects (comma-separated)</label><input style={S.input} name="assignedSubjects" value={form.assignedSubjects} onChange={set} placeholder="Math, Physics, English" /></div>
              <div><label style={S.label}>Grades (comma-separated)</label><input style={S.input} name="assignedGrades" value={form.assignedGrades} onChange={set} placeholder="9, 10, 11" /></div>
            </div>
          </>
        )}

        <button type="submit" style={{ ...S.btn(), opacity: loading ? .6 : 1 }} disabled={loading}>
          {loading ? '⏳ Creating...' : '✅ Create User'}
        </button>
      </form>
    </div>
  );
};

/* ═════════════════════════ BULK STUDENTS ═════════════════════════ */
const BulkStudents = () => {
  const [rows, setRows] = useState([emptyStudent(), emptyStudent()]);
  const [results, setResults] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const setField = (i, field, val) => setRows(r => r.map((row, idx) => idx === i ? { ...row, [field]: val } : row));
  const addRow = () => setRows(r => [...r, emptyStudent()]);
  const removeRow = (i) => setRows(r => r.filter((_, idx) => idx !== i));

  const handleCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const parsed = parseCSV(ev.target.result, 'Student');
      if (parsed.length) setRows(parsed);
    };
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const csv = 'name,email,password,grade,section,stream,guardianName,guardianPhone\nAbebe Kebede,abebe@school.com,Pass@123,9,A,None,Kebede Alemu,0911223344';
    const a = document.createElement('a'); a.href = 'data:text/csv,' + encodeURIComponent(csv);
    a.download = 'students_template.csv'; a.click();
  };

  const submit = async () => {
    const valid = rows.filter(r => r.name && r.email);
    if (!valid.length) return;
    setLoading(true); setResults(null);
    try {
      const res = await api.post('/auth/bulk-register', { users: valid, role: 'Student' });
      setResults(res.data.results);
      setSummary(res.data.summary);
    } catch (err) {
      setResults([{ status: 'failed', reason: err.response?.data?.message || 'Server error', email: 'N/A' }]);
    } finally { setLoading(false); }
  };

  return (
    <div style={S.card}>
      <div style={S.sectionTitle}>Bulk Register Students</div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button style={S.btnSm('#4f46e5')} onClick={addRow}>+ Add Row</button>
        <button style={S.btnSm('#0891b2')} onClick={() => fileRef.current.click()}>📂 Upload CSV</button>
        <button style={S.btnSm('#6b7280')} onClick={downloadTemplate}>⬇ Download Template</button>
        <input ref={fileRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleCSV} />
        <span style={{ marginLeft: 'auto', fontSize: '13px', color: '#6b7280', alignSelf: 'center' }}>{rows.length} student(s)</span>
      </div>

      <div style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
        {rows.map((row, i) => (
          <div key={i} style={{ ...S.row, gridTemplateColumns: '1.5fr 1.5fr 1fr 0.6fr 0.6fr 0.8fr 1fr 1fr auto' }}>
            <input style={S.input} placeholder="Full Name *" value={row.name} onChange={e => setField(i, 'name', e.target.value)} />
            <input style={S.input} placeholder="Email *" type="email" value={row.email} onChange={e => setField(i, 'email', e.target.value)} />
            <input style={S.input} placeholder="Password" type="password" value={row.password} onChange={e => setField(i, 'password', e.target.value)} />
            <select style={S.select} value={row.grade} onChange={e => setField(i, 'grade', e.target.value)}>
              {[9,10,11,12].map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <select style={S.select} value={row.section} onChange={e => setField(i, 'section', e.target.value)}>
              {['A','B','C','D','E'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select style={S.select} value={row.stream} onChange={e => setField(i, 'stream', e.target.value)}>
              <option value="None">None</option>
              <option value="Natural Science">Natural Sci.</option>
              <option value="Social Science">Social Sci.</option>
            </select>
            <input style={S.input} placeholder="Guardian Name" value={row.guardianName} onChange={e => setField(i, 'guardianName', e.target.value)} />
            <input style={S.input} placeholder="Guardian Phone" value={row.guardianPhone} onChange={e => setField(i, 'guardianPhone', e.target.value)} />
            <button onClick={() => removeRow(i)} style={{ ...S.btnSm('#ef4444'), padding: '8px 12px' }} title="Remove">✕</button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button style={{ ...S.btn('#059669'), opacity: loading ? .6 : 1 }} onClick={submit} disabled={loading}>
          {loading ? '⏳ Registering...' : `🚀 Register ${rows.filter(r => r.name && r.email).length} Students`}
        </button>
        <button style={S.btnSm('#6b7280')} onClick={() => { setRows([emptyStudent(), emptyStudent()]); setResults(null); }}>Clear All</button>
      </div>

      {summary && (
        <div style={{ marginTop: '20px', padding: '14px 18px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontWeight: 700, marginBottom: '12px', color: '#1a202c' }}>📊 Registration Results</div>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <span style={S.badge('created')}>✅ {summary.created} Created</span>
            <span style={S.badge('skipped')}>⚠ {summary.skipped} Skipped</span>
            <span style={S.badge('failed')}>❌ {summary.failed} Failed</span>
          </div>
          {results.map((r, i) => (
            <div key={i} style={S.resultRow(r.status)}>
              <span><strong>{r.name || r.email}</strong> — {r.email}</span>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {r.schoolId && <span style={{ fontSize: '12px', color: '#4b5563' }}>{r.schoolId}</span>}
                <span style={S.badge(r.status)}>{r.status}</span>
                {r.reason && <span style={{ fontSize: '12px', color: '#6b7280' }}>{r.reason}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ═════════════════════════ BULK TEACHERS ═════════════════════════ */
const BulkTeachers = () => {
  const [rows, setRows] = useState([emptyTeacher(), emptyTeacher()]);
  const [results, setResults] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const setField = (i, field, val) => setRows(r => r.map((row, idx) => idx === i ? { ...row, [field]: val } : row));
  const addRow = () => setRows(r => [...r, emptyTeacher()]);
  const removeRow = (i) => setRows(r => r.filter((_, idx) => idx !== i));

  const handleCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { const parsed = parseCSV(ev.target.result, 'Teacher'); if (parsed.length) setRows(parsed); };
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const csv = 'name,email,password,assignedSubjects,assignedGrades\nBiruk Tadesse,biruk@school.com,Pass@123,"Math,Physics","9,10,11"';
    const a = document.createElement('a'); a.href = 'data:text/csv,' + encodeURIComponent(csv);
    a.download = 'teachers_template.csv'; a.click();
  };

  const submit = async () => {
    const valid = rows.filter(r => r.name && r.email);
    if (!valid.length) return;
    setLoading(true); setResults(null);
    try {
      const res = await api.post('/auth/bulk-register', { users: valid, role: 'Teacher' });
      setResults(res.data.results); setSummary(res.data.summary);
    } catch (err) {
      setResults([{ status: 'failed', reason: err.response?.data?.message || 'Server error', email: 'N/A' }]);
    } finally { setLoading(false); }
  };

  return (
    <div style={S.card}>
      <div style={S.sectionTitle}>Bulk Register Teachers</div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button style={S.btnSm('#4f46e5')} onClick={addRow}>+ Add Row</button>
        <button style={S.btnSm('#0891b2')} onClick={() => fileRef.current.click()}>📂 Upload CSV</button>
        <button style={S.btnSm('#6b7280')} onClick={downloadTemplate}>⬇ Download Template</button>
        <input ref={fileRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleCSV} />
        <span style={{ marginLeft: 'auto', fontSize: '13px', color: '#6b7280', alignSelf: 'center' }}>{rows.length} teacher(s)</span>
      </div>

      <div style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
        {rows.map((row, i) => (
          <div key={i} style={{ ...S.row, gridTemplateColumns: '1.5fr 1.5fr 1fr 1.5fr 1fr auto' }}>
            <input style={S.input} placeholder="Full Name *" value={row.name} onChange={e => setField(i, 'name', e.target.value)} />
            <input style={S.input} placeholder="Email *" type="email" value={row.email} onChange={e => setField(i, 'email', e.target.value)} />
            <input style={S.input} placeholder="Password" type="password" value={row.password} onChange={e => setField(i, 'password', e.target.value)} />
            <input style={S.input} placeholder="Subjects: Math, Physics" value={row.assignedSubjects} onChange={e => setField(i, 'assignedSubjects', e.target.value)} />
            <input style={S.input} placeholder="Grades: 9, 10, 11" value={row.assignedGrades} onChange={e => setField(i, 'assignedGrades', e.target.value)} />
            <button onClick={() => removeRow(i)} style={{ ...S.btnSm('#ef4444'), padding: '8px 12px' }}>✕</button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button style={{ ...S.btn('#7c3aed'), opacity: loading ? .6 : 1 }} onClick={submit} disabled={loading}>
          {loading ? '⏳ Registering...' : `🚀 Register ${rows.filter(r => r.name && r.email).length} Teachers`}
        </button>
        <button style={S.btnSm('#6b7280')} onClick={() => { setRows([emptyTeacher(), emptyTeacher()]); setResults(null); }}>Clear All</button>
      </div>

      {summary && (
        <div style={{ marginTop: '20px', padding: '14px 18px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontWeight: 700, marginBottom: '12px', color: '#1a202c' }}>📊 Registration Results</div>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <span style={S.badge('created')}>✅ {summary.created} Created</span>
            <span style={S.badge('skipped')}>⚠ {summary.skipped} Skipped</span>
            <span style={S.badge('failed')}>❌ {summary.failed} Failed</span>
          </div>
          {results.map((r, i) => (
            <div key={i} style={S.resultRow(r.status)}>
              <span><strong>{r.name || r.email}</strong> — {r.email}</span>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {r.schoolId && <span style={{ fontSize: '12px', color: '#4b5563' }}>{r.schoolId}</span>}
                <span style={S.badge(r.status)}>{r.status}</span>
                {r.reason && <span style={{ fontSize: '12px', color: '#6b7280' }}>{r.reason}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ═════════════════════════ MAIN COMPONENT ═════════════════════════ */
const UserManagement = () => {
  const [tab, setTab] = useState(0);
  const tabs = ['👤 Single Register', '👨‍🎓 Bulk Students', '👨‍🏫 Bulk Teachers'];

  return (
    <div style={S.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <h2 style={S.header}>User Management</h2>
      <p style={S.sub}>Register new users one at a time, or bulk-register students and teachers via form rows or CSV upload.</p>

      <div style={S.tabs}>
        {tabs.map((t, i) => (
          <button key={i} style={S.tab(tab === i)} onClick={() => setTab(i)}>{t}</button>
        ))}
      </div>

      {tab === 0 && <SingleRegister />}
      {tab === 1 && <BulkStudents />}
      {tab === 2 && <BulkTeachers />}
    </div>
  );
};

export default UserManagement;
