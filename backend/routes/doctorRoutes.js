const express = require('express');
const router = express.Router();
const { getDoctors, createDoctor, deleteDoctor } = require('../controllers/doctorController');

router.route('/').get(getDoctors).post(createDoctor);
router.route('/:id').delete(deleteDoctor);

module.exports = router;
