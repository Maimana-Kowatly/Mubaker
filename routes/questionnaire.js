const express = require("express");
const { add, update, get, Delete, getQuestionDetails, answerQuestionnaire } = require('../controllers/questionnaire');
const { requireSignin } = require("../middlewares/auth");
const { addQuestionnaireValidation, updateQuestionnaireValidation } = require("../validations/questionnaire");
const router = express.Router()
router.route('/:organ')
    .post(requireSignin, addQuestionnaireValidation, add)
    .get(get)
router.route('/:id')
    .put(requireSignin, updateQuestionnaireValidation, update)
    .delete(requireSignin, Delete)
router.route('/details/:id')
    .get(requireSignin, getQuestionDetails)
router.route('/answer/:organ')
    .post( answerQuestionnaire)    

module.exports = router