const ExamTimeTable = require('../models/ExamTimeTable');

exports.getExamTimeTable = async (req, res) => {
  try {
    const { course, semester } = req.query;
    const query = {};
    if (course) query.course = course;
    if (semester) query.semester = parseInt(semester);

    const timeTable = await ExamTimeTable.find(query).sort({ createdAt: -1 });
    res.json(timeTable);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createExamTimeTable = async (req, res) => {
  try {
    const { course, semester, exams } = req.body;
    const newTimeTable = new ExamTimeTable({ course, semester, exams });
    await newTimeTable.save();
    res.status(201).json({ message: 'Exam time table created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateExamTimeTable = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    await ExamTimeTable.findByIdAndUpdate(id, updates);
    res.json({ message: 'Exam time table updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteExamTimeTable = async (req, res) => {
  try {
    const { id } = req.params;
    await ExamTimeTable.findByIdAndDelete(id);
    res.json({ message: 'Exam time table deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};