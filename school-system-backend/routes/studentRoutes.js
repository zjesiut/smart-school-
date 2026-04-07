const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const studentController = require('../controllers/studentController');

// IMPORTANT: /me must come BEFORE /:id to avoid 'me' being treated as an ID
router.get('/me', authMiddleware, roleMiddleware('Student'), studentController.getMe);

router.get('/', authMiddleware, roleMiddleware('Admin', 'Teacher'), studentController.getStudents);
router.post('/', authMiddleware, roleMiddleware('Admin'), studentController.createStudent);
router.put('/:id', authMiddleware, roleMiddleware('Admin'), studentController.updateStudent);
router.delete('/:id', authMiddleware, roleMiddleware('Admin'), studentController.deleteStudent);

module.exports = router;
