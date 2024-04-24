// This is where we compare scraped results to results stored in the database

// Importing environment variables
require("dotenv").config();

// Setting up mongoose to connect to database
const mongoose = require("mongoose");

// Importing function which notifies users if update is found
const notifyUser = require('./email');
const data = require('./data');
const connFunc = require('./connection');



// Function for determining if there is a difference between old data and new data
async function diff(email, newText, catchDifference) {

    // If there is a difference
    if (catchDifference) {
        

        // Send email
        emailData = await data();
        return await notifyUser(emailData, newText)
    }

    // If there is not a difference
    else {
        console.log("File is equal to page")
    }
}

async function dbUpdate(schemaData, IDdb, dbObj) {
    return await schemaData.findOneAndUpdate({_id:IDdb}, dbObj);
}

// Function for comparing data with data already saved in database
dataCompare = async dataObj => {
    await connFunc();
    // Importing schema for database
    const MDdataSchema = require('./dataSchema');

    try {
    // Take data from database
    await MDdataSchema.find({})
    .then(dataList => {
        // If there is no data in the database
        if (dataList == ""){
            console.log("New data object created");
            const newData = new MDdataSchema(dataObj);
            return newData.save().catch(err => console.error(err));
        }
        
        // Extracting the notice array from dataObj
        const { notices } = dataObj;

        // Finding the ID of the extracted data (for updating later) as well as the notices
        const dbID = dataList[0]._id;
        const dbNotices = dataList[0].notices;


        // Condition which tells whether data is different
        let catchDifference = false;
        
        // Creating array to store updated notices
        let newNotices = [];

        /* There are two options:
            1. Notices are the same
                - This is handled by the condition of catchDifference being false
            2. New entry(s) added
                - Search each item in new notice array, and if it isn't present in the database, add it to a "newNotices" array
        */
    

        // Case 2

        // If notices were added:
        if (JSON.stringify(dbNotices) != JSON.stringify(notices)) {
            console.log("DIFFERENCE CAUGHT. Text length: ", notices.length);
            console.log("New Data: ", notices);
            console.log("Old Data: ", dbNotices);
            catchDifference = true;
            // For loop to compare each entry of new text against old text
            for (let i = 0; i < notices.length; i++) {
                if (!dbNotices.includes(notices[i])){
                    newNotices.push(notices[i]);
                }
            }
                
            }
         
        
        // If a difference is caught
        return new Promise(async(resolve, reject)=> {
            await diff(data, newNotices, catchDifference);
            if (catchDifference) {
                await dbUpdate(MDdataSchema, dbID, dataObj);
            }
            
            resolve();    
        })
    }).then(() => {
        mongoose.disconnect();
    }).catch(err => console.error(err))

} catch(err) {
    console.error(err)
}
};


// Exporting the function
module.exports = dataCompare;