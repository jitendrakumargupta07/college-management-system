const Result = require("../models/Result");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/results");
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
exports.uploadResult = upload.single("result");

// Upload result for a student
exports.uploadResultForStudent = async (req, res) => {
  try {
    const { studentId, semester } = req.body;
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const result = await Result.create({
      studentId,
      semester,
      filePath: req.file.path
    });

    res.json({ msg: "Result uploaded successfully", result });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.addResult = async (req, res) => {
  const { studentId, semester, subjects } = req.body;

  // Calculate total marks and grade (same as admin controller)
  const total = subjects.reduce((sum, s) => sum + Number(s.marks), 0);
  const average = total / subjects.length;
  let grade = 'F';
  if (average >= 90) grade = 'A+';
  else if (average >= 80) grade = 'A';
  else if (average >= 70) grade = 'B+';
  else if (average >= 60) grade = 'B';
  else if (average >= 50) grade = 'C';

  const result = await Result.create({
    studentId,
    semester,
    subjects,
    total,
    grade
  });

  res.json({ msg: "Result added", result });
};

exports.getMyResult = async (req, res) => {
  const results = await Result.find({ studentId: req.user.id });
  res.json(results);
};

exports.downloadResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result || result.studentId.toString() !== req.user.id || !result.filePath) {
      return res.status(404).json({ msg: 'Result not found' });
    }
    res.download(result.filePath);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.generateResultPDF = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id).populate('studentId', 'name email phone');
    if (!result || result.studentId._id.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Result not found' });
    }

    // Create PDF document
    const doc = new PDFDocument();
    const filename = `result_semester_${result.semester}.pdf`;

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Pipe PDF to response
    doc.pipe(res);

    // Add content to PDF
    doc.fontSize(20).text('COLLEGE MANAGEMENT SYSTEM', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text('STUDENT RESULT', { align: 'center' });
    doc.moveDown(2);

    // Student details
    doc.fontSize(12);
    doc.text(`Student Name: ${result.studentId.name}`);
    doc.text(`Student ID: ${result.studentId.studentId}`);
    doc.text(`Email: ${result.studentId.email}`);
    doc.text(`Phone: ${result.studentId.phone || 'N/A'}`);
    doc.text(`Semester: ${result.semester}`);
    doc.moveDown();

    // Results table
    if (result.subjects && result.subjects.length > 0) {
      // Table header
      doc.fontSize(14).text('Subject-wise Marks:', { underline: true });
      doc.moveDown();

      // Draw table
      const tableTop = doc.y;
      const tableLeft = 50;
      const colWidth = 200;

      // Header row
      doc.fontSize(12);
      doc.text('Subject', tableLeft, tableTop);
      doc.text('Marks', tableLeft + colWidth, tableTop);

      // Header line
      doc.moveTo(tableLeft, tableTop + 15).lineTo(tableLeft + colWidth * 2, tableTop + 15).stroke();

      // Data rows
      let yPosition = tableTop + 25;
      result.subjects.forEach(subject => {
        doc.text(subject.name, tableLeft, yPosition);
        doc.text(subject.marks.toString(), tableLeft + colWidth, yPosition);
        yPosition += 20;
      });

      // Bottom line
      doc.moveTo(tableLeft, yPosition - 5).lineTo(tableLeft + colWidth * 2, yPosition - 5).stroke();

      // Total and Grade
      doc.moveDown(2);
      doc.fontSize(14);
      doc.text(`Total Marks: ${result.total}`);
      doc.text(`Grade: ${result.grade}`);
    }

    // Footer
    doc.moveDown(3);
    doc.fontSize(10).text('Generated on: ' + new Date().toLocaleDateString(), { align: 'center' });

    // Finalize PDF
    doc.end();

  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ msg: 'Failed to generate PDF' });
  }
};

exports.getAllResults = async (req, res) => {
  try {
    const results = await Result.find().populate('studentId', 'name email studentId course');
    res.json(results);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ msg: 'Result not found' });
    }

    // Delete file if it exists
    if (result.filePath) {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(__dirname, '../', result.filePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Result.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Result deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
