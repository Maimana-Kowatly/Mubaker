const express = require("express");
const { add, update, getAll, Delete } = require('../controllers/initiators');
const { requireSignin, adminMiddleware } = require("../middlewares/auth");
const { addInitiatorValidation, updateInitiatorValidation } = require("../validations/initiator");
const router = express.Router()
router.route('/')
    .post( requireSignin, addInitiatorValidation,adminMiddleware, add)
    .get(getAll)
router.route('/:id', requireSignin)
    .put( requireSignin, updateInitiatorValidation,adminMiddleware, update)
    .delete(requireSignin, Delete)
module.exports = router