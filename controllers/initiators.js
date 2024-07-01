const { paginator } = require('../helpers/paginator')
const Initiators = require('../models/initiators')
const asyncHandler = require('express-async-handler')
const response = require('../helpers/lang.json')
const getData = require('../helpers/getData')
exports.add = asyncHandler(async (req, res) => {
  let isFile = (req.files !== undefined && req.files !== null)
  const { name } = req.body
  const lang = req.headers.lang || 'en'
  const exist = await Initiators.findOne({
    $or: [{ 'name.en': name.en }, { 'name.ar': name.ar }],
    deleted: false
  })
  if (exist)
    return res.status(400).json({ error: response.errors.alreadyExist[lang], initiator: exist })
  const upload = isFile ? req.files.image[0].filename : null
  const _initiator = new Initiators({ ...req.body, image: upload })
  const data = await _initiator.save()
  return res.status(200).json({ message: response.actions.create[lang], data })
})
exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params
  const lang = req.headers.lang || 'en'
  const exist = await Initiators.findOne({
    _id: id,
    deleted: false
  })
  if (!exist)
    return res.status(400).json({ error: response.errors.notFound[lang], id: id })
  // let isFile = (req.files !== undefined && req.files !== null)
  // const upload = isFile ? req.files.image[0].filename : null
  const upload = req.body.file !== undefined && req.body.file.image === 'null' ? null : req.files.image !== undefined ? req.files.image[0].filename : undefined
  const body = ({ ...req.body, image: upload })
  await Initiators.updateOne({ _id: id }, { $set: body })
  return res.status(200).json({ message: response.actions.update[lang] })
})
exports.getAll = asyncHandler(async (req, res) => {
  const { page, limit, searchWord } = req.query
  const lang = req.headers.lang || 'en'
  const initiators = await Initiators.find({
    deleted: false,
    $or: [
      { $or: [{ 'name.en': new RegExp(searchWord) }, { 'name.ar': new RegExp(searchWord) }] },
      { $or: [{ 'position.en': new RegExp(searchWord) }, { 'position.ar': new RegExp(searchWord) }] }
    ]
  })
  const langData = req.headers.lang !== undefined ? await getData(initiators, lang) : initiators
  const data = paginator(langData, page, limit)
  return res.status(200).json(data)
})
exports.Delete = asyncHandler(async (req, res) => {
  const { id } = req.params
  const lang = req.headers.lang || 'en'
  const exist = await Initiators.findOne({ _id: id, deleted: false })
  if (!exist)
    return res.status(400).json({ error: response.errors.notFound[lang] })
  await exist.update({ deleted: true })
  return res.status(200).json({ message: response.actions.delete[lang] })
})