const asyncHandler = require('express-async-handler')
const Country = require("../models/country")

function dynamicSort(property) {
   var sortOrder = 1;
   if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
   }
   return function (a, b) {
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
   }
}
exports.countriesDropDown = asyncHandler(async (req, res) => {
   const countries = await Country.find({})
   console.log(countries, 'testc')
   const lang = req.headers.lang || 'en'
   const data = countries.map(c => {
      return {
         _id: c._id, name: c.name[lang]
      }
   })
   const sorted = data.sort(dynamicSort("name"))
   return res.status(200).json({ data: sorted })
})