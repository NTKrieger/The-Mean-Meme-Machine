// dependencies
const Rita = require("rita")
const Jimp = require("jimp")
const Twit = require("twit")
const axios = require("axios")
const fs = require("fs")
// config files
const twitterConfig = require("./config/twitterConfig.js")
const ritaConfig = require("./config/ritaConfig")
const unsplashConfig = require("./config/unsplashConfig")
// data files
let photoData = require("./photoData.js")
const testData = require("./testData.js")

//TODO: Add API call to like photos I use on Unsplash

generateText = function(){
    var MarkovLunch = Rita.RiMarkov(4, true, false)	
    MarkovLunch.loadText(ritaConfig.text)
    photoData.text = MarkovLunch.generateSentence()
    console.log("generateText done")
}
exports.generateText = generateText

exports.generatePhotoData = async function(){
    const config = {
        headers : {"Authorization" : "Bearer " + unsplashConfig.token}
    }
    try {
        let response = await axios.get("https://api.unsplash.com/search/photos/?query=" + photoData.searchTerm, config)
        if (response.data.total == 0) {
            await getRandomPhoto()
        }
        else {
          rI = Math.floor(Math.random() * response.data.results.length)
          photoData.url = response.data.results[rI].urls.regular
          photoData.height = response.data.results[rI].height
          photoData.width = response.data.results[rI].width
          photoData.id = response.data.results[rI].id
          photoData.photographer = response.data.results[rI].user.name
          photoData.photographerIG = response.data.results[rI].user.instagram_username
        }
      }
    catch (error){
          console.log(error)
      }
    console.log("generatePhotoData done")
  }

getRandomPhoto = async function(){
    try{
        let response = await axios.get("https://api.unsplash.com/photos/random/?client_id=" + unsplashConfig.application_ID)
        photoData.url = response.data.urls.raw
        photoData.height = response.data.height
        photoData.width = response.data.width
        photoData.width = response.data.id
        photoData.photographer = response.data.user.name
        photoData.photographerIG = response.data.user.instagram_username    
    }
    catch (error){
        console.log(error)
    }
    console.log("getRandomPhoto done")
}
exports.getRandomPhoto = getRandomPhoto


setSearchTerm = function(){
    var wordString = Rita.RiString(photoData.text)
    var posArray = wordString.pos()
    for(i = 0; i < posArray.length; ++i ){
        if(posArray[i] != "pps" || posArray[i] != "prp")
        {
            if(posArray[i] == "nn" || posArray[i] == "nns")
            {
                photoData.searchTerm = wordString.wordAt(i)
            }
        }				
    }
    console.log("setSearchTerm done")
}
exports.setSearchTerm = setSearchTerm

cleanText = function(){
    console.log("CleanText in: " + photoData.text)
    var sentence = Rita.RiString(photoData.text)
    var wordArray = sentence.words()
    var posArray = sentence.pos()
    //set maximum character limit
    if(sentence.length() > photoData.maxChar){
        generateText()
        setSearchTerm()
        cleanText()
    }
    

    //if sentence ends with a space in the elipses, remove the space.
    if(sentence.charAt(sentence.length()-1) == sentence.charAt(sentence.length()-2))
        sentence.removeChar(sentence.length()-3)
    
    //check for appropriate punctuation
    var wordArray = sentence.words()
    var posArray = sentence.pos()

    if( wordArray[0] == "Who"  ||
        wordArray[0] == "What" ||
        wordArray[0] == "Where"||
        wordArray[0] == "When" ||
        wordArray[0] == "Why"  ||
        wordArray[0] == "How"  ||
        wordArray[0] == "Which"||
        wordArray[0] == "Who"  ||
        wordArray[0] == "Whose"||
        wordArray[0] == "Whom" ){
        if(sentence.charAt(sentence.length()-1) == `.`)
            sentence.replaceChar((sentence.length()-1),`?`)
    }else if((posArray[1] == "prp" || posArray[1] == "prp$") && posArray[0] == "md"){
        if(sentence.charAt(sentence.length()-1) == `.`)
            sentence.replaceChar((sentence.length()-1),`?`)
    }else if(sentence.charAt(sentence.length()-1) == `?`){
        sentence.replaceChar((sentence.length()-1),`.`)
    }

    //remove numerals and complete quotations
    var quoteMarks = 0
    for(i = 0; i < sentence.length(); ++i){
        if(sentence.charAt(i) == "0" ||
           sentence.charAt(i) == "1" ||
           sentence.charAt(i) == "2" ||
           sentence.charAt(i) == "3" ||
           sentence.charAt(i) == "4" ||
           sentence.charAt(i) == "5" ||
           sentence.charAt(i) == "6" ||
           sentence.charAt(i) == "7" ||
           sentence.charAt(i) == "8" ||
           sentence.charAt(i) == "9" ){            
             
            sentence.removeChar(i)
             --i
           }
        if(sentence.charAt(i) == `"`)
            ++ quoteMarks   
    } 
    if(quoteMarks == 1){
        sentence = sentence.text()
        sentence += `"`
    } else {
        sentence = sentence.text()
    }

    photoData.text = sentence
    console.log("cleanText out: " + photoData.text)
    console.log("cleanText done")
}
exports.cleanText = cleanText

exports.setJimpParams = function(){
    photoData.font = Jimp.FONT_SANS_64_WHITE
    photoData.xstart = 10
    photoData.xwrap = photoData.width - 10
    photoData.ystart = (photoData.height / 2) + 100
    console.log("setJimpParams done") 
}

exports.writeOnPicture = function(){
    var loadedImage
    Jimp.read(photoData.url)
        .then(function (image) {
            loadedImage = image
            return Jimp.loadFont(photoData.font)
        })
        .then(function (font) {
            loadedImage.print(font, photoData.xstart, photoData.ystart, photoData.text)
                       .write("./meme.png")
        })
        .catch(function (err) {
            console.error(err)
        })
        console.log("writeOnPicture done")
}

exports.loadTestData = function(){
    photoData.font=testData.font,
    photoData.height=testData.height,
    photoData.photographer=testData.photographer,
    photoData.photographerIG=testData.photographer,
    photoData.photoID=testData.photoID,
    photoData.searchTerm=testData.searchTerm,
    photoData.text=testData.text,
    photoData.url=testData.url,
    photoData.width=testData.width,
    photoData.xstart=testData.xstart
    photoData.ystart=testData.ystart
    photoData.xwrap=testData.xwrap
    console.log("loadTestData done")
}

exports.tweet = function(){
    var Twitter = new Twit(twitterConfig)
    var b64content = fs.readFileSync("./meme.png", { encoding: 'base64' })
    var photoCredit =  "Photographer: " + photoData.photographer
    Twitter.post('media/upload', { media_data: b64content }, function (err, data, response) {
        var mediaId = data.media_id_string
        var altText = photoData.text
        var meta_params = { media_id: mediaId, alt_text: { text: altText } }
        Twitter.post('media/metadata/create', meta_params, function (err, data, response) {
            if (!err) {
                var params = { status: photoCredit, media_ids: [mediaId] }
                Twitter.post('statuses/update', params, function (err, data, response) {
                    console.log(data)
                })
            }
        }) 
    })
}