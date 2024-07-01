const Content = require('../models/content')
const asyncHandler = require('express-async-handler')
const getData = require('../helpers/getData')
const response = require('../helpers/lang.json');
const { contactUsEmail } = require('../services/sendEmail');
const { paginator } = require('../helpers/paginator');
const Questionnaire = require('../models/questionnaire');
function omit(key, obj) {
    const { [key]: omitted, ...rest } = obj;
    return rest;
}
exports.update = asyncHandler(async (req, res) => {
    const lang = req.headers.lang || 'en'
    const introVideo = req.files.introVideo !== undefined ? req.files.introVideo[0].filename : undefined
    const homeImage = req.files.homeImage !== undefined ? req.files.homeImage[0].filename : null
    const aboutImage = req.files.aboutImage !== undefined ? req.files.aboutImage[0].filename : null
    const screenImage = req.files.screenImage !== undefined ? req.files.screenImage[0].filename : null
    const awarnessFile = req.files.awarnessFile !== undefined ? req.files.awarnessFile[0].filename : null
    const lungCancerBrochure = req.files.lungCancerBrochure !== undefined ? req.files.lungCancerBrochure[0].filename : null
    const smokingCessationBrochure = req.files.smokingCessationBrochure !== undefined ? req.files.smokingCessationBrochure[0].filename : null
    const content = await Content.find({})
    if (content.length > 0) {
        const body = {
            ...req.body,
            introVideo: introVideo,
            home: { ...req.body.home, image: homeImage !== null ? homeImage : content[0].home.image },
            about: { ...req.body.about, image: aboutImage !== null ? aboutImage : content[0].about.image },
            screening: { ...req.body.screening, image: screenImage !== null ? screenImage : content[0].screening.image },
            awarness: { ...req.body.awarness, file: req.body.awarness.file === 'null' ? null : awarnessFile !== null ? awarnessFile : content[0].awarness.file }
        }
        const questionnaire = await Questionnaire.findOne({ _id: "625a31c699f1d027eaa9116f" })
        const lungQuestionnareFiles = {
            smokingCessationBrochure: req.body.brochure !== undefined && req.body.brochure.smokingCessation === 'null' ? null : smokingCessationBrochure !== null ? smokingCessationBrochure : questionnaire.files.smokingCessationBrochure,
            lungCancerBrochure: req.body.brochure !== undefined && req.body.brochure.lungCancerBrochure === 'null' ? null : lungCancerBrochure !== null ? lungCancerBrochure : questionnaire.files.lungCancerBrochure
        }
        const data = await Content.findOneAndUpdate({ _id: content[0]._id }, { $set: body }, { new: true })
        await Questionnaire.findOneAndUpdate({ _id: "625a31c699f1d027eaa9116f" }, { files: lungQuestionnareFiles }, { new: true })
        await Questionnaire.findOneAndUpdate({ _id: "625a313ea1a28e2fcb75be05" }, { files: lungQuestionnareFiles }, { new: true })
        return res.status(200).json({ message: response.actions.update[lang], data })
    }
    else {
        const _content = new Content({
            ...req.body,
            introVideo,
            home: { ...req.body.home, image: homeImage },
            about: { ...req.body.about, image: aboutImage },
            screening: { ...req.body.screening, image: screenImage },
            awarness: { ...req.body.awarness, file: awarnessFile }
        })
        await _content.save()
        return res.status(200).json({ message: response.actions.create[lang] })
    }
})

exports.get = asyncHandler(async (req, res) => {
    const lang = req.headers.lang || 'en'
    const content = await Content.findOne({})
    const data = omit('FAQ', content._doc)
    const langData = req.headers.lang !== undefined ? await getData(data, lang) : data
    const lungQuestionnareFiles = await Questionnaire.findOne({ _id: "625a31c699f1d027eaa9116f" })
    const { smokingCessationBrochure, lungCancerBrochure } = lungQuestionnareFiles.files
    return res.status(200).json({ ...langData, smokingCessationBrochure, lungCancerBrochure })
})
// FAQ apis (array of objects)
exports.addFAQ = asyncHandler(async (req, res) => {
    const lang = req.headers.lang || 'en'
    const content = await Content.findOne({})
    await content.update({ FAQ: content.FAQ.concat(req.body) })
    return res.status(200).json({ message: response.actions.create[lang] })
})
exports.updateFAQ = asyncHandler(async (req, res) => {
    const { id } = req.params
    const lang = req.headers.lang || 'en'
    const content = await Content.findOne({})
    const FAQ = content.FAQ
    const index = FAQ.findIndex(f => f._id.toString() === id)
    FAQ[index] = req.body

    await content.update({ FAQ: FAQ })
    return res.status(200).json({ message: response.actions.update[lang] })
})
exports.getFAQ = asyncHandler(async (req, res) => {
    const lang = req.headers.lang || 'en'
    const content = await Content.findOne({})
    const FAQ = content.FAQ
    return res.status(200).json({ message: response.actions.get[lang], data: FAQ })
})
exports.deleteFAQ = asyncHandler(async (req, res) => {
    const { id } = req.params
    const lang = req.headers.lang || 'en'
    const content = await Content.find({})
    const FAQ = content[0].FAQ
    const index = FAQ.findIndex(f => f._id.toString() === id)
    delete FAQ[index]
    const data = await FAQ.filter(f => f != null)
    await Content.findOneAndUpdate({ _id: content[0]._id }, { FAQ: data })
    return res.status(200).json({ message: response.actions.delete[lang] })
})

exports.SumbitContact = asyncHandler(async (req, res) => {
    const lang = req.headers.lang || 'en'
    const { email, message, name } = req.body
    console.log(await contactUsEmail(email, message, name))
    const content = await Content.findOne({})
    const messages = content.emailMessages !== null ? content.emailMessages.concat(req.body) : req.body
    await content.updateOne({ emailMessages: messages })
    res.status(200).json({ message: 'message sent successfully' })
})
exports.getEmailMessages = asyncHandler(async (req, res) => {
    const lang = req.headers.lang || 'en'
    const { page, limit } = req.query
    const content = await Content.findOne({})
    const data = paginator(content.emailMessages, page, limit)
    return res.status(200).json({ message: response.actions.get[lang], data })
})
exports.subscribe = asyncHandler(async (req, res) => {
    const lang = req.headers.lang || 'en'
    const content = await Content.findOne({})
    const list = content.subscribers !== null ? content.subscribers.concat(req.body.email) : req.body.email
    if (content.subscribers.includes(req.body.email))
        return res.status(400).json({ error: 'already subscribed' })
    await content.update({ subscribers: list })
    return res.status(200).json({ message: 'subscribed successfully' })
})
exports.listAllSubscribers = asyncHandler(async (req, res) => {
    const lang = req.headers.lang || 'en'
    const { page, limit } = req.query
    const content = await Content.findOne({})
    const data = paginator(content.subscribers, page, limit)
    return res.status(200).json({ message: response.actions.get[lang], data })
})
exports.test = asyncHandler(async (req, res) => {
    const content = await Content.findOneAndDelete({})
    return res.status(200).json({ message: "true", content })
})