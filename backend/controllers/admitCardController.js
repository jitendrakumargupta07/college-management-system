const AdmitCard = require("../models/AdmitCard");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/admitcards");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Middleware for uploading
exports.uploadAdmitCard = upload.single("admitCard");

// Upload admit card for a student
exports.uploadAdmitCardForStudent = async (req, res) => {
  try {
    const { studentId } = req.body;
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const admitCard = await AdmitCard.create({
      studentId,
      filePath: req.file.path
    });

    res.json({ msg: "Admit card uploaded successfully", admitCard });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get admit card for logged-in student
exports.getMyAdmitCard = async (req, res) => {
  try {
    const admitCard = await AdmitCard.findOne({ studentId: req.user.id });
    if (!admitCard) {
      return res.status(404).json({ msg: "Admit card not found" });
    }

    res.download(admitCard.filePath);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
