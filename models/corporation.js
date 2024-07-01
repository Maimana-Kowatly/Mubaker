const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const CorporationSchema = Schema(
    {
        name: {
            ar: { type: String, required: true },
            en: { type: String, required: true },
        },
        image:{
            type:String
        },
        type:{
            type:String,
            enum:['partner','sponser'],
            default:'partner'
        },
        deleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Corporation',CorporationSchema);
