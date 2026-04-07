const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const authController = require('../controllers/authController');

router.post('/register', [
  authMiddleware,
  roleMiddleware('Admin'),
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['Admin', 'Teacher', 'Student']).withMessage('Invalid role'),
  // Additional fields for Student
  body('grade').if(body('role').equals('Student')).notEmpty().withMessage('Grade is required for students'),
  body('section').if(body('role').equals('Student')).notEmpty().withMessage('Section is required'),
  body('stream').if(body('role').equals('Student')).isIn(['Natural Science', 'Social Science', 'None']).withMessage('Invalid Stream')
], authController.register);

router.post('/login', [
  body('email').isEmail(),
  body('password').exists()
], authController.login);

router.post('/bulk-register', [
  authMiddleware,
  roleMiddleware('Admin'),
], authController.bulkRegister);

module.exports = router;
