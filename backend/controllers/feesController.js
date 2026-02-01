const Fees = require("../models/Fees");

exports.payFees = async (req, res) => {
  try {
    const { feeId } = req.body; // Get feeId from request body
    
    if (feeId) {
      // Update specific fee if feeId is provided
      const fee = await Fees.findById(feeId);
      if (!fee) {
        return res.status(404).json({ msg: "Fee not found" });
      }
      if (fee.studentId.toString() !== req.user.id) {
        return res.status(403).json({ msg: "Unauthorized" });
      }
      fee.paid = true;
      fee.paymentDate = new Date();
      await fee.save();
      res.json({ msg: "Fees Paid Successfully", fees: fee });
    } else {
      // Find existing unpaid fee for the student (fallback)
      let fee = await Fees.findOne({ studentId: req.user.id, paid: false });
      
      if (fee) {
        // Update existing fee to paid
        fee.paid = true;
        fee.paymentDate = new Date();
        await fee.save();
      } else {
        // Create new paid fee if no unpaid exists
        fee = await Fees.create({
          studentId: req.user.id,
          amount: 5000,
          paid: true,
          paymentDate: new Date()
        });
      }

      res.json({ msg: "Fees Paid Successfully", fees: fee });
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getFeesStatus = async (req, res) => {
  try {
    const fees = await Fees.find({ studentId: req.user.id }).sort({ createdAt: -1 });
    res.json(fees);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Admin functions
exports.createFeeRequest = async (req, res) => {
  try {
    const { studentId, amount } = req.body;
    
    const fee = await Fees.create({
      studentId,
      amount: amount || 5000,
      paid: false
    });

    res.json({ msg: "Fee request created successfully", fee });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getAllFees = async (req, res) => {
  try {
    const fees = await Fees.find().populate('studentId', 'name email course').sort({ createdAt: -1 });
    res.json(fees);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateFeeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paid, amount } = req.body;
    
    const updateData = {};
    if (paid !== undefined) updateData.paid = paid;
    if (paid && !updateData.paymentDate) updateData.paymentDate = new Date();
    if (amount !== undefined) updateData.amount = amount;
    
    const fee = await Fees.findByIdAndUpdate(id, updateData, { new: true });
    res.json({ msg: "Fee updated successfully", fee });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
