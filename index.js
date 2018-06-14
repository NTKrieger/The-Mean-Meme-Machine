// dependencies
const Rita = require("rita")
const Jimp = require("jimp")
const Twit = require("twit")
const axios = require("axios")
const fs = require("fs")
// config files
const twitterConfig = require("./twitterConfig.js")
const ritaConfig = require("./ritaConfig")
const unsplashConfig = require("./unsplashConfig")
const photoData = require("./photoData.js")
// saved functions
const Methods = require("./functions.js")
// constructors
var MarkovLunch = Rita.RiMarkov(4, true, false)		
var Twitter = new Twit(twitterConfig)
// generate sentence and photo data
MarkovLunch.loadText(ritaConfig.text)
var sentence = MarkovLunch.generateSentence()
//TODO: grammar fixing function
Methods.getPhotoData(Methods.getSearchTerm(sentence))


//hardcoded for testing
photoData.url = "https://ii.yuki.la/4/8a/1bbbe70da815a76803ed0b424491f153542d24406f44e412338ddfd86a6a88a4.jpg"

//caption and save photograph
Methods.writeOnPicture(sentence, Jimp.FONT_SANS_128_BLACK, 10, 10)
Methods.writeOnPicture(sentence, Jimp.FONT_SANS_128_WHITE, 50, 50)




