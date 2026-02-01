const express = require('express');
const { getExamTimeTable, createExamTimeTable, updateExamTimeTable, deleteExamTimeTable } = require('../controllers/examTimeTableController');
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

router.get('/', auth, getExamTimeTable);
router.post('/', auth, admin, createExamTimeTable);
router.put('/:id', auth, admin, updateExamTimeTable);
router.delete('/:id', auth, admin, deleteExamTimeTable);

module.exports = router;