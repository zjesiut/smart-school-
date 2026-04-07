const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  grade: { type: Number, enum: [9, 10, 11, 12], required: true },
  section: { type: String, enum: ['A', 'B', 'C', 'D', 'E'], default: 'A' },
  stream: { type: String, enum: ['Natural Science', 'Social Science', 'None'], default: 'None' }, // Only for Grades 11-12
  guardianName: { type: String },
  guardianPhone: { type: String },
  emergencyContact: { type: String },
  academicYear: { type: String, default: '2016 E.C.' },
  enrollmentDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);
