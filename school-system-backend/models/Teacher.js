const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedSubjects: [{ type: String }],
  assignedGrades: [{ type: Number, enum: [9, 10, 11, 12] }],
  qualification: { type: String },
  employmentDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Teacher', teacherSchema);
