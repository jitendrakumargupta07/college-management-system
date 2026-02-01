const express = require('express');
const { getFeesStatus, payFees } = require('../controllers/feesController');
const router = express.Router();
const auth = require("../middleware/authMiddleware");

router.get('/status', auth, getFeesStatus);
router.post('/pay', auth, payFees);

module.exports = router;