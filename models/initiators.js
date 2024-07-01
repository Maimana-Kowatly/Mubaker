const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const InitiatorSchema = new Schema(
    {
        name: {
            ar: { type: String, required: true },
            en: { type: String, required: true },
        },
        info: {
            ar: { type: String, required: true },
            en: { type: String, required: true },
        },
        image: {
            type: String,
            required: false
        },
        position: {
            ar: { type: String, required: true },
            en: { type: String, required: true },
        },
        social: {
            type: Object,
            required: false
        },
        deleted: {
            type: Boolean,
            default: false,
            required: false
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Initiator', InitiatorSchema);
