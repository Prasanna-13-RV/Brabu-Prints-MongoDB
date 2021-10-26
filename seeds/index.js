const mongoose = require('mongoose');
const Brabu = require("../models/brabu_prints");
const {clients} = require("./clients");
const clientsList = require("./clientsList");

mongoose.connect('mongodb://localhost:27017/brabu-print' , {
	useNewUrlParser: true,
	// useCreateIndex : true,
	useUnifiedTopology : true
});

const db = mongoose.connection;
db.on("error" , console.error.bind(console, "connection error:"));
db.once("open" , () => {
	console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async (req,res) => {
    await Brabu.deleteMany({});
	for(let i=0; i < 50; i++){
		const random25 = Math.floor(Math.random() * 22);
		const clientnew = new Brabu({
			name : `${clientsList[random25].name}` , 
			rating: `${clientsList[random25].rating}`,
			client : `${sample(clients)}`
		});
		await clientnew.save();
	}
}
seedDB().then(() => {
	mongoose.connection.close();
})