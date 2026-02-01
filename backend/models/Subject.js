const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: String,
  code: String,
  course: String,
  semester: Number,
  syllabus: {
    topics: [String],
    description: String,
    credits: Number
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Subject", subjectSchema);