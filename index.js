const Methods = require("./functions.js");

(async () => {
    Methods.generateText()
    Methods.setSearchTerm()
    Methods.cleanText()
    //await Methods.generatePhotoData()
    //TODO: Include Params for wide photos/
    //TODO: setJimpParams reads photoData and does smart things
    //TODO: rasterize some decent fonts and include them on a rotating basis
    //Methods.setJimpParams()
    //Methods.writeOnPicture()
    //Methods.tweet()
})()