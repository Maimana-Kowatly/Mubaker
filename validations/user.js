const Joi = require('joi');

const signUpSchema = Joi.object({

    name: Joi.string().required().messages({ 'any.required': "name is required" }),
    email: Joi.string().required().messages({ 'any.required': "email is required" }),
    password: Joi.string().required().messages({ 'any.required': "password is required" })
}).options({ abortEarly: false });

const signInSchema = Joi.object({

    email: Joi.string().required().messages({ 'any.required': "email is required" }),
    password: Joi.string().required().messages({ 'any.required': "password is required" })
}).options({ abortEarly: false });

const schemaValidation = (schema, body) => {
    const response = schema.validate(body)
    const errors = response.error;
    console.log(errors, 'validation error')
    return errors
}

exports.signUpValidation = (req, res, next) => {
    const errors = schemaValidation(signUpSchema, req.body)
    if (errors !== undefined)
        return res.status(400).json({ error: errors.details[0].message });
    next();
}

exports.signInValidation = (req, res, next) => {
    const errors = schemaValidation(signInSchema, req.body)
    if (errors !== undefined)
        return res.status(400).json({ error: errors.details[0].message });
    next();
}


