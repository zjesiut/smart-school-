const Result = require('../models/Result');
const Student = require('../models/Student');
const Course = require('../models/Course');
const { calculateGPA } = require('../utils/calculateGPA');

exports.addResult = async (req, res) => {
  const { studentId, courseId, ca, final, term, academicYear } = req.body;

  try {
    const student = await Student.findById(studentId);
    const course = await Course.findById(courseId);
    if (!student || !course) return res.status(404).json({ message: 'Student or course not found' });

    const total = Number(ca) + Number(final);
    const result = new Result({ student: studentId, course: courseId, ca, final, total, term, academicYear });
    const gradePoint = require('../utils/calculateGPA').calculateGradePoint(total);
    result.gradePoint = gradePoint;

    await result.save();
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStudentResults = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const results = await Result.find({ student: studentId }).populate('course', 'name code grade stream');
    const gpaData = calculateGPA(results.map((r) => ({ ca: r.ca, final: r.final })));
    res.json({ results, gpa: gpaData.gpa });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getResults = async (req, res) => {
  try {
    const results = await Result.find().populate('student', 'registrationNumber').populate('course', 'name code');
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Student fetches their OWN results
exports.getMyResults = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id || req.user.id });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });

    const results = await Result.find({ student: student._id }).populate('course', 'name code grade stream');
    const gpaData = calculateGPA(results.map(r => ({ ca: r.ca, final: r.final })));
    res.json({ results, gpa: gpaData.gpa, studentId: student._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
