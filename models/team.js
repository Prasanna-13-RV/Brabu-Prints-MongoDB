const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
	name: String,
	job: String,
	imageTeam: {
		url: String,
		filename: String,
	},
});

module.exports = mongoose.model("Team", TeamSchema);
