const Joi = require('joi');

const addOrgansSchema = Joi.object({
    title: Joi.object({
        en: Joi.string().required().messages({ 'any.required': 'english title is required' }),
        ar: Joi.string().required().messages({ 'any.required': 'arabic title is required' })
    }).required().messages({ 'any.required': 'title field is required' }),
    active:Joi.bool(),
    freeVoucher:Joi.string().allow(null),
    screeningVoucher:Joi.string().allow(null),
    procedureInfo:Joi.string().allow(null),
    file:Joi.object({})
   
}).options({ abortEarly: false });

const updateOrgansSchema = Joi.object({
    title: {
        en: Joi.string(),
        ar: Joi.string()
    },
    active:Joi.bool(),
    freeVoucher:Joi.string().allow(null),
    screeningVoucher:Joi.string().allow(null),
    procedureInfo:Joi.string().allow(null),
    file:Joi.object({
        procedureInfo:Joi.string().allow(null),
        freeVoucher:Joi.string().allow(null),
        screeningVoucher:Joi.string().allow(null)
    })

}).options({ abortEarly: false });

const schemaValidation = (schema, body) => {
    const response = schema.validate(body)
    const errors = response.error;
    console.log(errors, 'validation error')
    return errors
}
exports.addOrgansValidation = (req, res, next) => {
    const errors = schemaValidation(addOrgansSchema, req.body)
    if (errors !== undefined)
        return res.status(400).json({ error: errors.details[0].message });
    next();
}
exports.updateOrgansValidation = (req, res, next) => {
    const errors = schemaValidation(updateOrgansSchema, req.body)
    if (errors !== undefined)
        return res.status(400).json({ error: errors.details[0].message });
    next();
}


