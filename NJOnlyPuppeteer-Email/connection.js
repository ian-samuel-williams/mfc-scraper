// Function to connect to database
const mongoose = require("mongoose");
connFunc = async () => {
    try {
        const client = await mongoose.connect('mongodb+srv://mfc:ZEV5l2wK4u4HUYgx@mfcsites.uqloqtg.mongodb.net/?retryWrites=true&w=majority&appName=mfcSites');
        console.log("Connected!");
        return client;
    }
    catch (err) {
        console.error(err);
    }
}

module.exports = connFunc;