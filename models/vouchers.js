const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const VoucherSchema = Schema(
    {
        code: {
            type: String
        },
        active: {
            type: Boolean,
            default: true
        },
        deleted: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            enum: ['free', 'screening'],
            default: 'screening'
        },
        description: {
            en: { type: String },
            ar: { type: String }
        },
        termsAndConditions: {
            en: { type: String },
            ar: { type: String }

        },
        organ: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organ'
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Voucher', VoucherSchema);
