const Methods = require("./functions.js");

(async () => {
    Methods.generateText()
    Methods.setSearchTerm()
    await Methods.generatePhotoData()
    Methods.setJimpParams()
    Methods.writeOnPicture()
    Methods.tweet()
  })()