const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ name: 1 });
    res.status(200).json({ success: true, count: doctors.length, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json({ success: true, data: doctor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const upcoming = await Appointment.countDocuments({ doctor: id, status: 'Booked' });
    if (upcoming > 0) {
      return res.status(409).json({
        success: false,
        message: `Cannot remove a doctor with ${upcoming} booked appointment(s). Complete or cancel them first.`,
      });
    }

    const doctor = await Doctor.findByIdAndDelete(id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.status(200).json({ success: true, message: 'Doctor removed successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
