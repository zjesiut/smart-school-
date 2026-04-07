const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const teacherController = require('../controllers/teacherController');

router.get('/', authMiddleware, roleMiddleware('Admin'), teacherController.getTeachers);
router.post('/:teacherId/assign', authMiddleware, roleMiddleware('Admin'), teacherController.assignSubject);

module.exports = router;
