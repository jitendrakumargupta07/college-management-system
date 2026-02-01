const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const { addResult, getMyResult, uploadResult, uploadResultForStudent, downloadResult, generateResultPDF, getAllResults, deleteResult } = require("../controllers/resultController");

router.post("/add", addResult); // admin
router.post("/upload", auth, admin, uploadResult, uploadResultForStudent);
router.get("/my", auth, getMyResult);
router.get("/download/:id", auth, downloadResult);
router.get("/pdf/:id", auth, generateResultPDF);
router.get("/all", auth, admin, getAllResults); // admin only
router.delete("/:id", auth, admin, deleteResult); // admin only

module.exports = router;
