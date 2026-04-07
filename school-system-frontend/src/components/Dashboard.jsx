import React from 'react';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = ({ user }) => {
  if (!user) return null;
  if (user.role === 'Student') return <StudentDashboard user={user} />;
  if (user.role === 'Teacher') return <TeacherDashboard user={user} />;
  return <AdminDashboard user={user} />;
};

export default Dashboard;