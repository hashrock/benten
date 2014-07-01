var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = new Schema({
	menu: String,
	user: String,
	date: Date,
	created: {
		type: Date,
		default: Date.now
	},
	price: Number
});

module.exports = mongoose.model('Order', OrderSchema);
