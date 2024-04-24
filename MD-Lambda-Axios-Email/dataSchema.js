// This is where we establish the mongoDB schema used to store data in
const mongoose = require("mongoose")

const MDdataSchema = new mongoose.Schema({
    notices: [String]
})

module.exports = mongoose.model("MDdataSchema", MDdataSchema)