const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
	name: String,
	paragraph: String,
	imageBlog: {
		url: String,
		filename: String,
	},
});

module.exports = mongoose.model("Blog", BlogSchema);
