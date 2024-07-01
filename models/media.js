const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const MediaSchema = Schema(
    {
        media: {
            type: String,
            enum: ['news', 'vlogs'],
            default: 'news'
        },
        file: {
            type: String,
            required: true
        },
        thumbnail: {
            type: String
        },
        type: {
            type: String,
            enum: ['interview', 'event', 'article'],
            default: 'interview'
        },
        title: {
            ar: { type: String, required: true },
            en: { type: String, required: true },
        },
        content: {
            ar: { type: String },
            en: { type: String },
        },
        deleted: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Media', MediaSchema);
