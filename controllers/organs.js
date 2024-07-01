const Organ = require('../models/organs')
const asyncHandler = require('express-async-handler')
const { paginator } = require('../helpers/paginator')
const getData = require('../helpers/getData')
const response = require('../helpers/lang.json')

exports.add = asyncHandler(async (req, res) => {
    const { title } = req.body
    const lang = req.headers.lang || 'en'
    const pdfFile = req.files.procedureInfo !== undefined ? req.files.procedureInfo[0].filename : null
    const exist = await Organ.findOne({
        $or: [{ 'title.en': title.en }, { 'title.ar': title.ar }],
        deleted: false
    })
    if (exist)
        return res.status(400).json({ error: response.errors.alreadyExist[lang] })
    const data = new Organ({ ...req.body, procedureInfo: pdfFile })
    await data.save()
    return res.status(200).json({ message: response.actions.create[lang] })
})

exports.update = asyncHandler(async (req, res) => {
    const { id } = req.params
    const lang = req.headers.lang || 'en'
    const procedureInfo = req.body.file !== undefined && req.body.file.procedureInfo === 'null' ? null : req.files.procedureInfo !== undefined ? req.files.procedureInfo[0].filename : undefined
    const freeVoucher = req.body.file !== undefined && req.body.file.freeVoucher === 'null' ? null : req.files.freeVoucher !== undefined ? req.files.freeVoucher[0].filename : undefined
    const screeningVoucher = req.body.file !== undefined && req.body.file.screeningVoucher === 'null' ? null : req.files.screeningVoucher !== undefined ? req.files.screeningVoucher[0].filename : undefined
    const exist = await Organ.findOne({ _id: id, deleted: false })
    if (!exist)
        return res.status(200).json({ error: response.errors.notFound[lang] })
    await exist.updateOne({ $set: { ...req.body, procedureInfo, freeVoucher, screeningVoucher } })
    return res.status(200).json({ message: response.actions.update[lang] })
})

exports.get = asyncHandler(async (req, res) => {
    const { page, limit, searchWord, all } = req.query
    const lang = req.headers.lang || 'en'
    const organs = all !== undefined ? await Organ.find({
        deleted: false,
        $or: [{ 'title.en': new RegExp(searchWord) }, { 'title.ar': new RegExp(searchWord) }]
    }) : await Organ.find({
        deleted: false,
        active: true,
        $or: [{ 'title.en': new RegExp(searchWord) }, { 'title.ar': new RegExp(searchWord) }]
    })
    const langData = req.headers.lang !== undefined ? await getData(organs, lang) : organs
    const data = paginator(langData, page, limit)
    return res.status(200).json(data)
})
exports.Delete = asyncHandler(async (req, res) => {
    const { id } = req.params
    const lang = req.headers.lang || 'en'
    const exist = await Organ.findOne({ _id: id, deleted: false })
    if (!exist)
        return res.status(400).json({ error: response.errors.notFound[lang] })
    await exist.update({ deleted: true })
    return res.status(200).json({ message: response.actions.delete[lang] })
})

exports.fixorgan = asyncHandler(async (req, res) => {
    const exist = await Organ.find({ deleted: false })
    exist.forEach(async element => {
        await element.update({ files: null })
    })

    return res.status(200).json({ message: 'fixed' })
})