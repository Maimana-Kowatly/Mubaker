const express = require("express");
const { addVoucher, updateVoucher, deleteVoucher, getVouchers } = require('../controllers/vouchers');
const { requireSignin } = require("../middlewares/auth");
const router = express.Router()
router.route('/')
    .post(requireSignin, addVoucher)
router.route('/:organ')
    .get(getVouchers)
router.route('/:id')
    .put(requireSignin, updateVoucher)
    .delete(requireSignin, deleteVoucher)
module.exports = router
