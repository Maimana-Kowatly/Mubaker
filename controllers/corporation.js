
const Corporation = require('../models/corporation')
const asyncHandler = require('express-async-handler')
const { paginator } = require('../helpers/paginator')
const getData = require('../helpers/getData')
const response = require('../helpers/lang.json')
exports.add = asyncHandler(async (req, res) => {
    const { type } = req.params
    const { name } = req.body
    const lang = req.headers.lang || 'en'
    const image = req.files !== undefined ? req.files.image[0].filename : null
    const exist = await Corporation.findOne({
        $or: [{ 'name.en': name.en }, { 'name.ar': name.ar }],
        deleted: false,
        type
    })
    if (exist)
        return res.status(400).json({ error: response.errors.alreadyExist[lang], [exist.type]: exist })
    const _corporation = new Corporation({
        name,
        type,
        image
    })
    const data = await _corporation.save()
    return res.status(200).json({ message: response.actions.create[lang], data })
})
exports.update = asyncHandler(async (req, res) => {
    const { id } = req.params
    const lang = req.headers.lang || 'en'
    const image = req.files !== undefined ? req.files.image[0].filename : null
    const body = { ...req.body, image }
    const exist = await Corporation.findOne({ _id: id, deleted: false })
    if (!exist)
        return res.status(200).json({ error: response.errors.notFound[lang] })
    await exist.updateOne({ $set: body })
    return res.status(200).json({ message: response.actions.update[lang] })
})
exports.getAll = asyncHandler(async (req, res) => {
    const { page, limit, searchWord } = req.query
    const { type } = req.params
    const lang = req.headers.lang || 'en'
    const corporations = await Corporation.find({
        deleted: false,
        type: type,
        $or: [{ 'name.en': new RegExp(searchWord) }, { 'name.ar': new RegExp(searchWord) }]
    })
    const langData = req.headers.lang !== undefined ? await getData(corporations, lang) : corporations
    const data = paginator(langData, page, limit)
    return res.status(200).json(data)
})
exports.Delete = asyncHandler(async (req, res) => {
    const { id } = req.params
    const lang = req.headers.lang || 'en'
    const exist = await Corporation.findOne({ _id: id, deleted: false })
    if (!exist)
        return res.status(400).json({ error: response.errors.notFound[lang], id: id })
    await exist.update({ deleted: true })
    return res.status(200).json({ message: response.actions.delete[lang] })
})