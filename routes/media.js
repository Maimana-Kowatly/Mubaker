const express = require("express");
const { add, update, getAllByType, Delete } = require('../controllers/media');
const { requireSignin,  notReceptionist } = require("../middlewares/auth");
const { addMediaValidation, updateMediaValidation } = require("../validations/media");
const router = express.Router()
router.route('/:media/:type')
    .post(requireSignin,addMediaValidation,notReceptionist, add)
    .get(getAllByType)
router.route('/:id', requireSignin)
    .put( requireSignin, updateMediaValidation,notReceptionist, update)
    .delete(requireSignin, notReceptionist, Delete)
module.exports = router