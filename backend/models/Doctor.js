const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide doctor name'],
      trim: true,
    },
    specialization: {
      type: String,
      required: [true, 'Please provide specialization'],
    },
    availableDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    consultationFee: {
      type: Number,
      required: [true, 'Please provide consultation fee'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);