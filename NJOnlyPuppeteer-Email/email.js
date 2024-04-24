// importing nodemailer to automate emailing
const nodemailer = require("nodemailer");

const data = require('./data');

// Function for sending mail
mailSender = async (mailOption, transporter) => {
    return transporter.sendMail(mailOption).then( results =>  {
        console.log('email sent!')});
};
// function for emailing
const notifyUser = async (emailData, newTexts, newLinks) => {

    // Create transporter for sending mail
    const transporter = nodemailer.createTransport({
        service: emailData.service,
        auth: emailData.auth
    });

    // Configuring how mail is going to be sent and what the message will be
    const mailOptions = {
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject,
        text: `${emailData.text}:\n${newTexts}:\n${newLinks}`
    };

    // Send mail
    await mailSender(mailOptions, transporter);
};


module.exports = notifyUser;