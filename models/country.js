
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const CountrySchema = Schema(
    {
        name: {
			en:{type: String},
			ar:{type:String}
		},
		code: {
			type:String
		},
		dial_code: {
			type: String
		},
		deleted:{
			type: Boolean,
			default: false
		}
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Country', CountrySchema);
