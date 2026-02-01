const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'student' },
  course: String,
  studentId: { type: String, unique: true },
  admissionStatus: { type: String, default: "Approved" },
  feePaid: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  address: String,
  phone: String,
  dob: String,
  documents: {
    photo: String,
    marksheet: String
  },
  results: {
    semester1: { type: Number, default: null },
    semester2: { type: Number, default: null }
  }
});

module.exports = mongoose.model("Student", studentSchema);