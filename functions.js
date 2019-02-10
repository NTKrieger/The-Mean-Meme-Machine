// dependencies
const Rita = require("rita")
const Jimp = require("jimp")
const Twit = require("twit")
const axios = require("axios")
const fs = require("fs")
const tumblr = require("tumblr.js")
// config files
const twitterConfig = require("./config/twitterConfig.js")
const ritaConfig = require("./config/ritaConfig")
const unsplashConfig = require("./config/unsplashConfig")
const tumblrConfig = require("./config/tumblrConfig")
// data files
let photoData = require("./photoData.js")

loadText =()=>{
    photoData.markovLunch = Rita.RiMarkov(4, true, false)	
    photoData.markovLunch.loadText(ritaConfig.text) 
}
exports.loadText = loadText

generateText =()=>{
    photoData.text = photoData.markovLunch.generateSentence()
}
exports.generateText = generateText

generatePhotoData = async()=>{
    const config = {
        headers : {"Authorization" : "Bearer " + unsplashConfig.token}
    }
    try {
        let response = await axios.get("https://api.unsplash.com/search/photos/?query=" + photoData.searchTerm, config)
        if (response.data.total == 0) {
            await getRandomPhoto()
        }
        else {
          var rI = Math.floor(Math.random() * response.data.results.length)
          for(var i=0; i < response.data.results.length; ++i){
              if(response.data.results[rI % 10].height > response.data.results[rI % 10].width)
                rI++ 
              else
                break    
          }
          photoData.height = response.data.results[rI % 10].height
          photoData.width = response.data.results[rI % 10].width
          photoData.url = response.data.results[rI % 10].urls.regular
          photoData.photographer = response.data.results[rI % 10].user.name
        }
      }
    catch (error){
          console.log(error)
      }
  }
exports.generatePhotoData = generatePhotoData

getRandomPhoto = async()=>{
    try{
        let response = await axios.get("https://api.unsplash.com/photos/random/?client_id=" + unsplashConfig.application_ID)
        if(response.data.results[rI % 10].height > response.data.results[rI % 10].width){
            await getRandomPhoto()
        }else{
            photoData.height = response.data.height
            photoData.width = response.data.width
            photoData.url = response.data.urls.raw
            photoData.photographer = response.data.user.name  
        } 
    }
    catch (error){
        console.log(error)
    }
}
exports.getRandomPhoto = getRandomPhoto

setSearchTerm =()=>{
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
}
exports.setSearchTerm = setSearchTerm

cleanText =()=>{
    var sentence = Rita.RiString(photoData.text)
    var wordArray = sentence.words()
    var posArray = sentence.pos()
    
    if (sentence.length > 100){
        Methods.generateText()
        Methods.setSearchTerm()
        Methods.cleanText()
    }

    console.log("cleanText in: " + photoData.text)

    //truncate sentences with commas or semi-colons
    for(i = 0; i < sentence.length(); ++i){
        if(sentence.charAt(i) == `,` || sentence.charAt(i) == `;`){
            if(sentence.charAt(i) == `;`){
                sentence.replaceChar(i ,`.`)
                sentence = Rita.RiString(sentence.slice(0, i+1))
            } else {
                //TODO: deal with commas seperately here.
            }
            break
        }
    }
    //if sentence ends with a space in the elipses, remove the space.
    if(sentence.charAt(sentence.length()-1) == sentence.charAt(sentence.length()-2))
        sentence.removeChar(sentence.length()-3)

    //check for appropriate punctuation
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
    //remove numerals, complete quotations, check for incomplete parentheticals, and convert from RiString to string
    var quoteMarks = 0
    var parentheses = 0
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
        if(sentence.charAt(i) == `(` || sentence.charAt(i) == `)`){
            ++ parentheses
            var parIndex = i   
        }       
    } 
    if(parentheses == 1)
        sentence.removeChar(parIndex)
    if(quoteMarks == 1){
        sentence = sentence.text()
        sentence += `"`
    } else {
        sentence = sentence.text()
    }
    photoData.text = sentence
    console.log("cleanText out: " + photoData.text)
}
exports.cleanText = cleanText

setResizeHeight = ()=> {
    var ratio = photoData.resizeWidth / photoData.width
    photoData.resizeHeight = Math.round(photoData.height * ratio)
}
exports.setResizeHeight = setResizeHeight

setJimpParams = ()=>{  
    if(photoData.text.length < 25)
        if(Math.random() > .5){
            photoData.resizeWidth = 1080
            photoData.ystart = 25
        }else{
            photoData.resizeWidth = 1080 
            setResizeHeight()
            photoData.ystart = (photoData.resizeHeight - 100)
        }
    if(photoData.text.length > 25 && photoData.text.length <= 50)
        if(Math.random() > .5){
            photoData.resizeWidth = 1080
            photoData.ystart = 25
        }else{
            photoData.resizeWidth = 1080
            setResizeHeight()
            photoData.ystart = (photoData.resizeHeight - 200)
    }
    if(photoData.text.length > 50 && photoData.text.length <= 75)
        if(Math.random() > .5){
            photoData.resizeWidth = 1600
            photoData.ystart = 25
        }else{
            photoData.resizeWidth = 1600
            setResizeHeight()
            photoData.ystart = (photoData.resizeHeight - 200)
    }
    if(photoData.text.length > 75)
        if(Math.random() > .5){
            photoData.ystart = 25
            photoData.resizeWidth = 1600
        }else{
            photoData.resizeWidth = 1600
            setResizeHeight()
            photoData.ystart = (photoData.resizeHeight - 300)
    }
    photoData.xwrap = photoData.resizeWidth - 25
    console.log(photoData.ystart)
}
exports.setJimpParams = setJimpParams

writeOnPicture =()=>{
    var loadedImage
    Jimp.read(photoData.url)
        .then(function (image) {
            loadedImage = image
            return Jimp.loadFont(photoData.font)
        })
        .then(function (font) {
            loadedImage.resize(photoData.resizeWidth, Jimp.AUTO)
                       .print(font, photoData.xstart, photoData.ystart, photoData.text, photoData.xwrap)
                       .write("./meme.png")
        })
        .catch(function (err) {
            console.error(err)
        })
}
exports.writeOnPicture = writeOnPicture

postTweet =()=>{
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
            } else
                console.log(err)
        })
    }) 
}
exports.postTweet = postTweet

postTumblr =()=>{
    var client = tumblr.createClient(
        {
          consumerKey: tumblrConfig.consumerKey,
          consumerSecret: tumblrConfig.consumerSecret,
          accessToken: tumblrConfig.accessToken,
          accessSecret: tumblrConfig.accessSecret,
        }
    )
    var b64content = fs.readFileSync("./meme.png", { encoding: 'base64' })
    var params = {
        caption: "Photograph by: " + photoData.photographer,
        width: photoData.resizeWidth,
        height: photoData.resizeHeight,
        data:  b64content,
    }
    client.createPhotoPost(tumblrConfig.blogName, params, function(err, json){
        if(!err)
            console.log(json)
        else
            console.log(err)
    })
}
exports.postTumblr = postTumblr
//tumblr functionality not used