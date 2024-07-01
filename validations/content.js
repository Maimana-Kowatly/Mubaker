const Joi = require('joi');

const addContentSchema = Joi.object({
    open: Joi.object({
        from: Joi.string().required().messages({ 'any.required': 'open-from is required' }),
        to: Joi.string().required().messages({ 'any.required': 'open-to is required' })
    }).required().messages({ 'any.required': 'open time field is required' }),
    about: Joi.object({
        en: Joi.string().required().messages({ 'any.required': 'english about is required' }),
        ar: Joi.string().required().messages({ 'any.required': 'arabic about is required' }),
        image: Joi.string()
    }).required().messages({ 'any.required': 'about field is required' }),
    contact: Joi.object({
        phone: Joi.string().required().messages({ 'any.required': 'phone number is required' }),
        mail: Joi.string().required().messages({ 'any.required': 'Mail is required' }),
        address: Joi.string().required().messages({ 'any.required': 'Address is required' }),
        facebook: Joi.string(),
        instagram: Joi.string(),
        twitter: Joi.string(),
        linkedin: Joi.string()
    }),
    introVideo: Joi.string().required().messages({ 'any.required': 'Intro video is required' }),
    privacyPolicy: Joi.object({
        en: Joi.string(),
        ar: Joi.string(),
    }),
    termsAndConditions: Joi.object({
        en: Joi.string(),
        ar: Joi.string(),
    }),
    bookingSlotDuration: Joi.object({
        count: Joi.number(),
        interval: Joi.valid('minute', 'hour')
    }),
    home: Joi.object({
        title: Joi.object({ en: Joi.string(), ar: Joi.string() }),
        description: Joi.object({ en: Joi.string(), ar: Joi.string() }),
        image: Joi.string()
    }),
    vlogsDescription: Joi.object({
        en: Joi.string(),
        ar: Joi.string(),
    }),
    newsDescription: Joi.object({
        en: Joi.string(),
        ar: Joi.string(),
    }),
    screening: Joi.object({
        image: Joi.string(),
        description: Joi.string()
    }),
    awarness: Joi.object({
        file: Joi.string().allow('null'),
        description: Joi.string()
    }),
    initiatorDescription: Joi.string(),
    corporationDescription: Joi.string(),
    brochure:Joi.object({
        smokingCessation: Joi.string().allow('null'),
        lungCancer: Joi.string().allow('null'),
    })
}).options({ abortEarly: false });

const updateContentSchema = Joi.object({
    open: Joi.object({
        from: Joi.string(),
        to: Joi.string()
    }),
    about: Joi.object({
        en: Joi.string(),
        ar: Joi.string(),
        image: Joi.string()
    }),
    contact: Joi.object({
        phone: Joi.string(),
        mail: Joi.string(),
        address: Joi.string(),
        facebook: Joi.string(),
        instagram: Joi.string(),
        twitter: Joi.string(),
        linkedin: Joi.string()
    }),
    privacyPolicy: Joi.object({
        en: Joi.string(),
        ar: Joi.string(),
    }),
    termsAndConditions: Joi.object({
        en: Joi.string(),
        ar: Joi.string(),
    }),
    bookingSlotDuration: Joi.object({
        count: Joi.number(),
        interval: Joi.valid('minute', 'hour')
    }),
    home: Joi.object({
        title: Joi.object({ en: Joi.string(), ar: Joi.string() }),
        description: Joi.object({ en: Joi.string(), ar: Joi.string() }),
        image: Joi.string()
    }),
    vlogsDescription: Joi.object({
        en: Joi.string(),
        ar: Joi.string(),
    }),
    newsDescription: Joi.object({
        en: Joi.string(),
        ar: Joi.string(),
    }),
    screening: Joi.object({
        image: Joi.string(),
        description: Joi.object({
            en: Joi.string(),
            ar: Joi.string(),
        })
    }),
    awarness: Joi.object({
        file: Joi.string().allow('null'),
        description: Joi.object({
            en: Joi.string(),
            ar: Joi.string(),
        })
    }),
    initiatorDescription: Joi.object({
        en: Joi.string(),
        ar: Joi.string(),
    }),
    corporationDescription: Joi.object({
        en: Joi.string(),
        ar: Joi.string(),
    }),
    brochure:Joi.object({
        smokingCessation: Joi.string().allow('null').allow(null),
        lungCancer: Joi.string().allow('null').allow(null),
    })
}).options({ abortEarly: false });


const FAQSchema = Joi.object({
    en: Joi.object({
        question: Joi.string(),
        answer: Joi.string()
    }),
    ar: Joi.object({
        question: Joi.string(),
        answer: Joi.string()
    }),
})
const schemaValidation = (schema, body) => {
    const response = schema.validate(body)
    const errors = response.error;
    console.log(errors, 'validation error')
    return errors
}
exports.addContentValidation = (req, res, next) => {
    const errors = schemaValidation(addContentSchema, req.body)
    if (errors !== undefined)
        return res.status(400).json({ error: errors.details[0].message });
    next();
}
exports.updateContentValidation = (req, res, next) => {
    const errors = schemaValidation(updateContentSchema, req.body)
    if (errors !== undefined)
        return res.status(400).json({ error: errors.details[0].message });
    next();
}
exports.FAQValidation = (req, res, next) => {
    const errors = schemaValidation(FAQSchema, req.body)
    if (errors !== undefined)
        return res.status(400).json({ error: errors.details[0].message });
    next();
}

