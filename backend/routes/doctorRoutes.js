const express = require('express');
const router = express.Router();
const { getDoctors, createDoctor } = require('../controllers/doctorController');

router.route('/').get(getDoctors).post(createDoctor);

module.exports = router;