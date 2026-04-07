import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', grade: '', stream: '' });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students');
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/students/${editingId}`, formData);
        setEditingId(null);
      } else {
        await api.post('/students', formData);
      }
      setFormData({ name: '', email: '', password: '', grade: '', stream: '' });
      setShowForm(false);
      fetchStudents();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    setFormData({
      name: student.user.name,
      email: student.user.email,
      grade: student.grade,
      stream: student.stream,
      password: '' // Don't prefill password
    });
    setEditingId(student._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await api.delete(`/students/${id}`);
        fetchStudents();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', password: '', grade: '', stream: '' });
    setShowForm(false);
  };

  const containerStyle = {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    background: '#f8f9fa',
    minHeight: 'calc(100vh - 80px)'
  };

  const formStyle = {
    marginBottom: '20px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    background: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const inputStyle = {
    display: 'block',
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    marginRight: '10px'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    background: '#3498db',
    color: 'white'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: '#95a5a6',
    color: 'white'
  };

  const dangerButtonStyle = {
    ...buttonStyle,
    background: '#e74c3c',
    color: 'white'
  };

  const studentCardStyle = {
    padding: '15px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    background: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#2c3e50', margin: 0 }}>Students Management</h1>
        <p style={{ color: '#7f8c8d' }}>To add or register new students, please use the <strong>User Management</strong> dashboard.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {students.map(student => (
          <div key={student._id} style={studentCardStyle}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ margin: '0 0 5px 0', color: '#2c3e50', fontSize: '18px' }}>{student.user.name}</h4>
                <span style={{ fontSize: '12px', background: '#3498db', color: '#fff', padding: '2px 8px', borderRadius: '10px' }}>
                  {student.user.schoolId || 'No ID'}
                </span>
              </div>
              <p style={{ margin: '5px 0', color: '#7f8c8d', fontSize: '14px' }}>{student.user.email}</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', fontSize: '13px' }}>
                <span style={{ background: '#ecf0f1', padding: '3px 8px', borderRadius: '4px' }}>Grade: {student.grade}</span>
                <span style={{ background: '#ecf0f1', padding: '3px 8px', borderRadius: '4px' }}>Section: {student.section}</span>
              </div>
              <p style={{ marginTop: '10px', fontSize: '13px', color: '#2980b9', fontWeight: 'bold' }}>Stream: {student.stream}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginLeft: '15px' }}>
              <button
                onClick={() => handleDelete(student._id)}
                style={{ ...dangerButtonStyle, margin: 0, padding: '5px 10px' }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      {students.length === 0 && <p style={{ textAlign: 'center', color: '#bdc3c7', marginTop: '50px' }}>No students found in the system.</p>}
    </div>
  );
};

export default Students;