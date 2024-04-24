// This is where we do the actual scraping

// Importing environment variables
require("dotenv").config();

// Importing required packages
const cheerio = require('cheerio');
const axios = require('axios');
const mongoose = require('mongoose');

// Using fs for finding local file
const fs = require('fs');

const dataSchema = require('./dataSchema')
const connFunc = require('./connection');

// Getting the text representing each link in the "Announcements" page under "other"
async function getText(){

    //Connection function
    await connFunc();

    console.log("scraping function");
    // Array storing text
    texts = [];

    // Array storing links
    links = [];

    // The object that will be returned
    let dataObj = {};

    // The url that will be scraped from
    const url = "https://www.dos.pa.gov/ProfessionalLicensing/BoardsCommissions/SocialWorkersMarriageanFamilyTherapistsandProfessionalCounselors/Pages/Announcements.aspx";

    try {

        // Getting access to the site
        const response = await axios.get(url);

        // Loading the site through cheerio
        const cheerioData = cheerio.load(response.data);


        // First extracting text beneath "Announcements"
        cheerioData('.ms-rteElement-H4 > a').each((index, element) => {

            // Selecting the text elements
            textEl = cheerioData(element).text();

            // Selecting the links behind the texts
            link = "https://www.dos.pa.gov" + cheerioData(element).attr('href');

            // Adding text and link to their separate arrays
            // --- The text is "trimmed" (excessive whitespace is removed) and \n's are removed as well
            texts.push(textEl.replace(/\s+/g, ' ').trim());
            links.push(link);

        });
        // Second extracting text beneath "other" and "Elder Abuse Prevention Guides"
        cheerioData('#ctl00_PlaceHolderMain_PageContent__ControlWrapper_RichHtmlField > p > a').each((index, element) => {

            // Selecting the text elements
            textEl = cheerioData(element).text();

            // Selecting the links behind the texts
            link = "https://www.dos.pa.gov" + cheerioData(element).attr('href');

            // Adding text and link to their separate arrays
            // --- The text is "trimmed" (excessive whitespace is removed) and \n's are removed as well
            texts.push(textEl.replace(/\s+/g, ' ').trim());
            links.push(link);
            
        });
    }

    // Error handling
    catch(error){
        console.error(error);
    }

    // Adding the text and link arrays to the object
    dataObj = {
        text: texts,
        link: links
    }
    console.log("end scraping function");
    return dataObj;
};

module.exports = getText;
