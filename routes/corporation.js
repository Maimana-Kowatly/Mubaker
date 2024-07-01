const express = require("express");
const { add, update, getAll, Delete } = require('../controllers/corporation');
const { requireSignin, adminMiddleware } = require("../middlewares/auth");
const { addCorporationValidation, updateCorporationValidation } = require("../validations/corporation");
const router = express.Router()
router.route('/:type')
    .post( requireSignin,addCorporationValidation,adminMiddleware, add)
    .get(getAll)
router.route('/:id')
    .put(requireSignin, updateCorporationValidation,adminMiddleware,update)
    .delete(requireSignin, Delete)
module.exports = router