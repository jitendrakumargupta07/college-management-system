const express = require('express');
const { registerStudent, loginStudent, submitAdmission, getProfile, getResults, downloadAdmitCard, registerAdmin, changePassword, updateProfile, downloadCertificate } = require('../controllers/studentController');
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

router.post('/register', registerStudent);
router.post('/register-admin', auth, admin, registerAdmin);
router.post('/login', loginStudent);
router.post("/admission", auth, submitAdmission);
router.get("/profile", auth, getProfile);
router.get("/results", auth, getResults);
router.get("/admit-card", auth, downloadAdmitCard);
router.put("/change-password", auth, changePassword);
router.put("/update-profile", auth, updateProfile);
router.get("/certificate", auth, downloadCertificate);

module.exports = router;
