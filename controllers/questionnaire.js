const Questionnaire = require('../models/questionnaire')
const Organ = require('../models/organs')
const translate = require('translate')
const asyncHandler = require('express-async-handler')
const { paginator } = require('../helpers/paginator')
const getData = require('../helpers/getData')
const response = require('../helpers/lang.json')
const customValidation = async (language, parent, choices, type, text) => {
    const lang = language || 'en'
    if (parent !== undefined) {
        const parentExist = await Questionnaire.findOne({ _id: parent._id, deleted: false })
        if (!parentExist)
            return response.errors.parentQuestion[lang]
        const parentChoices = parentExist.choices.map(x => (x[lang]).toString())
        if (!parentChoices.includes(parent.fromAnswer))
            return response.errors.parentAnswer[lang]
        const questionExist = await Questionnaire.findOne({
            'parent._id': parent._id,
            'parent.fromAnswer': parent.fromAnswer,
            // $or: [{ 'text.en': new RegExp(text.en) }, { 'text.ar': new RegExp(text.ar) }],
            deleted: false
        })
        // if (questionExist)
        //     return response.errors.questionRedundancy[lang]
    }

    if (type === 'multiple' && (choices === undefined || choices.length === 0))
        return response.errors.multipeChoice[lang]
}
exports.add = asyncHandler(async (req, res) => {
    const lang = req.headers.lang || 'en'
    const { parent, choices, type, text } = req.body
    const validate = await customValidation(lang, parent, choices, type, text)
    if (validate !== undefined)
        return res.status(400).json({ error: validate })
    const choicesData = type === 'yesNo' ? [{ en: "no", ar: "لا" }, { en: "yes", ar: "نعم" }] : choices
    const data = new Questionnaire({
        ...req.body,
        text: { en: req.body.text.en, ar: await translate(`${req.body.text.en}`, 'ar') },
        organ: req.params.organ,
        choices: choicesData,

    })
    await data.save()
    return res.status(200).json({ message: response.actions.create[lang], data })
})
exports.update = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { parent, choices, type, text } = req.body
    const lang = req.headers.lang || 'en'
    let isFile = (req.files !== undefined && req.files !== null)
    const upload = isFile ? req.files.file[0].filename : null
    const exist = await Questionnaire.findOne({ _id: id, deleted: false })
    if (!exist)
        return res.status(200).json({ error: response.errors.notFound[lang] })
    const validate = await customValidation(lang, parent, choices, type, text)
    if (validate !== undefined)
        return res.status(400).json({ error: validate })
    await exist.updateOne({ $set: { ...req.body, choices, file: upload } })
    return res.status(200).json({ message: response.actions.update[lang], exist })
})
exports.get = asyncHandler(async (req, res) => {
    const { page, limit, searchWord } = req.query
    const { organ } = req.params
    const lang = req.headers.lang || 'en'
    const questionnaire = await Questionnaire.find({
        deleted: false,
        organ,
        $or: [{ 'title.en': new RegExp(searchWord) }, { 'title.ar': new RegExp(searchWord) }]
    })
    // const langData = await getData(questionnaire, lang)
    const data = paginator(questionnaire, page, limit)
    return res.status(200).json(data)
})
exports.Delete = asyncHandler(async (req, res) => {
    const { id } = req.params
    const lang = req.headers.lang || 'en'
    const exist = await Questionnaire.findOne({ _id: id, deleted: false })
    if (!exist)
        return res.status(400).json({ error: response.errors.notFound[lang] })
    await exist.update({ deleted: true })
    return res.status(200).json({ message: response.actions.delete[lang] })
})
exports.getQuestionDetails = asyncHandler(async (req, res) => {
    const { id } = req.params
    const lang = req.headers.lang || 'en'
    const questionnaire = await Questionnaire.findOne({ _id: id }).populate('organ')
    return res.status(200).json({ message: response.actions.get[lang], data: questionnaire })
})

function EmptyCheck(value) {
    return Object.keys(value).length === 0
        && value.constructor === Object; // 👈 constructor check
}

exports.answerQuestionnaire = asyncHandler(async (req, res) => {
    const { organ } = req.params
    const { answer, question } = req.body
    const lang = req.headers.lang || 'en'
    const next = await Questionnaire.findOne({ 'parent._id': question, 'parent.fromAnswer': answer, deleted: false })

    const handleNext = await Questionnaire.findOne({ _id: question, deleted: false })
    const index = handleNext.choices.findIndex(x => x.ar === answer)
    const fromAnswer = !next ? handleNext.choices[index].en : answer
    const upcoming = await Questionnaire.findOne({ 'parent._id': question, 'parent.fromAnswer': fromAnswer, deleted: false })
    const organDetails = await Organ.findOne({ _id: organ })
    if (upcoming === null)
        return res.status(400).json({ error: 'no upcoming question/result planned ' })
    const langData = await getData(upcoming, lang)
    const category = upcoming.type === 'result' ? 'result' : 'nextQuestion'
    const { text, _id, choices, type, parent, tickOptions, fact, files } = langData
    console.log(fact)
    const data = {
        parent: parent._id !== undefined ? parent : null,
        text,
        files,
        _id,
        choices: choices.length === 0 ? undefined : choices,
        type,
        organ: { _id: organ, title: organDetails.title[lang] },
        tickOptions: EmptyCheck(tickOptions) ? undefined : tickOptions,
        // fact: fact[lang] === undefined ? undefined : fact
        fact
    }
    return res.status(200).json({ message: response.actions.get[lang], [category]: data })
})