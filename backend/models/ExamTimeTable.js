const mongoose = require("mongoose");

const examTimeTableSchema = new mongoose.Schema({
  course: String,
  semester: Number,
  exams: [{
    subject: String,
    date: Date,
    time: String,
    venue: String
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ExamTimeTable", examTimeTableSchema);