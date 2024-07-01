

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const AppointmentSchema = Schema(
    {
        date: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Calender'
        },
        time: {
            type: String,
            required: true
        },
        userInfo: {
            name: { type: String },
            email: { type: String },
            phone: { type: String },
            jobPosition: { type: String },
            nationality: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Country',
            }
        },
        status: {
            type: String,
            enum: ['approved', 'declined', 'pending'],
            default: 'pending'
        },
        section: {
            type: String,
                enum: ['clinic', 'radiology', 'lab']        
        },
        organ:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Organ'
        },
        questionnaire: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Questionnaire'
            },
            answer: { type: String },
            ticked:{type:Object}
        }],
        blocked: { type: Boolean, default: false },
        utcTime:{
            type:String,
            // required:true
        },
        insurance:{
            type:String,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Appointment', AppointmentSchema);


