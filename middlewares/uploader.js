const multer = require('multer')
const path = require('path')
const shortid = require('shortid')
const storages = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), 'public'))
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + '-' + file.originalname)
  }
})
exports.upload = multer({ storage: storages });