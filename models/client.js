const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientSchema = new Schema({
    name: String,
    rating : Number,
    posters: [
        {
            url: String,
            filename: String
        }
    ],
    logo: [
        {
            url: String,
            filename: String
        }
    ],
});

module.exports = mongoose.model("Client" , ClientSchema);