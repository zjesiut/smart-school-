const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register any role (Admin, Teacher, Student) - Admin only
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password, role, grade, section, stream, guardianName, guardianPhone, assignedSubjects, assignedGrades } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email already exists' });

    // Generate School ID (e.g., ESS/2016/001)
    const currentYear = '2016'; // Currently fixed for Ethiopian Calendar
    const userCount = await User.countDocuments() + 1;
    const padding = userCount.toString().padStart(3, '0');
    const schoolId = `ESS/${currentYear}/${padding}`;

    const hashed = await bcrypt.hash(password, 12);

    user = new User({ 
      name, 
      email, 
      password: hashed, 
      role, 
      schoolId,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address
    });
    await user.save();

    if (role === 'Student') {
      const student = new Student({ 
        user: user._id, 
        grade: parseInt(grade), 
        section: section || 'A',
        stream: stream || 'None',
        guardianName,
        guardianPhone,
        academicYear: `${currentYear} E.C.`
      });
      await student.save();
    }

    if (role === 'Teacher') {
      const teacher = new Teacher({ 
        user: user._id, 
        assignedSubjects: assignedSubjects || [], 
        assignedGrades: assignedGrades || [] 
      });
      await teacher.save();
    }

    res.status(201).json({ 
      message: 'User registered successfully', 
      user: { id: user._id, name, email, role, schoolId } 
    });
  } catch (err) {
    console.error('Registration Error:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Duplicate field value (School ID or Email) entered' });
    }
    res.status(500).json({ message: 'Server error: ' + (err.message || 'Internal Failure') });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, schoolId: user.schoolId } });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error: ' + (err.message || 'Internal Failure') });
  }
};

// Bulk register multiple students or teachers — Admin only
exports.bulkRegister = async (req, res) => {
  const { users, role } = req.body; // users: array of user objects, role: 'Student' | 'Teacher'
  if (!Array.isArray(users) || users.length === 0) {
    return res.status(400).json({ message: 'Provide a non-empty array of users' });
  }
  if (!['Student', 'Teacher'].includes(role)) {
    return res.status(400).json({ message: 'Bulk register supports Student or Teacher only' });
  }

  const currentYear = '2016';
  const results = [];

  for (const entry of users) {
    const { name, email, password, grade, section, stream, guardianName, guardianPhone, assignedSubjects, assignedGrades, phoneNumber, address } = entry;
    try {
      const existing = await User.findOne({ email });
      if (existing) {
        results.push({ email, status: 'skipped', reason: 'Email already exists' });
        continue;
      }

      const userCount = await User.countDocuments() + 1;
      const padding = userCount.toString().padStart(3, '0');
      const schoolId = `ESS/${currentYear}/${padding}`;
      const hashed = await bcrypt.hash(password || 'School@123', 12);

      const user = new User({ name, email, password: hashed, role, schoolId, phoneNumber, address });
      await user.save();

      if (role === 'Student') {
        const student = new Student({
          user: user._id,
          grade: parseInt(grade) || 9,
          section: section || 'A',
          stream: stream || 'None',
          guardianName: guardianName || '',
          guardianPhone: guardianPhone || '',
          academicYear: `${currentYear} E.C.`
        });
        await student.save();
      }

      if (role === 'Teacher') {
        const subjects = Array.isArray(assignedSubjects)
          ? assignedSubjects
          : (assignedSubjects || '').split(',').map(s => s.trim()).filter(Boolean);
        const grades = Array.isArray(assignedGrades)
          ? assignedGrades
          : (assignedGrades || '').split(',').map(g => parseInt(g.trim())).filter(g => !isNaN(g));
        const teacher = new Teacher({ user: user._id, assignedSubjects: subjects, assignedGrades: grades });
        await teacher.save();
      }

      results.push({ email, name, status: 'created', schoolId });
    } catch (err) {
      results.push({ email, status: 'failed', reason: err.message });
    }
  }

  const created = results.filter(r => r.status === 'created').length;
  const skipped = results.filter(r => r.status === 'skipped').length;
  const failed = results.filter(r => r.status === 'failed').length;

  res.status(207).json({
    message: `Bulk registration complete: ${created} created, ${skipped} skipped, ${failed} failed`,
    summary: { created, skipped, failed },
    results
  });
};
