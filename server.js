if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const express = require("express");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const BrabuPrint = require("./models/client");
const BrabuPrintCarousel = require("./models/brabu_prints_carousel");
const Blog = require("./models/blog");
const Team = require("./models/team");
const multer = require("multer");
const router = express.Router();
const brabuprintsRouter = require("./routes/route");
const compression = require("compression");

// cloudinary
const { storage } = require("./cloudinary");
const upload = multer({ storage });

mongoose.connect(process.env.MONGODB, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected");
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(compression());
// app.use(morgan("tiny"))

app.use(express.static(path.join(__dirname, "public")));


app.use("/" , brabuprintsRouter)

// app.all("*" , (req, res) => {
// 	res.send("404 Error Page!!!!!");
// });

app.listen(process.env.PORT, () =>
	console.log(`SERVER IS RUNNING ON PORT ${process.env.PORT}`)
);
