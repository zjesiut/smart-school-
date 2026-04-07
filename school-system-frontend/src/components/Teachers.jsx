import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await api.get('/teachers');
      setTeachers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const containerStyle = {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    background: '#f8f9fa',
    minHeight: 'calc(100vh - 80px)'
  };

  const cardStyle = {
    padding: '20px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '12px',
    background: '#fff',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2c3e50', margin: 0 }}>Teachers Management</h1>
        <p style={{ color: '#7f8c8d' }}>Manage school faculty. Use <strong>User Management</strong> to add new teachers.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {teachers.map(teacher => (
          <div key={teacher._id} style={cardStyle}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, color: '#2c3e50' }}>{teacher.user.name}</h3>
                <span style={{ fontSize: '12px', background: '#27ae60', color: '#fff', padding: '3px 10px', borderRadius: '15px', fontWeight: 'bold' }}>
                  {teacher.user.schoolId || 'TCH-000'}
                </span>
              </div>
              <p style={{ margin: '0 0 15px 0', color: '#95a5a6', fontSize: '14px' }}>{teacher.user.email}</p>
              
              <div style={{ borderTop: '1px solid #f1f1f1', paddingTop: '10px' }}>
                <h5 style={{ margin: '0 0 5px 0', color: '#34495e', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '1px' }}>Assignments</h5>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {(teacher.assignedSubjects || []).map((sub, i) => (
                    <span key={i} style={{ background: '#e8f6f3', color: '#16a085', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{sub}</span>
                  ))}
                  {(teacher.assignedSubjects || []).length === 0 && <span style={{ color: '#bdc3c7', fontSize: '12px', fontStyle: 'italic' }}>No subjects assigned</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {teachers.length === 0 && <p style={{ textAlign: 'center', color: '#bdc3c7', marginTop: '50px' }}>No teachers registered in the system yet.</p>}
    </div>
  );
};

export default Teachers;