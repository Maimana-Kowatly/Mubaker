const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema(
    {
        name:{
            type:String,
            required:true
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: false
        },
        role: {
            type: String,
            enum: ['doctor', 'admin','receptionist'],
            default: 'doctor'
        },
        code:{
            type:String
        },
        spec:{
            type:String,
            enum:['clinic','lab','radiology'].concat[null],
            
        },
        deleted: {
            type: Boolean,
            default: false
        },
        subscribers:[{
            type: String,
        }]
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', UserSchema);
