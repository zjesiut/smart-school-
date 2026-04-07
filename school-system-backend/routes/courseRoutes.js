const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const courseController = require('../controllers/courseController');

router.get('/', authMiddleware, roleMiddleware('Admin', 'Teacher', 'Student'), courseController.getCourses);
router.post('/', authMiddleware, roleMiddleware('Admin'), courseController.createCourse);
router.delete('/:id', authMiddleware, roleMiddleware('Admin'), courseController.deleteCourse);

module.exports = router;
