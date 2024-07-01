const response = require('../helpers/lang.json')
const asyncHandler = require("express-async-handler");
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const { sendEmailCode } = require('../services/sendEmail');
const { paginator } = require('../helpers/paginator');
function randCode() {
    let randstr = ''
    const ch = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
    randstr += ch
    return randstr;
}
function removeProperty(obj, propertyName) {
    let { [propertyName]: _, ...result } = obj
    return result
}

exports.signUp = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const lang = req.headers.lang || 'en'
    const user = await User.findOne({ email: email })
    if (user)
        return res.status(400).json({ error: response.errors.alreadyExist[lang], email: email })
    const hash_password = await bcrypt.hash(password, 10)
    const newUser = new User({
        name,
        email,
        password: hash_password,
        role: 'admin',
        
    })
    const data = await newUser.save()
    const token = jwt.sign({ _id: data._id, role: data.role }, process.env.JWT_SECRET, { expiresIn: '20d' });
    return res.status(200).json({
        message: response.actions.signup[lang],
        data: { _id: data._id, name, email },
        token
    })
})

exports.signIn = asyncHandler(async (req, res) => {
    const lang = req.headers.lang || 'en'
    const { email, password } = req.body
    const user = await User.findOne({ email: email })
    if (!user)
        return res.status(400).json({ error: response.errors.notFound[lang] });
    bcrypt.compare(password, user.password, (err, resp) => {
        if (!resp)
            return res.status(400).json({ error: response.errors.wrongPass[lang] })
        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '20d' });
        const { _id, name, email, role } = user;
        return res.status(200).json({
            message: response.actions.login[lang],
            data: { _id, name, email, role },
            token
        });
    })
})

exports.createAccounts = asyncHandler(async (req, res) => {
    const { email, name, spec } = req.body
    const { role } = req.params
    const lang = req.headers.lang || 'en'
    const pass = shortid.generate()
    const userExist = await User.findOne({ email: email, deleted: false })
    const hash_password = await bcrypt.hash(pass, 10)
    if (userExist)
        return res.status(400).json({ error: response.errors.alreadyExist[lang], email: email })
    const newUser = new User({ email, role: role === 'doctors' ? 'doctor' : 'receptionist', password: hash_password, name, spec: role === 'doctors' ? spec : null })
    await newUser.save()
    return res.status(200).json({ message: response.actions.create[lang], data: { ...newUser._doc, password: pass } })
})

exports.createAccountsAdmin = asyncHandler(async (req, res) => {
  const { email, password,name } = req.body;
  const lang = req.headers.lang || "en";
  
  console.log(req.body)
  const pass = shortid.generate();
  const userExist = await User.findOne({ email: email, deleted: false });
  const hash_password = await bcrypt.hash(password, 10);
  if (userExist)
    return res
      .status(400)
      .json({ error: response.errors.alreadyExist[lang], email: email });
  const newUser = new User({ email, role: "admin", password: hash_password,name });
  await newUser.save();
  return res
    .status(200)
    .json({
      message: response.actions.create[lang],
      data: { ...newUser._doc, password: pass },
    });
});
exports.removeDoctorsOrReceptionists = asyncHandler(async (req, res) => {
    const { id } = req.params
    const lang = req.headers.lang || 'en'
    
    const user = await User.findOne({ _id: id })
    if (!user)
        return res.status(400).json({ error: response.errors.notFound[lang], id: id })
    await user.updateOne({ deleted: true })
    return res.status(200).json({ message: response.actions.delete[lang], id: id, email: user.email })
})
exports.getAllDoctorsOrReceptionist = asyncHandler(async (req, res) => {
    const lang = req.headers.lang || 'en'
    const { role } = req.params
    const { page, limit, searchWord } = req.query
    const doctors = await User.find({ role: role === 'receptionist' ? role : 'doctor', deleted: false, $or: [{ 'email': new RegExp(searchWord) }, { 'name': new RegExp(searchWord) }] })
    const output = doctors.map(d => {
        return removeProperty(d._doc, 'password')
    })
    const data = paginator(output, page, limit)
    return res.status(200).json({ message: response.actions.get[lang], data })
})

exports.forgotPassword = asyncHandler(async (req, res) => {
    const uniqueStr = randCode()
    const { email } = req.body;
    const lang = req.headers.lang || 'en'
    const user = await User.findOne({ email: email })
    if (!user)
        return res.status(400).json({ error: response.errors.notFound[lang], email: email })
    await user.updateOne({
        code: uniqueStr
    })
    const subject = 'Reset Password'
    const message = `your reset password code is: ${uniqueStr}`
    await sendEmail(email, message, subject)
    return res.status(200).json({
        message: `code sent out to ${email}`,
        code: uniqueStr
    })
})

exports.checkCode = asyncHandler(async (req, res) => {
    const { code, email } = req.body
    const lang = req.headers.lang || 'en'
    const user = await User.findOne({ email: email })
    if (!user)
        return res.status(400).json({ error: response.errors.notFound[lang], email: `${email}` })
    if (user.code !== code)
        return res.status(400).json({ error: 'Incorrect code', email: `${email}` })
    return res.status(200).json({ message: response.actions.verifyCode[lang], success: true })
})

exports.resetPassword = asyncHandler(async (req, res) => {
    const { email, newpass, confirmpass } = req.body
    const lang = req.headers.lang || 'en'
    const user = await User.findOne({ email: email })
    if (!user)
        return res.status(400).json({ error: response.errors.notFound[lang], email: `${email}` })
    if (newpass !== confirmpass)
        return res.status(400).json({ error: "password fields not match" })
    const new_hash_password = await bcrypt.hash(newpass, 10)
    await user.updateOne({ password: new_hash_password })
    return res.status(200).json({ message: response.actions.update[lang], email: email })
})