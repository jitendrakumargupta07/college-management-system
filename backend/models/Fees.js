const mongoose = require("mongoose");

const feesSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student"
  },
  amount: Number,
  paid: { type: Boolean, default: false },
  paymentDate: Date
});

module.exports = mongoose.model("Fees", feesSchema);
