/*              This is the file that puts everything together
                All functions are invoked from here              */


// Importing webscraping and data comparison function
const webScraper = require("./webScraping");
const dataCompare = require("./resultAnalysis");

// This is for running the file locally:
/*webScraper().then(dataObj => {
    dataCompare(dataObj)
}).catch(console.error);
console.log("hello");
*/

// This is the function that is exported to lambda
exports.handler = async (event, context) => {
    try {
        const dataObj = await webScraper();
        await dataCompare(dataObj);
    } catch (error) {
        console.error(error);
    }
}
