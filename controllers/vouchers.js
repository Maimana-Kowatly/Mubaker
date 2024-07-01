const asyncHandler = require("express-async-handler");
const shortid = require("shortid");
const { paginator } = require("../helpers/paginator");
const Vouchers = require("../models/vouchers");
const Organ = require('../models/organs');
const response = require('../helpers/lang.json');
const getData = require("../helpers/getData");

exports.addVoucher = asyncHandler(async (req, res) => {
    const lang=req.headers.lang ||'en'
    const { termsAndConditions, description,type ,organ} = req.body
    const organExist=await Organ.findOne({_id:organ,deleted:false})
    if(!organExist)
    return res.status(400).json({error:response.errors.notFound[lang],organ})
    const voucherOrgans=await Vouchers.findOne({organ,active:true,type}).populate('organ')
    if(voucherOrgans)
    return res.status(400).json({error:`${type} voucher for ${voucherOrgans.organ.title[lang]} organ already exist`})
    const code = req.body.isRandom ? shortid.generate() : req.body.code
    const data = new Vouchers(
        { code,termsAndConditions, description,type ,organ}
    )
    await data.save()
    return res.status(200).json({ message: 'success', data })
})
exports.deleteVoucher = asyncHandler(async (req, res) => {
    const { id } = req.params
    const exist = await Vouchers.findOne({ _id: id, deleted: false })
    if (!exist)
        return res.status(400).json({ error: 'not exist' })
    await exist.updateOne({ deleted: true })
    return res.status(200).json({ message: 'success' })
})
exports.updateVoucher = asyncHandler(async (req, res) => {
    const { id } = req.params
    const exist = await Vouchers.findOne({ _id: id, deleted: false })
    if (!exist)
        return res.status(400).json({ error: 'not exist' })
    await exist.updateOne({ active: !exist.active })
    return res.status(200).json({ message: 'success' })
})
exports.getVouchers = asyncHandler(async (req, res) => {
    const lang=req.headers.lang || 'en'
    const { organ} = req.params
    const organExist=await Organ.findOne({_id:organ,deleted:false})
    if(!organExist)
    return res.status(400).json({error:response.errors.notFound[lang],organ})
    const vouchers = await Vouchers.find({ deleted: false, organ})
    const data=req.headers.lang!==undefined? await getData(vouchers, lang):vouchers
    return res.status(200).json({ message: 'success', data })
})