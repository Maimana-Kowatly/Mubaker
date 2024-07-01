
const response = require('../helpers/lang.json')
const Appointment = require("../models/appointments")
const asyncHandler = require('express-async-handler')
const Calender = require('../models/calender')
const Content = require('../models/content')
const Country = require('../models/country')
const moment = require('moment-timezone')
const { sendByTwillio } = require('../services/sendSMS')
const Questionnaire = require('../models/questionnaire')
const { sendEmail } = require('../services/sendEmail')
const path = require('path')
const User = require('../models/user')
const { paginator } = require('../helpers/paginator')
Date.prototype.subHours = function (h) {
    this.setHours(this.getHours() - h);
    return this;
}
Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}
Date.prototype.addMinutes = function (minutes) {
    this.setMinutes(this.getMinutes() + minutes);
    return this;
};

function increase24TimeByOne(timeStr) {
    let [hours, minutes] = timeStr.split(':');
    return `${((+hours + 1) % 24).toString().padStart(2, '0')}:${minutes}`;
}

const getHoursList = async () => {
    const hrs = []
    var temp
    const content = await Content.findOne()
    var openFrom = content.open.from
    var openTo = content.open.to
    var startTime = moment(openFrom, 'HH:mm');
    var endTime = moment(openTo, 'HH:mm');
    var duration = moment.duration(endTime.diff(startTime));
    var hours = parseInt(duration.asHours());
    hrs.push(openFrom)
    for (i = 0; i < hours - 1; i++) {
        temp = increase24TimeByOne(openFrom)
        hrs.push(temp)
        openFrom = temp
    }
    return hrs
}

const differences = async (list, date, slot, appointmentDates) => {
    const result = []
    list.forEach(element => {
        result.push(new Promise(async (resolve, reject) => {
            const [hour, minute] = element.time.split(':')
            const elementDate = new Date(date)
            elementDate.setHours(hour)
            elementDate.setMinutes(minute)
            const diff = Math.abs((appointmentDates.getTime() - elementDate.getTime()) / 1000)
            resolve(diff)
        }))
    })
    const timeDifferences = await Promise.all(result)
    const index = timeDifferences.findIndex(d => d < slot && d > 0)
    return index
}
exports.getCalenderDateDetails = asyncHandler(async (req, res) => {
    const { date, section } = req.body
    var data = []
    const hours = await getHoursList()
    const lang = req.headers.lang || 'en'
    const calenderDate = await Calender.findOne({ date: new Date(date).toDateString(), section })
    const appointments = calenderDate !== null ? await Appointment.find({ date: calenderDate._id, section }) : []

    hours.forEach(element => {
        const index = appointments.findIndex(x => (x.time === element && x.blocked === true) || (x.time === element && x.userInfo.name !== undefined))
        const test = { [element]: index !== -1 ? false : true }
        data.push(test)
    })
    const obj = object = Object.assign({}, ...data);
    return res.status(200).json({ message: response.actions.get[lang], data: obj })
})

const questionsResult = async (list) => {
    var temp = []
    const promise = []
    list.forEach(async element => {
        promise.push(new Promise(async (resolve, reject) => {
            const index = list.findIndex(x => x._id === element._id)
            const question = await Questionnaire.findOne({ _id: element._id })
            const obj = question !== null ? { _id: question._id, type: question.type, text: question.text, answer: element.answer, ticked: element.ticked } : null
            temp.push(obj)
            if (index === list.length - 1) {
                const result = await Questionnaire.findOne({ 'parent._id': element._id, 'parent.fromAnswer': element.answer })
                const obj = result !== null ? { _id: result._id, type: 'result', text: result.text } : null
                temp.push(obj)
            }
            resolve()
        }))
    })
    await Promise.all(promise)
    return temp
}

exports.getCalenderDateDetailsWithUsersInfo = asyncHandler(async (req, res) => {
    const { date, section } = req.body
    var data = []
    const promise = []
    const hours = await getHoursList()
    const lang = req.headers.lang || 'en'
    const calenderDate = await Calender.findOne({ date: new Date(date).toDateString() })
    const appointments = calenderDate !== null ? await Appointment.find({ date: calenderDate._id, section }).populate('userInfo.nationality').populate('organ') : []

    hours.forEach(async element => {
        promise.push(new Promise(async (resolve, reject) => {
            const index = appointments.findIndex(x => x.time === element)
            const nationality = index !== -1 ? appointments[index].userInfo.nationality : null
            const list = {
                [element]: index !== -1 ? {

                    _id: appointments[index]._id,
                    organ: { _id: appointments[index].organ._id, name: appointments[index].organ.title },
                    userInfo: { ...appointments[index].userInfo, nationality: { _id: nationality._id, name: nationality.name }, insurance: appointments[index].insurance },
                    questionnaire: index !== -1 ? await questionsResult(appointments[index].questionnaire) : null
                    // questionnaire:index!==-1?await questionsResult(  [{
                    //     "_id": "62353e281c7fd1fff04b2be8",
                    //     "answer": "no"
                    // }]):null
                } : null
            }
            data.push(list)
            resolve(list)
        }))
    })
    await Promise.all(promise)
    const obj = Object.assign({}, ...data);
    return res.status(200).json({ message: response.actions.get[lang], data: obj })
})

exports.updateAppointment = asyncHandler(async (req, res) => {
    const { id } = req.params
    var newDate
    const { time, date, section } = req.body
    const appointmentExist = await Appointment.findOne({ _id: id })
    const calenderExist = await Calender.findOne({ date: new Date(date).toDateString(), section })

    if (!calenderExist) {
        const _date = new Calender({ date: new Date(date).toDateString(), section })
        newDate = await _date.save()
    }
    const dateId = calenderExist ? calenderExist._id : newDate._id
    const target = await Appointment.findOne({ time, date: dateId, section })
    if (!appointmentExist)
        return res.status(400).json({ error: response.errors.notFound['en'], _id: id })
    if (appointmentExist.userInfo.name === undefined)
        return res.status(400).json({ error: 'no appointments booked in current slot' })
    if (target)
        return res.status(400).json({ error: 'this slot already booked' })

    const data = await Appointment.findOneAndUpdate({ _id: id }, { time: time, date: dateId, section }, { new: true })
    return res.status(200).json({ message: 'updated', data })
})


exports.BlockAndUnblockTimeSlot = asyncHandler(async (req, res) => {
    const { date, time, section } = req.body
    const calenderExist = await Calender.findOne({ date: new Date(date).toDateString(), section })
    if (calenderExist) {
        const data = await Appointment.findOne({ time: time, date: calenderExist._id, section })
        if (data) {
            if (data.userInfo !== null && data.userInfo.name !== undefined)
                return res.status(400).json({ error: 'cannot block booked slot', data: data.userInfo })
            await data.updateOne({ blocked: !data.blocked })
            return res.status(200).json({ message: 'updated', blocked: !data.blocked })
        }
        const newSlot = new Appointment({ date: calenderExist._id, time: time, blocked: true, section })
        await newSlot.save()
        return res.status(200).json({ message: 'updated', blocked: true, section })
    }
    else {
        const _date = new Calender({ date: new Date(date).toDateString(), section })
        const newDate = await _date.save()
        const newSlot = new Appointment({ date: newDate._id, time: time, blocked: true, section })
        await newSlot.save()
        return res.status(200).json({ message: 'updated', blocked: true, section })
    }
})
exports.bookAppointments = asyncHandler(async (req, res) => {

    const { date, time, userInfo, questionnaire, section, insurance } = req.body
    const { id } = req.params
    //manage time differnce
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    console.log(tz, 'timezone')
    var now = moment.utc();
    var datecal = new Date(date)
    const timeformat = time !== undefined ? time.split(':') : null
    const appointmentTime = timeformat !== null ? new Date(datecal.setHours(parseInt(timeformat[0]), parseInt(timeformat[1]))) : null

    var utc = moment.tz.zone("UTC").utcOffset(now);
    var local = moment.tz.zone(tz).utcOffset(now);

    const diff = (utc - local) / 60;
    const newtime = new Date(appointmentTime).subHours(diff)
    const utcTime = `${newtime.getHours()}:${newtime.getMinutes()}`

    // const tz=Intl.DateTimeFormat().resolvedOptions().timeZone
    // console.log(tz)
    // var now = moment.utc();
    // const datet=new Date('sat 1 Apr 2022')
    // const time1="7:07"
    // const timet = time1!==undefined?time1.split(':'):null
    // const noteTime =timet!==null? new Date(datet.setHours(parseInt(timet[0]), parseInt(timet[1]))):null
    // var utc = moment.tz.zone("UTC").utcOffset(now); 
    // var local = moment.tz.zone(tz).utcOffset(now);
    // const diff=(utc - local) / 60;
    // const newtime=new Date(noteTime).subHours(diff)
    // console.log(diff,`${newtime.getHours()}:${newtime.getMinutes()}`)
    //////////////////////////
    var newDate
    const lang = req.headers.lang || 'en'
    const content = await Content.find({})
    const [hour, minute] = time.split(':')
    const open = content[0].open.from
    const close = content[0].open.to
    const bookingSlotDuration = content[0].bookingSlotDuration
    const nationality = await Country.findOne({ _id: userInfo.nationality })

    if (!nationality)
        return res.status(400).json({ field: 'userInfo.nationality', error: response.errors.notFound[lang] })
    if (open > time && time >= close)
        return res.status(400).json({ message: `not available before ${open} - and after ${close}` })
    //assign time to date
    const appointmentDates = new Date(date)
    appointmentDates.setHours(hour)
    appointmentDates.setMinutes(minute)
    const calenderDate = new Date(date).toDateString()
    const dateExist = await Calender.findOne({ date: calenderDate })
    if (dateExist !== null && dateExist.blocked)
        return res.status(400).json({ error: "this date is blocked" }) // whole date is blocked
    if (!dateExist) {
        const _date = new Calender({ date: calenderDate, blocked: false, section })
        newDate = await _date.save()
    }

    const dateId = !dateExist ? newDate._id : dateExist._id
    const appointmentExist = await Appointment.findOne({ date: dateId, time: time, section: section })
    const slot = bookingSlotDuration.interval === 'hour' ? 60 * 60 * bookingSlotDuration.count : 60 * bookingSlotDuration.count

    const allappointmentforDate = await Appointment.find({ date: dateId })
    const filternouserInfo = allappointmentforDate.filter(x => x.userInfo.name !== undefined)
    const index = await differences(filternouserInfo, date, slot, appointmentDates)
    const blockedAppointments = await Appointment.find({ blocked: true, date: dateId })
    const blockedIndex = await differences(blockedAppointments, date, slot, appointmentDates)
    ////////////blocking logic//////////////////
    // console.log(appointmentExist && appointmentExist.blocked, appointmentExist.blocked)
    if (appointmentExist && appointmentExist.blocked)
        return res.status(400).json({ error: `this time [${appointmentExist.time}] is blocked` }) //specific time is blocked

    if (blockedIndex !== -1) {
        const blockedTime = blockedAppointments[blockedIndex].time
        var totalInMinutes = (parseInt(blockedTime.split(":")[0]) * 60) + parseInt(blockedTime.split(":")[1]);
        var otherMinutes = bookingSlotDuration.interval === 'hour' ? 59 * bookingSlotDuration.count : bookingSlotDuration.count;
        var maxTotal = otherMinutes + totalInMinutes;
        var minTotal = totalInMinutes - otherMinutes
        var maxBookH = (Math.floor(maxTotal / 60)).toString().length > 1 ? Math.floor(maxTotal / 60) : '0' + Math.floor(maxTotal / 60)
        var maxBookM = (maxTotal % 60).toString().length > 1 ? maxTotal % 60 : '0' + maxTotal % 60
        var bookingDurationToHour = maxBookH + ':' + maxBookM;
        var minBookH = (Math.floor(minTotal / 60)).toString().length > 1 ? Math.floor(minTotal / 60) : '0' + Math.floor(minTotal / 60);
        var minBookM = (minTotal % 60).toString().length > 1 ? minTotal % 60 : '0' + minTotal % 60
        var bookingMinDurationToHour = minBookH + ':' + minBookM;
        return res.status(400).json({ error: `[${blockedAppointments[blockedIndex].time}] time slot is blocked , not available to book in [${bookingMinDurationToHour} - ${bookingDurationToHour}]` })
    }
    //////////////////end of blocking logic////////    

    //blocking &booking
    if (appointmentExist && appointmentExist.userInfo.name === undefined) {
        await appointmentExist.updateOne({ userInfo: userInfo, questionnaire, section, utcTime })
        return res.status(200).json({ data: { ...appointmentExist._doc, userInfo } })
    }
    // if (index !== -1 && filternouserInfo[index].blocked === true)
    //     return res.status(400).json({ message: 'blocked test' })

    if (index !== -1 && filternouserInfo[index].userInfo.name !== undefined || appointmentExist && appointmentExist.userInfo.name !== undefined) {
        const at = filternouserInfo[index] !== undefined ? filternouserInfo[index].time : appointmentExist.time
        return res.status(400).json({ error: `not available ,booked at ${at}` })
    }
    ////////////////
    const _appointment = new Appointment({ date: dateId, time, userInfo, questionnaire, section, utcTime, insurance, organ: id === 'general' ? null : id })
    const newAppointment = await _appointment.save()
    sendByTwillio(userInfo.phone, `Mubaker App: Hello ${userInfo.name}, Appointment confirmed for ${section} section, on ${date} at ${time}`)
    var replacements = {
        username: userInfo.name,
        time: time,
        section: section,
        date: date
    };
    const subject = 'Appointment Confirmation'
    const filePath = path.join(__dirname, '../services/emails_template/confirmation.html');
    sendEmail(userInfo.email, subject, filePath, replacements)
    return res.status(200).json({ message: response.actions.create[lang], data: newAppointment })
})


exports.getAppointments = asyncHandler(async (req, res) => {
    const user_id = req.user._id
    const promise = []
    const sectionAppointments = []
    const { page, limit, section } = req.query
    const userExist = await User.findOne({ _id: user_id, deleted: false })
    if (!userExist)
        return res.status(400).json({ error: 'user not found' })
    const sec = section === undefined && userExist.role === 'doctor' ? userExist.spec : section
    const appointments = await Appointment.find({ section: sec, deleted: false }).populate('userInfo.nationality').populate('date').populate('organ')
    appointments.forEach(async element => {
        promise.push(new Promise(async (resolve, reject) => {
            const list = {
                ...element._doc,
                date: element.date.date,
                organ: element.organ !== undefined && element.organ !== null ? { name: element.organ.title, _id: element.organ.id } : null,
                userInfo: {
                    ...element.userInfo,
                    nationality: element.userInfo.nationality !== undefined ? element.userInfo.nationality.name : null,
                    insurance: element.insurance
                },
                questionnaire: await questionsResult(element.questionnaire)
                // questionnaire:await questionsResult(  [{
                //     "_id": "62353e281c7fd1fff04b2be8",
                //     "answer": "no"
                // }])
            }
            sectionAppointments.push(list)
            resolve(list)
        }))
    })
    await Promise.all(promise)
    const sortedDate = sectionAppointments.sort((a, b) => new Date(b.date) - new Date(a.date));
    const data = paginator(sortedDate, page, limit)
    return res.status(200).json({ message: 'success', data })
})