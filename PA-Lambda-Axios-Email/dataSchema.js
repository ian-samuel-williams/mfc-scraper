const mongoose = require("mongoose")

const paSchema = new mongoose.Schema({
    text : [String],
    link : [String]
})

module.exports = mongoose.model("paSchema", paSchema)
