const response = require('../helpers/lang.json')
const Calender = require("../models/calender")
const asyncHandler = require('express-async-handler');
const appointments = require('../models/appointments');
const getDatesBetween = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
    );
    while (currentDate <= endDate) {
        dates.push(currentDate);
        currentDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() + 1,
        );
    }
    return dates;
};
exports.BlockUnblockCalender = asyncHandler(async (req, res) => {
    const { date, section } = req.body
    const calenderDate = new Date(date).toDateString()
    const lang = req.headers.lang || 'en'
    const data = await Calender.findOne({ date: calenderDate, section, deleted: false })
    if (!data) {
        const _date = new Calender({ date: calenderDate, blocked: true, section })
        const newDate = await _date.save()
        return res.status(200).json({ message: response.actions.update[lang], data: { date, blocked: newDate.blocked } })
    }
    const updated = await Calender.findOneAndUpdate({ date: calenderDate, section }, { blocked: !data.blocked }, { new: true })
    return res.status(200).json({ message: response.actions.update[lang], data: { date, blocked: updated.blocked, section } })
})
exports.getCalender = asyncHandler(async (req, res) => {
    const { from, to, section } = req.body
    const lang = req.headers.lang || 'en'
    const list = []
    const dates = getDatesBetween(new Date(from), new Date(to))
    dates.forEach(async element => {
        list.push(new Promise(async (resolve, reject) => {
            const calenderDate = element.toDateString()
            const date = await Calender.findOne({ date: calenderDate, section })
            const obj = { date: element.toDateString(), blocked: date ? date.blocked : false }
            resolve(obj)
        }))
    })
    const data = await Promise.all(list)
    return res.status(200).json({ message: response.actions.get[lang], data })
})
exports.fix = asyncHandler(async (req, res) => {
    const Cal = await Calender.find({})
    Cal.forEach(element => {
        element.deleteOne({})
    })
    const ap = await appointments.find({})
    ap.forEach(element => {
        element.deleteOne({})
    })
    const cal1 = await Calender.find({})
    const app = await appointments.find({})
    return res.status(200).json({ Cal, ap, cal1, app })
})

