const express = require("express");
const { signIn, signUp,resetPassword, forgotPassword, checkCode, createAccounts, getAllDoctorsOrReceptionist, removeDoctorsOrReceptionists, createAccountsAdmin } = require('../controllers/user');
const { requireSignin } = require("../middlewares/auth");
const { signUpValidation, signInValidation } = require("../validations/user");

const router = express.Router()
router.route('/signup').post(signUpValidation, signUp)
router.route('/signup/admin').post( createAccountsAdmin)
router.route('/signin').post(signInValidation, signIn)
router.route('/:role')
    .post(requireSignin,createAccounts)
    .get(requireSignin, getAllDoctorsOrReceptionist)
router.route('/:role/:id')
    .delete(requireSignin, removeDoctorsOrReceptionists)
router.route('/password/reset').post(resetPassword)
router.route('/password/verify').post(checkCode)
router.route('/password/forgot').post(forgotPassword)

module.exports = router