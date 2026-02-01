const Subject = require('../models/Subject');

exports.getSubjects = async (req, res) => {
  try {
    const { course, semester } = req.query;
    const query = {};
    if (course) query.course = course;
    if (semester) query.semester = parseInt(semester);

    const subjects = await Subject.find(query).sort({ semester: 1, name: 1 });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createSubject = async (req, res) => {
  try {
    const { name, code, course, semester, syllabus } = req.body;
    const newSubject = new Subject({ name, code, course, semester, syllabus });
    await newSubject.save();
    res.status(201).json({ message: 'Subject created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    await Subject.findByIdAndUpdate(id, updates);
    res.json({ message: 'Subject updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    await Subject.findByIdAndDelete(id);
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};