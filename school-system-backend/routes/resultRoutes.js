const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const resultController = require('../controllers/resultController');

// IMPORTANT: /my must come before /:studentId
router.get('/my', authMiddleware, roleMiddleware('Student'), resultController.getMyResults);

router.get('/', authMiddleware, roleMiddleware('Admin', 'Teacher'), resultController.getResults);
router.post('/', authMiddleware, roleMiddleware('Teacher'), resultController.addResult);
router.get('/:studentId', authMiddleware, roleMiddleware('Admin', 'Teacher', 'Student'), resultController.getStudentResults);

module.exports = router;
