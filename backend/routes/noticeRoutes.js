const express = require('express');
const { getNotices, createNotice, updateNotice, deleteNotice } = require('../controllers/noticeController');
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

router.get('/', auth, getNotices);
router.post('/', auth, admin, createNotice);
router.put('/:id', auth, admin, updateNotice);
router.delete('/:id', auth, admin, deleteNotice);

module.exports = router;