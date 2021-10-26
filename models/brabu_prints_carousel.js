const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BrabuPrintCarouselSchema = new Schema({
	url: String,
	filename: String,
});

module.exports = mongoose.model("BrabuPrintCarousel", BrabuPrintCarouselSchema);
