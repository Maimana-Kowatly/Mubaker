const Joi = require('joi');

const addAwarnessSchema = Joi.object({
    title: Joi.object({
        en: Joi.string().required().messages({ 'any.required': 'english title is required' }),
        ar: Joi.string().required().messages({ 'any.required': 'arabic title is required' }),
    }).required().messages({ 'any.required': 'title field is required' }),
    content: Joi.object({
        en: Joi.string().required().messages({ 'any.required': 'english content is required' }),
        ar: Joi.string().required().messages({ 'any.required': 'arabic content is required' }),
    }),
    pdf:Joi.string().allow(null),
    video:Joi.string(),
    disease: Joi.string(),
    thumbnail:Joi.string(),
    file:Joi.object({
        video:Joi.string().allow(null),
        pdf:Joi.string().allow(null),
        thumbnail:Joi.string().allow(null)
    })
}).options({ abortEarly: false });

const updateAwarnessSchema = Joi.object({
    title: Joi.object({
        en: Joi.string(),
        ar: Joi.string(),
    }),
    content: Joi.object({
        en: Joi.string(),
        ar: Joi.string(),
    }),
    pdf:Joi.string().allow(null),
    video:Joi.string(),
    disease: Joi.string(),
    thumbnail: Joi.string(),
    file:Joi.object({
        video:Joi.string().allow(null),
        pdf:Joi.string().allow(null),
        thumbnail:Joi.string().allow(null)
    })
}).options({ abortEarly: false });

const schemaValidation = (schema, body) => {
    const response = schema.validate(body)
    const errors = response.error;
    console.log(errors, 'validation error')
    return errors
}

exports.addAwarnessValidation = (req, res, next) => {
    console.log(req.body,'hhhu')
    const errors = schemaValidation(addAwarnessSchema, req.body)
    if (errors !== undefined)
        return res.status(400).json({ error: errors.details[0].message });
    next();
}

exports.updateAwarnessValidation = (req, res, next) => {
    const errors = schemaValidation(updateAwarnessSchema, req.body)
    if (errors !== undefined)
        return res.status(400).json({ error: errors.details[0].message });
    next();
}


