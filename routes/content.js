const express = require("express");
const { update, get, getFAQ, updateFAQ, deleteFAQ, addFAQ, SumbitContact, getEmailMessages, subscribe, listAllSubscribers, test } = require('../controllers/content');
const { requireSignin, adminMiddleware } = require("../middlewares/auth");
const { updateContentValidation, FAQValidation } = require("../validations/content");
const router = express.Router()
router.route('/')
    .put(requireSignin, adminMiddleware,updateContentValidation, update)
    .get(get)
router.route('/faq')
    .post(requireSignin, adminMiddleware,FAQValidation, addFAQ)
    .get(getFAQ)
router.route('/faq/:id')
    .put(requireSignin, adminMiddleware,FAQValidation, updateFAQ)
    .delete(requireSignin, deleteFAQ)
router.route('/messages')
    .post(SumbitContact)
    .get(requireSignin, adminMiddleware,getEmailMessages)
router.route('/subscribe')
    .post(subscribe)
    .get(requireSignin, adminMiddleware,listAllSubscribers)

    router.route('/test')
    .post(test)
  
module.exports = router