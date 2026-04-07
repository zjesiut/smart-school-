const Teacher = require('../models/Teacher');

exports.getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate('user', 'name email role schoolId phoneNumber address');
    res.json(teachers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.assignSubject = async (req, res) => {
  const { teacherId } = req.params;
  const { subject, grade } = req.body;
  try {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    if (subject && !teacher.assignedSubjects.includes(subject)) teacher.assignedSubjects.push(subject);
    if (grade && !teacher.assignedGrades.includes(grade)) teacher.assignedGrades.push(grade);

    await teacher.save();
    res.json(teacher);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
