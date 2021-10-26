const express = require("express");
const path = require("path");
const router = express.Router();
const methodOverride = require("method-override");
const multer = require("multer");
const BrabuPrintCarousel = require("../models/brabu_prints_carousel");
const Client = require("../models/client");
const Blog = require("../models/blog");
const Team = require("../models/team");

// cloudinary
const { storage, cloudinary } = require("../cloudinary/index");
const upload = multer({ storage });

router.get("/", async (req, res) => {
	const carousels = await BrabuPrintCarousel.find({});
	const clients = await Client.find({});
	const blogs = await Blog.find({});
	const teams = await Team.find({});
	console.log(clients);
	res.render("index.ejs", { carousels, clients, blogs, teams });
});

router.get("/gallery", async (req, res) => {
	const clients = await Client.find({});
	res.render("gallery.ejs", { clients });
});
router.get("/blogs", async (req, res) => {
	const blogs = await Blog.find({});
	res.render("blogs.ejs", { blogs });
});

// carousel starts
router.get("/carousel", async (req, res) => {
	const carousels = await BrabuPrintCarousel.find({});
	res.render("brabu_prints/carousel", { carousels });
});

router.post("/carousel", upload.single("carouselImage"), async (req, res) => {
	const carousels = new BrabuPrintCarousel({
		url: req.file.path,
		filename: req.file.filename,
	});
	await carousels.save();
	res.redirect(`/carousel`);
});
router.get("/carousel/:id", async (req, res) => {
	const carousels = await BrabuPrintCarousel.findById(req.params.id);
	res.render("brabu_prints/carouseledit", { carousels });
});
router.delete("/carousel/:id", async (req, res) => {
	const { id } = req.params;
	const deleteCarouselImages = await BrabuPrintCarousel.findByIdAndDelete(id);
	cloudinary.uploader.destroy(deleteCarouselImages.filename);
	res.redirect("/carousel");
});

// carousel ends

// client starts

router.get("/client", async (req, res) => {
	const clients = await Client.find({});
	res.render("brabu_prints/client", { clients });
});
router.get("/client/new", (req, res) => {
	res.render("brabu_prints/new");
});
router.post("/client/new", (req, res) => {
	res.send("Worked");
});
router.get("/client/:id", async (req, res) => {
	const clients = await Client.findById(req.params.id);
	res.render("brabu_prints/showclient", { clients });
});

router.post(
	"/client",
	upload.fields([
		{ name: "posters", maxCount: 4 },
		{ name: "logo", maxCount: 4 },
	]),
	async (req, res) => {
		const clients = new Client(req.body.clients);
		const clientPoster = req.files["posters"].map((f) => ({
			url: f.path,
			filename: f.filename,
		}));
		clients.posters = clientPoster;
		clients.logo = req.files["logo"].map((f) => ({
			url: f.path,
			filename: f.filename,
		}));
		await clients.save();
		const carousel = await BrabuPrintCarousel.aggregate([
			{
				$project: { client: clients._id },
			},
		]);
		res.redirect(`/client/${clients._id}`);
	}
);

router.get("/client/:id/edit", async (req, res) => {
	const clients = await Client.findById(req.params.id);
	res.render("brabu_prints/edit", { clients });
});

router.put(
	"/client/:id",
	upload.fields([
		{ name: "posters", maxCount: 4 },
		{ name: "logo", maxCount: 4 },
	]),
	async (req, res) => {
		const { id, cloudinaryName } = req.params;
		if (req.files.posters) {
			await cloudinary.uploader.destroy("BrabuPrints/" + cloudinaryName);
			var clients = await Client.findByIdAndUpdate(id, {
				...req.body.clients,
				posters: req.files["posters"].map((f) => ({
					url: f.path,
					filename: f.filename,
				})),
				logo: req.files["logo"].map((f) => ({
					url: f.path,
					filename: f.filename,
				})),
			});
		} else {
			var clients = await Client.findByIdAndUpdate(id, {
				...req.body.clients,
			});
		}
		res.redirect(`/client/${clients._id}`);
	}
);
router.delete("/client/:id", async (req, res) => {
	const { id } = req.params;
	const deleteClientImages = await Client.findByIdAndDelete(id);
	deleteClientImages.posters.forEach((poster) => {
		cloudinary.uploader.destroy(poster.filename);
	});
	deleteClientImages.logo.forEach((l) => {
		cloudinary.uploader.destroy(l.filename);
	});
	res.redirect("/client");
});
// client ends

// blog start
router.get("/blog", async (req, res) => {
	const blogs = await Blog.find({});
	res.render("brabu_prints/blog", { blogs });
});
router.post("/blog", upload.single("imageBlog"), async (req, res) => {
	const blogs = new Blog(req.body.blogs);
	const imageBlogs = {
		url: req.file.path,
		filename: req.file.filename,
	};
	blogs.imageBlog = imageBlogs;
	await blogs.save();
	res.redirect("/blog");
});
router.get("/blog/:id", async (req, res) => {
	const blogs = await Blog.findById(req.params.id);
	res.render("brabu_prints/showBlog", { blogs });
});
router.get("/blog/:id/edit", async (req, res) => {
	const blogs = await Blog.findById(req.params.id);
	res.render("brabu_prints/editBlog", { blogs });
});
router.put(
	"/blog/:id/:cloudinaryName",
	upload.single("imageBlog"),
	async (req, res) => {
		const { id, cloudinaryName } = req.params;
		if (req.file) {
			await cloudinary.uploader.destroy("BrabuPrints/" + cloudinaryName);
			var blogs = await Blog.findByIdAndUpdate(id, {
				...req.body.blogs,
				imageBlog: { url: req.file.path, filename: req.file.filename },
			});
		} else {
			var blogs = await Blog.findByIdAndUpdate(id, {
				...req.body.blogs,
			});
		}
		res.redirect(`/blog/${blogs._id}`);
	}
);
router.delete("/blog/:id", async (req, res) => {
	const { id } = req.params;
	const deleteBlog = await Blog.findByIdAndDelete(id);
	await cloudinary.uploader.destroy(deleteBlog.imageBlog.filename);
	res.redirect("/blog");
});
// blog ends

// team start
router.get("/team", async (req, res) => {
	const teams = await Team.find({});
	res.render("brabu_prints/team", { teams });
});
router.post("/team", upload.single("imageTeam"), async (req, res) => {
	const teams = new Team(req.body.teams);
	const imageTeams = {
		url: req.file.path,
		filename: req.file.filename,
	};
	teams.imageTeam = imageTeams;
	await teams.save();
	res.redirect("/team");
});
router.get("/team/:id", async (req, res) => {
	const teams = await Team.findById(req.params.id);
	res.render("brabu_prints/showTeam", { teams });
});
router.get("/team/:id/edit", async (req, res) => {
	const teams = await Team.findById(req.params.id);
	res.render("brabu_prints/editTeam", { teams });
});
router.put(
	"/team/:id/:cloudinaryName",
	upload.single("imageTeam"),
	async (req, res) => {
		const { id, cloudinaryName } = req.params;
		if (req.file) {
			await cloudinary.uploader.destroy("BrabuPrints/" + cloudinaryName);
			var teams = await Team.findByIdAndUpdate(id, {
				...req.body.teams,
				imageTeam: { url: req.file.path, filename: req.file.filename },
			});
		} else {
			var teams = await Team.findByIdAndUpdate(id, {
				...req.body.teams,
			});
		}
		res.redirect(`/team/${teams._id}`);
	}
);
router.delete("/team/:id", async (req, res) => {
	const { id } = req.params;
	const deleteTeam = await Team.findByIdAndDelete(id);
	await cloudinary.uploader.destroy(deleteTeam.imageTeam.filename);
	res.redirect("/team");
});
// team ends

module.exports = router;
