// Importing environment variables
require("dotenv").config();

// Setting up mongoose to connect to database
const mongoose = require("mongoose");
//mongoose.connect(process.env.MONGOURI).catch(error => console.error(error));
const connFunc = require("./connection");


// Function for determining if there is a difference between old data and new data
async function diff(email, newText, newLinks, catchDifference) {

    // If there is a difference
    if (catchDifference) {

        // Send email
        emailData = await data();
        return await notifyUser(emailData, newText, newLinks);
    }

    // If there is not a difference
    else {
        console.log("File is equal to page")
    }
}


// Importing function which notifies users if update is found
const notifyUser = require('./email');
const data = require('./data');

async function dbUpdate(schemaData, IDdb, dbObj) {
    return await schemaData.findOneAndUpdate({_id:IDdb}, dbObj);
}

// Function for comparing data with data already saved in database
dataCompare = async dataObj => {
    await connFunc();
    // Importing schema for database
    const paSchema = require('./dataSchema');

    try {
    // Take data from database
    await paSchema.find({})
    .then(dataList => {
        // If there is no data in the database
        if (dataList == ""){
            console.log("New data object created");
            const newData = new paSchema(dataObj);
            return newData.save().catch(err => console.error(err));
        }
        
        // Extracting both the text and link array from dataObj
        const { text, link } = dataObj;

        // Finding the ID of the extracted data as well as specific texts and links
        const dbID = dataList[0]._id;
        const dbText = dataList[0].text;
        const dbLink = dataList[0].link;


        // Condition which tells whether data is different
        let catchDifference = false;
        
        // Creating arrays to store updated links and texts
        let newLinks = [];
        let newText = [];

        /* There are two options:
            1. Text and links are the same
                - This is handled by the condition of catchDifference being false
            2. New entry(s) added, meaning the rest of the list has shifted down
                - Search for first element in previous list, add all of the entries up until first element is found
                  to list
        */
    

        // Case 2

        if (JSON.stringify(dbText) != JSON.stringify(text)) {
            console.log("TEXT DIFFERENCE CAUGHT. Text length: ", text.length);
            console.log("New Data: ", text);
            console.log("Old Data: ", dbText);
            catchDifference = true;
            // For loop to compare each entry of new text against old text
            for (let i = 0; i < text.length; i++) {
                if (!dbText.includes(text[i])){
                    newText.push(text[i]);
                }
            }
                
            }

        if (JSON.stringify(dbLink) != JSON.stringify(link)) {
            console.log("LINK DIFFERENCE CAUGHT. Text length: ", link.length);
            console.log("New Data: ", link);
            console.log("Old Data: ", dbLink);
            catchDifference = true;
            // For loop to compare each entry of new text against old text
            for (let i = 0; i < link.length; i++) {
                if (!dbLink.includes(link[i])){
                    newLinks.push(link[i]);
                }
            }
                
            }

        
        return new Promise(async(resolve, reject)=> {
            await diff(data, newText, newLinks, catchDifference);
            if (catchDifference) {
                await dbUpdate(paSchema, dbID, dataObj);
            }
            resolve();    
        })
    })
        
        .then(() => {
        mongoose.disconnect();
    }).catch(err => console.error(err))

} catch(err) {
    console.error(err)
}
};


// Exporting the function
module.exports = dataCompare;