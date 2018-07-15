const Methods = require("./functions.js");

async function main() {
    Methods.postTweet() 
    Methods.loadText()
    Methods.generateText()
    Methods.setSearchTerm()
    Methods.cleanText()
    await Methods.generatePhotoData()
    Methods.setJimpParams()
    Methods.writeOnPicture()  
}
main()
setInterval(main, 5400000)
