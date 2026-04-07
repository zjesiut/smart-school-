const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  ca: { type: Number, default: 0, min: 0, max: 40 },
  final: { type: Number, default: 0, min: 0, max: 60 },
  total: { type: Number, default: 0 },
  gradePoint: { type: Number, default: 0 },
  term: { type: String, default: '1' },
  academicYear: { type: String, default: '2016 E.C.' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', resultSchema);
