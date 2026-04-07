const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const paymentController = require('../controllers/paymentController');

router.get('/', authMiddleware, roleMiddleware('Admin', 'Teacher'), paymentController.getPayments);
router.post('/', authMiddleware, roleMiddleware('Admin', 'Teacher'), paymentController.createPayment);
router.get('/:studentId', authMiddleware, roleMiddleware('Admin', 'Teacher', 'Student'), paymentController.getStudentPayments);

module.exports = router;
