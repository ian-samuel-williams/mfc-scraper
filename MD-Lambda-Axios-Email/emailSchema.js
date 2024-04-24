// This is where we establish the mongoDB schema used to store data in
const mongoose = require("mongoose")

const emailSchema = new mongoose.Schema({
    emails: [String]
})

module.exports = mongoose.model("emailSchema", emailSchema)