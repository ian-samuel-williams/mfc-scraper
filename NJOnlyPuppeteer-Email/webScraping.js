// This is where we do the actual scraping

// Importing environment variables
require("dotenv").config();

// Importing required packages
const axios = require('axios');
const mongoose = require('mongoose');
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

const connFunc = require('./connection');

// Getting the text representing each link in the "Announcements" page under "other"
async function getText(){

    // Connecting mongoose
    await connFunc();

    // Array storing alerts
    alertText = [];

    // Array storing notices
    noticeText = [];

    // The object that will be returned
    let dataObj = {};

    const url = "https://www.njconsumeraffairs.gov/mft";

    /* This is an asynchronous function meaning it returns a promise and runs in parallel with the problem */
    const getAlerts = async() => {

        /* starts a browser instance of puppeteer which simulates a chrome broser */
        chromium.setHeadlessMode = true;
        const browser = await puppeteer.launch({
            args: chromium.args,
            headless: chromium.headless,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath()

        });
            
        // opens page from browser
        const page = await browser.newPage();
            
        // redirects page to proper address
        await page.goto('https://www.njconsumeraffairs.gov/mft', {
            waitUntil: 'domcontentloaded'
        });
            
        await page.waitForSelector('.alert', {
            visible: true,
        });
        // We must evaluate this data instead of simply opening it up in a new browser
        const alertData = await page.evaluate(() => {
            
        // selecting all quotes from the data (this method gets all elements with the label "quote")
        const alertList = document.querySelectorAll("div > .alert");
            
        // if we have many elements, we'll want to convert them to be displayed as a list
        return Array.from(alertList).map((alert) => {
            
            // get text from each quote
            const text = alert.innerText;
            const dataArray = text.split('+');
            
            // Remove any newline characters from each element in the array
            const cleanedDataArray = dataArray.map(item => item.replace(/\n/g, ''));
            
            // Join the cleaned data back into a single string or process it as needed
            const cleanedData = cleanedDataArray.join('');
            // return each text and author to the array
            return cleanedData;
            });
        });


        const noticeData = await page.evaluate(() => {
            const noticeList = document.querySelectorAll('td.ms-rteTable-default');

            return Array.from(noticeList).map((notice) => {
                const noticeText = notice.innerText;
                const noticeArray = noticeText.split('+');

                const cleanedNoticeArray = noticeArray.map(item => item.replace(/\n/g, ''));

                const cleanedNoticeData = cleanedNoticeArray.join('');

                return cleanedNoticeData;
            })
        })
        // close the browser instance
        await browser.close();
        const data = {alertData, noticeData};
        return data; 
        };

    try {
        const alertsText = await getAlerts();
        // Adding the text and link arrays to the object
        dataObj = {
            alerts: alertsText.alertData,
            notices: alertsText.noticeData
        }
    }

    // Error handling
    catch(error){
        console.error(error);
    }

    
    return dataObj;
};


module.exports = getText;
