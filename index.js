const Methods = require("./functions.js");

async function main() {
    Methods.tweet() 
    Methods.generateText()
    Methods.setSearchTerm()
    Methods.cleanText()
    await Methods.generatePhotoData()
    Methods.writeOnPicture()  
}

setInterval(main,60000)


