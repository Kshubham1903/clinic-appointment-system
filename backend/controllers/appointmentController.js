const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

exports.createAppointment = async (req, res) => {
  try {
    const { doctor, appointmentDate, timeSlot } = req.body;

    const date = new Date(appointmentDate);
    if (Number.isNaN(date.getTime())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid date.' });
    }

    const doctorDoc = await Doctor.findById(doctor);
    if (!doctorDoc) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    const day = DAYS[date.getUTCDay()];
    if (!doctorDoc.availableDays.includes(day)) {
      return res.status(400).json({
        success: false,
        message: `Dr. ${doctorDoc.name} is not available on ${day}.`,
      });
    }

    const existingBooking = await Appointment.findOne({
      doctor,
      appointmentDate: date,
      timeSlot,
      status: { $ne: 'Cancelled' },
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked for the selected doctor.',
      });
    }

    const appointment = await Appointment.create(req.body);
    const populated = await appointment.populate('doctor', 'name specialization consultationFee');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Optional filters: ?doctor=<id>&email=<patient email>&status=<Booked|Completed|Cancelled>
exports.getAppointments = async (req, res) => {
  try {
    const { doctor, email, status } = req.query;
    const filter = {};
    if (doctor) filter.doctor = doctor;
    if (email) filter.patientEmail = String(email).trim().toLowerCase();
    if (status) filter.status = status;

    const appointments = await Appointment.find(filter)
      .populate('doctor', 'name specialization consultationFee')
      .sort({ appointmentDate: -1 });

    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Time slots already taken for a doctor on a date: ?doctor=<id>&date=YYYY-MM-DD
exports.getBookedSlots = async (req, res) => {
  try {
    const { doctor, date } = req.query;
    if (!doctor || !date) {
      return res.status(400).json({ success: false, message: 'doctor and date are required.' });
    }

    const booked = await Appointment.find({
      doctor,
      appointmentDate: new Date(date),
      status: { $ne: 'Cancelled' },
    }).select('timeSlot');

    res.status(200).json({ success: true, data: booked.map((a) => a.timeSlot) });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate('doctor', 'name specialization consultationFee');

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    res.status(200).json({ success: true, message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
