const Joi = require('joi');


const blockUnblockCalenderSchema = Joi.object({
    date:Joi.string().required().messages({'any.required':'date is required'}),
    section: Joi.string().valid('clinic', 'radiology', 'lab').messages({ 'any.valid': "sections types are: radiology,clinic,lab" }),
}).options({ abortEarly: false });

const getCalenderSchema = Joi.object({
    from:Joi.string().required().messages({'any.required':'from (min date) is required'}),
    to:Joi.string().required().messages({'any.required':'to (max date) is required'}),
    section: Joi.string().valid('clinic', 'radiology', 'lab').messages({ 'any.valid': "sections types are: radiology,clinic,lab" }),
}).options({ abortEarly: false });


const schemaValidation = (schema, body) => {
    const response = schema.validate(body)
    const errors = response.error;
    console.log(errors, 'validation error')
    return errors
}

exports.getCalenderValidation = (req, res, next) => {
    const errors = schemaValidation(getCalenderSchema, req.body)
    if (errors !== undefined)
        return res.status(400).json({ error: errors.details[0].message });
    next();
}

exports.blockUnblockCalenderValidation = (req, res, next) => {
    const errors = schemaValidation(blockUnblockCalenderSchema, req.body)
    if (errors !== undefined)
        return res.status(400).json({ error: errors.details[0].message });
    next();
}


