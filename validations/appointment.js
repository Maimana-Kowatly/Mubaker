const Joi = require('joi');

const bookAnAppointmentSchema = Joi.object({
    time: Joi.string().required().messages({ 'any.required': 'time is required in hh:mm 24 format' }),
    date: Joi.string().required().messages({ 'any.required': 'date is required' }),
    userInfo: Joi.object({
        name: Joi.string().required().messages({ 'any.required': 'name is required in userInfo object' }),
        phone: Joi.string().required().messages({ 'any.required': 'phone is required in userInfo object' }),
        nationality: Joi.string().required().messages({ 'any.required': 'name is required in userInfo object' }),
        email: Joi.string().required().messages({ 'any.required': 'email is required in userInfo object' }),
        jobPosition: Joi.string()
    }),
    questionnaire: Joi.array().items({
        _id: Joi.string().required().messages({ 'any.required': "question id is required" }),
        answer: Joi.string().required().messages({ 'any.required': "answer id is required" }),
        ticked:Joi.object()
    }),
    section: Joi.string().valid('clinic', 'radiology', 'lab').messages({ 'any.valid': "sections types are: radiology,clinic,lab" }),
    insurance: Joi.string()
}).options({ abortEarly: false });

const bookingSlotSchema = Joi.object({
    date: Joi.string().required().messages({ 'any.required': 'date is required' }),
    section: Joi.string().valid('clinic', 'radiology', 'lab')
}).options({ abortEarly: false });



const schemaValidation = (schema, body) => {
    const response = schema.validate(body)
    const errors = response.error;
    console.log(errors, 'validation error')
    return errors
}

exports.bookAnAppointmentValidation = (req, res, next) => {
    const errors = schemaValidation(bookAnAppointmentSchema, req.body)
    if (errors !== undefined)
        return res.status(400).json({ error: errors.details[0].message });
    next();
}

exports.bookingSlotValidation = (req, res, next) => {
    const errors = schemaValidation(bookingSlotSchema, req.body)
    if (errors !== undefined)
        return res.status(400).json({ error: errors.details[0].message });
    next();
}


