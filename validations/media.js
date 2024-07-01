const Joi = require('joi');

const addMediaSchema = Joi.object({
    content: Joi.object({
        en: Joi.string().required().messages({ 'any.required': 'english  is required' }),
        ar: Joi.string().required().messages({ 'any.required': 'arabic content is required' }),
    }),
    title: Joi.object({
        en: Joi.string().required().messages({ 'any.required': 'english title is required' }),
        ar: Joi.string().required().messages({ 'any.required': 'arabic title is required' }),
    }).required().messages({ 'any.required': 'title is required' }),
    media:Joi.string().valid('news','media').messages({'any.valid':"valid values: news,vlogs"}),
    type:Joi.string().valid('interviews','article','event').messages({'any.valid':"valid values: interviews,article,event"}),
    file: Joi.string(),
    thumbnail: Joi.string(),
}).options({ abortEarly: false });


const updateMediaSchema = Joi.object({
    content: Joi.object({
        en: Joi.string().required().messages({ 'any.required': 'english  is required' }),
        ar: Joi.string().required().messages({ 'any.required': 'arabic content is required' }),
    }),
    title: Joi.object({
        en: Joi.string().required().messages({ 'any.required': 'english title is required' }),
        ar: Joi.string().required().messages({ 'any.required': 'arabic title is required' }),
    }),
    media:Joi.string().valid('news','media').messages({'any.valid':"valid values: news,vlogs"}),
    type:Joi.string().valid('interviews','article','event').messages({'any.valid':"valid values: interviews,article,event"}),
    file: Joi.string(),
    thumbnail: Joi.string(),
}).options({ abortEarly: false });

const schemaValidation = (schema, body) => {
    const response = schema.validate(body)
    const errors = response.error;
    console.log(errors, 'validation error')
    return errors
}

exports.addMediaValidation = (req, res, next) => {
    const errors = schemaValidation(addMediaSchema, req.body)
    if (errors !== undefined)
        return res.status(400).json({ error: errors.details[0].message });
    next();
}
exports.updateMediaValidation = (req, res, next) => {
    const errors = schemaValidation(updateMediaSchema, req.body)
    if (errors !== undefined)
        return res.status(400).json({ error: errors.details[0].message });
    next();
}


