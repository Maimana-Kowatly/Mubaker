
const cron = require('node-cron');
const Appointments = require('../models/appointments.js');

require('dotenv').config()
const { sendEmail } = require('../services/sendEmail.js');
const { sendByTwillio } = require('../services/sendSMS.js')
Date.prototype.subHours = function (h) {
    this.setHours(this.getHours() - h);
    return this;
  }
exports.reminder = async () => {
    cron.schedule('* * * * *', async function () {
        const promise = []
        const temp = new Date()
        temp.setMilliseconds(0)
        const current = new Date(temp)
        console.log(current, 'hello current date')
       
        const appointments = await Appointments.find({}).populate('date')
        appointments.forEach(async element => {
            promise.push(new Promise(async (resolve, reject) => {
                const date = new Date(element.date.date)
                const dayBefore=date.subHours(24)
                const time = element.time !== undefined ? element.time.split(':') : null
                const reminderTime = time !== null ? new Date(dayBefore.setHours(parseInt(time[0]), parseInt(time[1]))) : null
                console.log(reminderTime.getTime() === current.getTime(), reminderTime, current, date)
                if (reminderTime !== null && (reminderTime.getTime() === current.getTime())) {
                    const subject = 'Appointment reminder'
                    const message = `kindly reminder for your appointment tomorrow in Mubaker ${element.section} at ${element.time}`
                    var replacements = {
                        username: userInfo.name,
                        time: time,
                        section: section
                    };
                    const filePath = path.join(__dirname, './emails_template/reminder.html');
                    sendEmail(element.userInfo.email, subject, filePath, replacements)
                    sendByTwillio(element.userInfo.phone, message)
                    console.log('success')
                }
                else
                    resolve()
            }))
            await Promise.all(promise)
        });
    });
}