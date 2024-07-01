const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ContentSchema = Schema(
    {
        contact: {
            phone: { type: String, required: true },
            mail: { type: String, required: true },
            address: { type: String, required: true },
            facebook: { type: String },
            twitter: { type: String },
            instagram: { type: String },
            linkedin: { type: String },
        },
        open: {
            from: { type: String, required: true },
            to: { type: String, required: true }
        },
        about: {
            ar: { type: String, required: true },
            en: { type: String, required: true },
            image: { type: String }
        },
        introVideo: {
            type: String
        },
        FAQ: [{
            ar: {
                question: { type: String },
                answer: { type: String }
            },
            en: {
                question: { type: String },
                answer: { type: String }
            }
        }],
        privacyPolicy: {
            type: String
        },
        termsAndConditions: {
            en: {
                type: String
            },
            ar: {
                type: String
            }
        },
        bookingSlotDuration: {
            count: {
                type: Number,
                default: 1
            },
            interval: {
                type: String,
                enum: ['minute', 'hour'],
                default: 'hour'
            }
        },
        home: {
            title: {
                en: { type: String },
                ar: { type: String }
            },
            description: {
                en: { type: String },
                ar: { type: String }
            },
            image: { type: String }
        },
        screening: {
            image: { type: String },
            description: {
                en: {
                    type: String
                },
                ar: {
                    type: String
                }
            }
        },
        newsDescription: {
            en: { type: String },
            ar: { type: String }
        },
        vlogsDescription: {
            en: { type: String },
            ar: { type: String }
        },
        emailMessages: [{
            email: { type: String },
            name: { type: String },
            message: { type: String }
        }],
        subscribers: [{
            type: String
        }],
        awarness: {
            file: { type: String },
            description: {
                en: {
                    type: String
                },
                ar: {
                    type: String
                }
            }
        },
        initiatorDescription: {
            en: {
                type: String
            },
            ar: {
                type: String
            }
        },
        corporationDescription: {
            en: {
                type: String
            },
            ar: {
                type: String
            }
        },

    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Content', ContentSchema);
