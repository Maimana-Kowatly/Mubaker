const express = require("express");
const { BlockUnblockCalender, getCalender, fix } = require('../controllers/calender');
const { requireSignin } = require("../middlewares/auth");
const { blockUnblockCalenderValidation, getCalenderValidation } = require("../validations/calender");
const router = express.Router()

router.route('/')
    .put(requireSignin, blockUnblockCalenderValidation, BlockUnblockCalender)
    .post(getCalenderValidation, getCalender)
    .delete(fix)
module.exports = router