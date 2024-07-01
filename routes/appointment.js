const express = require("express");
const { getCalenderDateDetails, bookAppointments, updateAppointment, getCalenderDateDetailsWithUsersInfo, BlockAndUnblockTimeSlot, getAppointments } = require('../controllers/appointment');
const { bookAnAppointmentValidation, bookingSlotValidation } = require('../validations/appointment')
const { requireSignin } = require("../middlewares/auth");
const router = express.Router()

router.route('/book/:id')
    .post(bookAnAppointmentValidation, bookAppointments)
router.route('/')
    .put(requireSignin, BlockAndUnblockTimeSlot)
    .get(requireSignin, getAppointments)
router.route('/time/:id')
    .put(requireSignin, updateAppointment)
router.route('/details')
    .post(bookingSlotValidation, getCalenderDateDetails)
router.route('/users')
    .post(bookingSlotValidation, getCalenderDateDetailsWithUsersInfo)


module.exports = router