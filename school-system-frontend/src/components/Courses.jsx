import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Courses</h1>
      <ul>
        {courses.map(course => (
          <li key={course._id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc' }}>
            {course.name} - {course.code} - Teacher: {course.teacher?.user?.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Courses;