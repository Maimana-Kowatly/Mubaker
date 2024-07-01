const Joi = require('joi');

const addCorporationSchema = Joi.object({
    name: Joi.object({
        en: Joi.string().required().messages({ 'any.required': 'english name is required' }),
        ar: Joi.string().required().messages({ 'any.required': 'arabic name is required' })
    }).required().messages({ 'any.required': 'name field is required' }),
    image: Joi.string(),
}).options({ abortEarly: false });

const updateCorporationSchema = Joi.object({
    name: {
        en: Joi.string(),
        ar: Joi.string()
    },
    image: Joi.string(),
}).options({ abortEarly: false });

const schemaValidation = (schema, body) => {
    const response = schema.validate(body)
    const errors = response.error;
    console.log(errors, 'validation error')
    return errors
}
exports.addCorporationValidation = (req, res, next) => {
    const errors = schemaValidation(addCorporationSchema, req.body)
    if (errors !== undefined)
        return res.status(400).json({ error: errors.details[0].message });
    next();
}
exports.updateCorporationValidation = (req, res, next) => {
    const errors = schemaValidation(updateCorporationSchema, req.body)
    if (errors !== undefined)
        return res.status(400).json({ error: errors.details[0].message });
    next();
}


