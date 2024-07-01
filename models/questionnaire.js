const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const QuestionnaireSchema = Schema(
    {
        organ: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organ',
            required: false
        },
        number: {
            type: String
        },
        parent:
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Questionnaire'
            },
            fromAnswer: {
                type: String,
            }
        },
        type: {
            type: String,
            enum: ['yesNo','multiple','result']
        },
        text: {
            ar: { type: String, required: true },
            en: { type: String, required: true },
        },
        choices: [{
            ar: { type: String },
            en: { type: String },
            number: { type: Number }
        }],
        deleted: {
            type: Boolean,
            default: false
        },
        tickOptions:{
           en:{type:Object},
           ar:{type:Object}
        },
        files:{
            type: Object,
        },
        fact:{
            en:{type:String},
            ar:{type:String}
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Questionnaire', QuestionnaireSchema);
