
const nodemailer = require('nodemailer');
const Content=require('../models/content')
const handlebars=require('handlebars')
var fs = require('fs');


function sendEmail(email, subject, filePath, replacements) {
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    var htmlToSend = template(replacements);
    var Transport = nodemailer.createTransport({
        service: "MailGun",
        auth: {
            user: process.env.MAILGUN_USER,
            pass: process.env.MAILGUN_PASS
        },
        // secure:true
    })
    var mailOptions;
    mailOptions = {
        from: 'Mubaker@mubaker.com',
        to: email,
        subject: subject,
        html: htmlToSend
    }
    Transport.sendMail(mailOptions, function (error, response) {
        if (error)
            console.log(error);
        else
            console.log('email sent')
    })
}

async function contactUsEmail  (email,message,name)  {
    const webContent=await Content.findOne({})
    var Transport = nodemailer.createTransport({
        service: "MailGun",
        auth: {
            user: process.env.MAILGUN_USER,
            pass: process.env.MAILGUN_PASS
        }
    })
    var mailOptions;
    mailOptions = {
        from:email,
        to:webContent.contact.mail,
        subject: "Mubaker Contact Message",
        html: `name: ${name}, message:${message}`
    }
    Transport.sendMail(mailOptions, function (error, response) {
        if (error) 
            console.log(error);
        else 
           console.log('email sent') 
    })
}



module.exports = {
    sendEmail,
    contactUsEmail,
}