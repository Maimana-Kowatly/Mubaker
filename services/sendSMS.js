
const twilio = require("twilio")(
    process.env.TWILIO_ACCOUNTSID,
    process.env.TWILIO_AUTHTOKEN
);

const sendByTwillio = async (to, body) => {
    return await twilio.messages
        .create({ body: body, from: process.env.TWILIO_PHONE, to })
        .then((data) => {
            console.log("success", process.env.TWILIO_PHONE, 'nn', body, to)
            return { result: "success" };
        })
        .catch((err) => {
            console.log(err)
            console.log( process.env.TWILIO_PHONE)
            console.log("failed", process.env.TWILIO_PHONE, body, to)
            return { result: "error" };
        });
}
module.exports={
    sendByTwillio
}