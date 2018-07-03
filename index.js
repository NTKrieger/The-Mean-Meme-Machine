const Methods = require("./functions.js");

async function main() {
    Methods.postTumblr()
    Methods.postTweet() 
    Methods.generateText()
    Methods.setSearchTerm()
    Methods.cleanText()
    await Methods.generatePhotoData()
    Methods.setJimpParams()
    Methods.writeOnPicture()  
}
//setInterval(main,60000)

Methods.postTumblr()