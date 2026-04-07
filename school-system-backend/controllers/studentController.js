const User = require('../models/User');
const Student = require('../models/Student');

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('user', 'name email role schoolId phoneNumber address');
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createStudent = async (req, res) => {
  const { name, email, password, grade, stream, phoneNumber, address } = req.body;
  try {
    const bcrypt = require('bcryptjs');
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User with this email already exists' });

    const hashedPassword = await bcrypt.hash(password || 'Student@123', 10);
    const schoolId = `STU-${Date.now()}`;

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'Student',
      schoolId,
      phoneNumber,
      address,
    });

    const student = await Student.create({ user: user._id, grade, stream });

    res.status(201).json({ message: 'Student created successfully', user, student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id }).populate('user', 'name email');
    if (!student) return res.status(404).json({ message: 'Student profile not found' });
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateStudent = async (req, res) => {
  const { name, email, grade, stream } = req.body;
  try {
    const student = await Student.findById(req.params.id).populate('user');
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (name) student.user.name = name;
    if (email) student.user.email = email;
    if (grade) student.grade = grade;
    if (stream) student.stream = stream;

    await student.user.save();
    await student.save();

    res.json({ user: student.user, student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    await User.findByIdAndDelete(student.user);
    await Student.findByIdAndDelete(req.params.id);

    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
