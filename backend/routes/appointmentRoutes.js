const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
} = require('../controllers/appointmentController');

router.route('/').get(getAppointments).post(createAppointment);
router.route('/:id').patch(updateAppointmentStatus).delete(deleteAppointment);

module.exports = router;