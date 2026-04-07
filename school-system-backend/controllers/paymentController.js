const Payment = require('../models/Payment');
const Student = require('../models/Student');

exports.createPayment = async (req, res) => {
  const { studentId, amount, status, dueDate, paidDate, note } = req.body;
  try {
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const payment = new Payment({ student: studentId, amount, status, dueDate, paidDate, note });
    await payment.save();
    res.status(201).json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStudentPayments = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const payments = await Payment.find({ student: studentId });
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('student', 'registrationNumber');
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
