const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: "BrabuPrints",
		allowedFormats: ["jpeg", "png", "jpg"],
	},
});

cloudinary.uploader.destroy('zombie', function(result) { console.log(result) });

module.exports = {
	cloudinary,
	storage,
};
