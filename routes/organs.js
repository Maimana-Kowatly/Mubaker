const express = require("express");
const { add, update, get, Delete, fixorgan } = require('../controllers/organs');
const { requireSignin } = require("../middlewares/auth");
const { addOrgansValidation,updateOrgansValidation } = require("../validations/organs");
const router = express.Router()
router.route('/')
    .post(requireSignin, addOrgansValidation, add)
    .get(get)
router.route('/:id')
    .put( requireSignin, updateOrgansValidation, update)
    .delete(requireSignin, Delete)

router.route('/fix/:id')    
.post(fixorgan)
module.exports = router
