const express = require("express");
const { add, update, get, Delete } = require('../controllers/awarness');
const { requireSignin, adminMiddleware, doctorMiddleware, notReceptionist } = require("../middlewares/auth");
const { addAwarnessValidation, updateAwarnessValidation } = require("../validations/awarness");
const router = express.Router()
router.route('/')
    .post(requireSignin, addAwarnessValidation, notReceptionist ,add)
    .get(get)
router.route('/:id')
    .put(requireSignin, updateAwarnessValidation,notReceptionist, update)
    .delete(requireSignin, Delete)
module.exports = router