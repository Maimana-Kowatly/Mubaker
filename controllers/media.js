const Media = require('../models/media')
const asyncHandler = require('express-async-handler')
const response = require('../helpers/lang.json')
const { paginator } = require('../helpers/paginator')
const getData = require('../helpers/getData')
exports.add = asyncHandler(async (req, res) => {
    const { media, type } = req.params
    const lang = req.headers.lang || 'en'
    const file = req.files.file !== undefined ? req.files.file[0].filename : null
    const thumbnail = req.files.thumbnail !== undefined ? req.files.thumbnail[0].filename : null
    const data = new Media({
        ...req.body, file, media, thumbnail, type
    })
    await data.save()
    return res.status(200).json({ message: response.actions.create[lang], data })
})
exports.update = asyncHandler(async (req, res) => {
    const { id } = req.params
    const lang = req.headers.lang || 'en'
    const mediaExist = await Media.findOne({ _id: id, deleted: false })
    if (!mediaExist)
        return res.status(400).json({ error: response.errors.notFound[lang], id })
    const file = req.files.file !== undefined ? req.files.file[0].filename : undefined
    const thumbnail = req.files.thumbnail !== undefined ? req.files.thumbnail[0].filename : undefined
    const body = { ...req.body, file, thumbnail }
    await mediaExist.updateOne({ $set: body })
    return res.status(200).json({ message: response.actions.update[lang] })
})
exports.Delete = asyncHandler(async (req, res) => {
    const { id } = req.params
    const lang = req.headers.lang || 'en'
    const mediaExist = await Media.findOne({ _id: id, deleted: false })
    if (!mediaExist)
        return res.status(400).json({ error: response.errors.notFound[lang] })
    await mediaExist.updateOne({ deleted: true })
    return res.status(200).json({ message: response.actions.delete[lang] })
})
exports.getAllByType = asyncHandler(async (req, res) => {
    const { media, type } = req.params
    const allMedia = await Media.find({ deleted: false, media, type })
    const lang = req.headers.lang || 'en'
    const { page, limit, searchWord } = req.query
    const langData = req.headers.lang !== undefined ? await getData(allMedia, lang) : allMedia
    const data = paginator(langData, page, limit)
    return res.status(200).json(data)
})