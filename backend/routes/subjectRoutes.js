const express = require('express');
const { getSubjects, createSubject, updateSubject, deleteSubject } = require('../controllers/subjectController');
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

router.get('/', auth, getSubjects);
router.post('/', auth, admin, createSubject);
router.put('/:id', auth, admin, updateSubject);
router.delete('/:id', auth, admin, deleteSubject);

module.exports = router;