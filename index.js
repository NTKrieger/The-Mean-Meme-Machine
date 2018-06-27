const Methods = require("./functions.js");

(async () => {
    Methods.generateText()
    Methods.setSearchTerm()
    Methods.cleanText()
    await Methods.generatePhotoData()
    Methods.setJimpParams()
    await Methods.writeOnPicture()
    Methods.tweet()
})()
   //TODO: rasterize some decent fonts and include them on a rotating basis
    //TODO: setJimpParams reads photoData and does smart things
    

    //todo: 