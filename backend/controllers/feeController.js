const Student = require('../models/Student');

exports.getFeeStatus = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    res.json({ paid: student.feePaid || false, amount: 50000 }); // Example amount
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.payFees = async (req, res) => {
  try {
    await Student.findByIdAndUpdate(req.user.id, { feePaid: true });
    res.json({ msg: "Fees paid successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};