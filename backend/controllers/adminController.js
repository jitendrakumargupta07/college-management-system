const Student = require('../models/Student');
const Result = require('../models/Result');
const Fees = require('../models/Fees');
const Notice = require('../models/Notice');
const ExamTimeTable = require('../models/ExamTimeTable');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const approvedStudents = await Student.countDocuments({ admissionStatus: 'Approved' });
    const pendingAdmissions = await Student.countDocuments({ admissionStatus: 'Submitted' });
    const rejectedAdmissions = await Student.countDocuments({ admissionStatus: 'Rejected' });
    const feePaidStudents = await Student.countDocuments({ feePaid: true });
    const feePendingStudents = await Student.countDocuments({ feePaid: false });

    const totalFees = await Fees.countDocuments();
    const paidFees = await Fees.countDocuments({ paid: true });
    const pendingFees = await Fees.countDocuments({ paid: false });

    const totalResults = await Result.countDocuments();
    const totalNotices = await Notice.countDocuments();
    const totalExamSchedules = await ExamTimeTable.countDocuments();

    res.json({
      students: {
        total: totalStudents,
        approved: approvedStudents,
        pending: pendingAdmissions,
        rejected: rejectedAdmissions
      },
      fees: {
        total: totalFees,
        paid: paidFees,
        pending: pendingFees,
        paidStudents: feePaidStudents,
        pendingStudents: feePendingStudents
      },
      results: totalResults,
      notices: totalNotices,
      examSchedules: totalExamSchedules
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const { search, course, admissionStatus, feePaid, page = 1, limit = 10 } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (course) query.course = course;
    if (admissionStatus) query.admissionStatus = admissionStatus;
    if (feePaid !== undefined) query.feePaid = feePaid === 'true';

    const students = await Student.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Student.countDocuments(query);

    res.json({
      students,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateStudentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { admissionStatus, feePaid, results } = req.body;
    const student = await Student.findByIdAndUpdate(
      id,
      { admissionStatus, feePaid, results },
      { new: true }
    );
    res.json({ msg: 'Student updated', student });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);
    res.json({ msg: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.addStudentResult = async (req, res) => {
  try {
    const { studentId, semester, subjects } = req.body;

    // Calculate total marks and grade
    const total = subjects.reduce((sum, subject) => sum + Number(subject.marks), 0);
    const average = total / subjects.length;
    let grade = 'F';
    if (average >= 90) grade = 'A+';
    else if (average >= 80) grade = 'A';
    else if (average >= 70) grade = 'B+';
    else if (average >= 60) grade = 'B';
    else if (average >= 50) grade = 'C';

    const result = new Result({
      studentId,
      semester,
      subjects,
      total,
      grade
    });

    await result.save();
    res.status(201).json({ msg: 'Result added successfully', result });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateStudentResult = async (req, res) => {
  try {
    const { id } = req.params;
    const { subjects } = req.body;

    const total = subjects.reduce((sum, subject) => sum + Number(subject.marks), 0);
    const average = total / subjects.length;
    let grade = 'F';
    if (average >= 90) grade = 'A+';
    else if (average >= 80) grade = 'A';
    else if (average >= 70) grade = 'B+';
    else if (average >= 60) grade = 'B';
    else if (average >= 50) grade = 'C';

    const result = await Result.findByIdAndUpdate(
      id,
      { subjects, total, grade },
      { new: true }
    );

    res.json({ msg: 'Result updated successfully', result });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.generateStudentReport = async (req, res) => {
  try {
    const { format = 'pdf' } = req.query;

    if (format === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Students Report');

      // Add headers
      worksheet.columns = [
        { header: 'Name', key: 'name', width: 20 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Course', key: 'course', width: 20 },
        { header: 'Admission Status', key: 'admissionStatus', width: 15 },
        { header: 'Fee Paid', key: 'feePaid', width: 10 },
        { header: 'Phone', key: 'phone', width: 15 },
        { header: 'Address', key: 'address', width: 30 }
      ];

      // Style header row
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4A90E2' }
      };

      const students = await Student.find().select('-password');
      students.forEach(student => {
        worksheet.addRow({
          name: student.name,
          email: student.email,
          course: student.course,
          admissionStatus: student.admissionStatus,
          feePaid: student.feePaid ? 'Yes' : 'No',
          phone: student.phone || '',
          address: student.address || ''
        });
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=students_report.xlsx');

      await workbook.xlsx.write(res);
      res.end();
    } else {
      // Generate PDF report
      const students = await Student.find().select('-password');
      const doc = new PDFDocument();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=students_report.pdf');

      doc.pipe(res);

      doc.fontSize(20).text('College Management System - Students Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
      doc.moveDown(2);

      students.forEach((student, index) => {
        doc.fontSize(14).text(`${index + 1}. ${student.name}`, { underline: true });
        doc.fontSize(10).text(`Email: ${student.email}`);
        doc.text(`Course: ${student.course}`);
        doc.text(`Admission Status: ${student.admissionStatus}`);
        doc.text(`Fee Paid: ${student.feePaid ? 'Yes' : 'No'}`);
        doc.text(`Phone: ${student.phone || 'N/A'}`);
        doc.text(`Address: ${student.address || 'N/A'}`);
        doc.moveDown();
      });

      doc.end();
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.generateFeeReport = async (req, res) => {
  try {
    const { format = 'pdf' } = req.query;

    if (format === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Fees Report');

      worksheet.columns = [
        { header: 'Student Name', key: 'studentName', width: 20 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Amount', key: 'amount', width: 15 },
        { header: 'Paid', key: 'paid', width: 10 },
        { header: 'Payment Date', key: 'paymentDate', width: 15 }
      ];

      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4A90E2' }
      };

      const fees = await Fees.find().populate('studentId', 'name email');
      fees.forEach(fee => {
        worksheet.addRow({
          studentName: fee.studentId?.name || 'N/A',
          email: fee.studentId?.email || 'N/A',
          amount: fee.amount,
          paid: fee.paid ? 'Yes' : 'No',
          paymentDate: fee.paymentDate ? new Date(fee.paymentDate).toLocaleDateString() : 'N/A'
        });
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=fees_report.xlsx');

      await workbook.xlsx.write(res);
      res.end();
    } else {
      const fees = await Fees.find().populate('studentId', 'name email');
      const doc = new PDFDocument();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=fees_report.pdf');

      doc.pipe(res);

      doc.fontSize(20).text('College Management System - Fees Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
      doc.moveDown(2);

      fees.forEach((fee, index) => {
        doc.fontSize(14).text(`${index + 1}. ${fee.studentId?.name || 'N/A'}`, { underline: true });
        doc.fontSize(10).text(`Email: ${fee.studentId?.email || 'N/A'}`);
        doc.text(`Amount: ₹${fee.amount}`);
        doc.text(`Paid: ${fee.paid ? 'Yes' : 'No'}`);
        doc.text(`Payment Date: ${fee.paymentDate ? new Date(fee.paymentDate).toLocaleDateString() : 'N/A'}`);
        doc.moveDown();
      });

      doc.end();
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};