const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const AwarnessSchema = Schema(
    {
        title: {
            ar: { type: String, required: true },
            en: { type: String, required: true },
        },
        video:{
            type:String
        },
        pdf:{
            type:String
        },
        thumbnail:{
            type:String
        },
        disease:{ //temp 
            // type:String //or ref organ
            type: mongoose.Schema.Types.ObjectId,
            ref:'Organ',
            required:false
        },
        deleted: {
            type: Boolean,
            default: false
        },
        content: {
            ar: { type: String },
            en: { type: String },
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Awarness',AwarnessSchema);
