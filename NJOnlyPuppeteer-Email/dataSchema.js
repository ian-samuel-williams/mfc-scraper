const mongoose = require("mongoose")

const njDataSchema = new mongoose.Schema({
    alerts: [String],
    notices: [String]
})

module.exports = mongoose.model("njDataSchema", njDataSchema)