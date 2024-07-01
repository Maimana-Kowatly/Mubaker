const Awarness = require('../models/awarness')
const asyncHandler = require('express-async-handler')
const { paginator } = require('../helpers/paginator')
const getData = require('../helpers/getData')
const response = require('../helpers/lang.json')
exports.add = asyncHandler(async (req, res) => {
    const lang = req.headers.lang || 'en'
    const pdf = req.files.pdf !== undefined ? req.files.pdf[0].filename : null
    const video = req.files.video !== undefined ? req.files.video[0].filename : null
    const thumbnail = req.files.thumbnail !== undefined ? req.files.thumbnail[0].filename : undefined
    const data = new Awarness({ ...req.body, pdf, video, thumbnail })
    const test = await data.save()
    return res.status(200).json({ message: response.actions.create[lang], data })
})
exports.update = asyncHandler(async (req, res) => {
    const { id } = req.params
    const lang = req.headers.lang || 'en'
    const video = req.body.file !== undefined && req.body.file.video === 'null' ? null
        : req.files.video !== undefined ? req.files.video[0].filename
            : undefined
    const pdf = req.body.file !== undefined && req.body.file.pdf === 'null' ? null
        : req.files.pdf !== undefined ? req.files.pdf[0].filename
            : undefined
    const thumbnail = req.body.file !== undefined && req.body.file.thumbnail === 'null' ? null
        : req.files.thumbnail !== undefined ? req.files.thumbnail[0].filename
            : undefined
    const exist = await Awarness.findOne({ _id: id, deleted: false })
    if (!exist)
        return res.status(200).json({ error: response.errors.notFound[lang], id })
    await exist.updateOne({ $set: { ...req.body, pdf, video, thumbnail } })
    return res.status(200).json({ message: response.actions.update[lang] })
})
exports.get = asyncHandler(async (req, res) => {
    const { page, limit, searchWord, disease } = req.query
    const lang = req.headers.lang || 'en'
    const awarness = disease !== undefined ? await Awarness.find({
        deleted: false,
        disease: disease,
        $or: [{ 'title.en': new RegExp(searchWord) }, { 'title.ar': new RegExp(searchWord) }]
    }) : await Awarness.find({
        deleted: false,
        $or: [{ 'title.en': new RegExp(searchWord) }, { 'title.ar': new RegExp(searchWord) }]
    })
    const langData = req.headers.lang !== undefined ? await getData(awarness, lang) : awarness
    const data = paginator(langData, page, limit)
    return res.status(200).json(data)
})
exports.Delete = asyncHandler(async (req, res) => {
    const { id } = req.params
    const lang = req.headers.lang || 'en'
    const exist = await Awarness.findOne({ _id: id, deleted: false })
    if (!exist)
        return res.status(400).json({ error: response.errors.notFound[lang] })
    await exist.update({ deleted: true })
    return res.status(200).json({ message: response.actions.delete[lang] })
})