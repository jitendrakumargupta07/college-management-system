const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const { uploadAdmitCard, uploadAdmitCardForStudent, getMyAdmitCard } = require("../controllers/admitCardController");

router.post("/upload", auth, admin, uploadAdmitCard, uploadAdmitCardForStudent);
router.get("/download", auth, getMyAdmitCard);

module.exports = router;
