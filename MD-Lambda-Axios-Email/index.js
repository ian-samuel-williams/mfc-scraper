/*              This is the file that puts everything together
                All functions are called from here              */


// Importing webscraping and data comparison function
const webScraper = require("./webScraping");
const dataCompare = require("./resultAnalysis");


// For running locally:
/*webScraper().then(dataObj => {
    dataCompare(dataObj)
}).catch(console.error);
console.log("hello");
*/

// Exported to Lambda
exports.handler = async (event, context) => {
    try {
        const dataObj = await webScraper();
        await dataCompare(dataObj);
    } catch (error) {
        console.error(error);
    }
}
