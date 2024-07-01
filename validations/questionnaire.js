const Joi = require('joi');

const addQuestionnaireSchema = Joi.object({

    type: Joi.string().valid('yesNo', 'multiple', 'result').messages({ 'any.valid': "valid values: yesNo,multiple" }),
    text: Joi.object({
        en: Joi.string().required().messages({ 'any.required': 'english question is required' }),
        // ar: Joi.string().required().messages({ 'any.required': 'arabic question is required' }),
    }),
    choices: Joi.array().items({
        en: Joi.string(),
        ar: Joi.string(),
        number: Joi.number()
    }),
    organ: Joi.string(),
    parent: Joi.object({
        _id: Joi.string().required().messages({ 'any.required': "parent id is required" }),
        fromAnswer: Joi.string().required().messages({ 'any.required': "parent fromAnswer is required" }),
        // fromAnswer:Joi.object({}).required().message({'any.required':"parent fromAnswer id is required"})
    }),
    tickOptions: Joi.object({
        en: Joi.object(),
        ar: Joi.object()
    }),
    fact: Joi.object({
        en: Joi.string(),
        ar: Joi.string()
    }),
    file: Joi.string()
}).options({ abortEarly: false });
const updateQuestionnaireSchema = Joi.object({
    type: Joi.string().valid('yesNo', 'multiple', 'result').messages({ 'any.valid': "valid values: yesNo,multiple" }),
    text: Joi.object({
        en: Joi.string(),
        ar: Joi.string()
    }),
    choices: Joi.array().items({
        en: Joi.string(),
        ar: Joi.string(),
        number: Joi.number()
    }),
    organ: Joi.string(),
    parent: Joi.object({
        _id: Joi.string(),
        fromAnswer: Joi.string()
    }),
    tickOptions: Joi.object({
        en: Joi.object(),
        ar: Joi.object()
    }),
    fact: Joi.object({
        en: Joi.string(),
        ar: Joi.string()
    }),
    file:Joi.string()

}).options({ abortEarly: false });
const schemaValidation = (schema, body) => {
    const response = schema.validate(body)
    const errors = response.error;
    console.log(errors, 'validation error')
    return errors
}

exports.addQuestionnaireValidation = (req, res, next) => {
    const errors = schemaValidation(addQuestionnaireSchema, req.body)
    if (errors !== undefined)
        return res.status(400).json({ error: errors.details[0].message });
    next();
}

exports.updateQuestionnaireValidation = (req, res, next) => {
    const errors = schemaValidation(updateQuestionnaireSchema, req.body)
    if (errors !== undefined)
        return res.status(400).json({ error: errors.details[0].message });
    next();
}


