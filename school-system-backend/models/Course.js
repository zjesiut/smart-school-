const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  grade: { type: Number, enum: [9, 10, 11, 12], required: true },
  stream: { type: String, enum: ['Natural', 'Social'], required: true },
  creditHours: { type: Number, default: 3 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);
