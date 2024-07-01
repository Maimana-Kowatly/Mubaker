const express = require("express");
const {  countriesDropDown } = require('../controllers/country');
const router = express.Router()

router.route('/')
    .get(countriesDropDown)
        
module.exports = router