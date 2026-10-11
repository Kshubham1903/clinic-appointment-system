const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  getBookedSlots,
  updateAppointmentStatus,
  deleteAppointment,
} = require('../controllers/appointmentController');

router.route('/').get(getAppointments).post(createAppointment);
router.get('/slots', getBookedSlots);
router.route('/:id').patch(updateAppointmentStatus).delete(deleteAppointment);

module.exports = router;
