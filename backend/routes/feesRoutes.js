const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { payFees, getFeesStatus } = require("../controllers/feesController");

router.post("/pay", auth, payFees);
router.get("/status", auth, getFeesStatus);

module.exports = router;
