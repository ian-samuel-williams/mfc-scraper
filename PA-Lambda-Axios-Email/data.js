// Importing environment variables
require('dotenv').config();

const connFunc = require("./connection");

// connect to database to retrieve list of emails
const retrieveEmails1 = async dataObj => {
    await connFunc();
    const emailSchema = require('./emailSchema');
    
    try {
        const emailList = await emailSchema.find({});
        
        if (emailList.length === 0) {
            console.log("New email data object created");
            const newData = new emailSchema(dataObj);
            await newData.save();
            return newData;
        }
        
        return emailList[0].emails;
    }
    catch (err) {
        console.error(err);
    }
}


// Setting up sending of email
/*const email = {
    // emailing through gmail
    service: process.env.SERVICE,
    // authenticating username and password for email
    auth: {
        user: process.env.USEREMAIL,
        pass: process.env.PASSWORDEMAIL
    },

    // where email is sent from and to
    from: process.env.USEREMAIL,
    to: retrieveEmails1(),
    subject: "Testing new emails",
    text: "Check it out on the website"
};
*/
emailData = async () => {
    const toEmails = await retrieveEmails1();
    
    return {
         // emailing through gmail
    service: process.env.SERVICE,
    // authenticating username and password for email
    auth: {
        user: process.env.USEREMAIL,
        pass: process.env.PASSWORDEMAIL
    },

    // where email is sent from and to
    from: process.env.USEREMAIL,
    to: toEmails,
    subject: "New information on the Pennsylvania Website!",
    text: 'Check it out on the website: '
    }
};

//emailData().then(console.log)

module.exports = emailData;