const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const OrgansSchema = Schema(
    {
        title: {
            ar: { type: String, required: true },
            en: { type: String, required: true },
        },
        active: {
            type: Boolean,
            default: true
        },
        deleted: {
            type: Boolean,
            default: false
        },
        procedureInfo: { type: String ,},
        screeningVoucher: { type: String },
        freeVoucher: { type: String },
        files:{type:String,default:null}

    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Organ', OrgansSchema);
