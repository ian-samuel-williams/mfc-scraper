// This is where we do the actual scraping

// Importing environment variables
require("dotenv").config();

// Importing required packages
const cheerio = require('cheerio');
const axios = require('axios');
const mongoose = require('mongoose');

// Importing data schema
const MDdataSchema = require('./dataSchema')

const connFunc = require('./connection');
// Connecting mongoose
//await mongoose.connect('mongodb+srv://guest:guest@nodetutorial.cpzeive.mongodb.net/?retryWrites=true&w=majority').catch(error => console.error(error));

// Getting the announcements under "Board News", besides contact information
async function getText(){
    await connFunc();
    // Array storing notices
    noticeText = [];

    // The object that will be returned
    let dataObj = {};

    try {

        const url = "https://health.maryland.gov/bopc/Pages/Index.aspx";
        const response = await axios.get(url);
        
        const cheerioData = cheerio.load(response.data);

        // Extracting text beneath "Board News info"
        cheerioData('.content').each((index, element) => {


            // Selecting the text elements
            noticeEl = cheerioData(element).text();

            // --- The text is "trimmed" (excessive whitespace is removed) and \n's are removed as well
            noticeText.push(noticeEl.replace(/\s+/g, ' ').trim());
            
        });
    }

    // Error handling
    catch(error){
        console.error(error);
    }

    // Adding the text array to the object
    dataObj = {
        notices: noticeText
    }
    return dataObj;
};

//getText();
module.exports = getText;
