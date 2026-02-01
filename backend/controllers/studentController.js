const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const PDFDocument = require('pdfkit');

// Generate unique student ID
const generateStudentId = async () => {
  const year = new Date().getFullYear();
  const prefix = 'STU';
  
  // Find the last student ID for this year
  const lastStudent = await Student.findOne({ 
    studentId: new RegExp(`^${prefix}${year}`) 
  }).sort({ studentId: -1 });
  
  let sequence = 1;
  if (lastStudent && lastStudent.studentId) {
    const lastSequence = parseInt(lastStudent.studentId.slice(-4));
    sequence = lastSequence + 1;
  }
  
  return `${prefix}${year}${sequence.toString().padStart(4, '0')}`;
};

exports.registerStudent = async (req, res) => {
    const { name, email, password, course } = req.body;
    try {
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ message: 'Student already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const studentId = await generateStudentId();
        const newStudent = new Student({ name, email, password: hashedPassword, course, studentId });
        await newStudent.save();
        res.status(201).json({ message: 'Student registered successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await Student.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Student({ name, email, password: hashedPassword, role: 'admin' });
        await newAdmin.save();
        res.status(201).json({ message: 'Admin registered successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.loginStudent = async (req, res) => {
    const { email, password } = req.body;
    try {
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: student._id, role: student.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};  
exports.submitAdmission = async (req, res) => {
  try {
    const { address, phone, dob } = req.body;

    const student = await Student.findByIdAndUpdate(
      req.user.id,
      { address, phone, dob, admissionStatus: "Submitted" },
      { new: true }
    );

    res.json({ msg: "Admission submitted", student });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select("-password");
    res.json(student);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getResults = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select("results");
    res.json(student.results);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.downloadAdmitCard = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${student.name}_admit_card.pdf`);

    doc.pipe(res);

    doc.fontSize(20).text('College Admit Card', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Name: ${student.name}`);
    doc.text(`Email: ${student.email}`);
    doc.text(`Course: ${student.course}`);
    doc.text(`Admission Status: ${student.admissionStatus}`);
    doc.moveDown();
    doc.text('Exam Date: To be announced');
    doc.text('Venue: College Campus');

    doc.end();
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const student = await Student.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    student.password = hashedPassword;
    await student.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, address, phone, dob } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.user.id,
      { name, address, phone, dob },
      { new: true }
    ).select("-password");
    res.json({ message: 'Profile updated successfully', student });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.downloadCertificate = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${student.name}_certificate.pdf`);

    doc.pipe(res);

    doc.fontSize(20).text('Certificate of Enrollment', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text('This is to certify that', { align: 'center' });
    doc.moveDown();
    doc.fontSize(18).text(student.name, { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`has been enrolled in ${student.course}`, { align: 'center' });
    doc.text(`Admission Status: ${student.admissionStatus}`, { align: 'center' });
    doc.moveDown();
    doc.text(`Date of Issue: ${new Date().toLocaleDateString()}`, { align: 'center' });

    doc.end();
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
