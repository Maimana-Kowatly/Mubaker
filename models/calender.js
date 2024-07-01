const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const CalenderSchema = Schema(
    {
        date: {
            type: String,
            required: true
        },
        blocked: {
            type: Boolean
        },
        deleted: {
            type: Boolean,
            default: false
        },
        section: {
            type: String,
                enum: ['clinic', 'radiology', 'lab']        
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Calender', CalenderSchema);
