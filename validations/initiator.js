const Joi = require('joi');

const addInitiatorSchema = Joi.object({
    name: Joi.object({
        en: Joi.string().required().messages({ 'any.required': 'english name is required' }),
        ar: Joi.string().required().messages({ 'any.required': 'arabic name is required' })
    }).required().messages({ 'any.required': 'name field is required' }),
    info: Joi.object({
        en: Joi.string().required().messages({ 'any.required': 'english information is required' }),
        ar: Joi.string().required().messages({ 'any.required': 'arabic information is required' }),
    }).required().messages({ 'any.required': 'information field is required' }),
    social: Joi.object({ a: Joi.any() }).unknown(),
    position: Joi.object({
        en: Joi.string().required().messages({ 'any.required': 'english position is required' }),
        ar: Joi.string().required().messages({ 'any.required': 'arabic position is required' }),
    }).required().messages({ 'any.required': 'position field is required' }),
    image: Joi.string(),
}).options({ abortEarly: false });

const updateInitiatorSchema = Joi.object({
    name: {
        en: Joi.string(),
        ar: Joi.string()
    },
    info: {
        en: Joi.string(),
        ar: Joi.string()
    },
    social: Joi.object({ a: Joi.any() }).unknown(),
    position: {
        en: Joi.string(),
        ar: Joi.string(),
    },
    image: Joi.string(),
}).options({ abortEarly: false });

const schemaValidation = (schema, body) => {
    const response = schema.validate(body)
    const errors = response.error;
    console.log(errors, 'validation error')
    return errors
}

exports.addInitiatorValidation = (req, res, next) => {
    const errors = schemaValidation(addInitiatorSchema, req.body)
    if (errors !== undefined)
        return res.status(400).json({ error: errors.details[0].message });
    next();
}

exports.updateInitiatorValidation = (req, res, next) => {
    const errors = schemaValidation(updateInitiatorSchema, req.body)
    if (errors !== undefined)
        return res.status(400).json({ error: errors.details[0].message });
    next();
}


