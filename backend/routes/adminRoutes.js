const express = require('express');
const {
  getDashboardStats,
  getAllStudents,
  updateStudentStatus,
  deleteStudent,
  addStudentResult,
  updateStudentResult,
  generateStudentReport,
  generateFeeReport
} = require('../controllers/adminController');
const { createFeeRequest, getAllFees, updateFeeStatus } = require('../controllers/feesController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const router = express.Router();

router.get('/dashboard-stats', auth, admin, getDashboardStats);
router.get('/students', auth, admin, getAllStudents);
router.put('/students/:id', auth, admin, updateStudentStatus);
router.delete('/students/:id', auth, admin, deleteStudent);
router.post('/results', auth, admin, addStudentResult);
router.put('/results/:id', auth, admin, updateStudentResult);
router.get('/reports/students', auth, admin, generateStudentReport);
router.get('/reports/fees', auth, admin, generateFeeReport);

// Fee management routes
router.post('/fees', auth, admin, createFeeRequest);
router.get('/fees', auth, admin, getAllFees);
router.put('/fees/:id', auth, admin, updateFeeStatus);

module.exports = router;