//dependencies
const Rita = require("rita")
const photoData = require("./photoData.js")
const twitterConfig = require("./twitterConfig.js")
const unsplashConfig = require("./unsplashConfig")
const axios = require("axios")
const fs = require("fs")
const Jimp = require("jimp")
const Twit = require("twit")

//TODO: Add API call to like photos I use on Unsplash

exports.getPhotoData = function(search_term){
    const config = {
        headers : {"Authorization" : "Bearer " + unsplashConfig.token}
    }
    axios.get("https://api.unsplash.com/search/photos/?query=" + search_term, config)
    .then(function(response){
        if (response.data.total == 0) {
            getRandomPhoto()
        }
        else {
            rI = Math.floor(Math.random() * response.data.results.length)
            photoData.url = response.data.results[rI].urls.regular
            photoData.height = response.data.results[rI].height
            photoData.width = response.data.results[rI].width
            photoData.width = response.data.results[rI].id
            photoData.photographer = response.data.results[rI].user.name
            photoData.photographerIG = response.data.results[rI].user.instagram_username
        }
    })
    .catch(function (error){
        console.log(error)
    })
}

exports.getRandomPhoto = function(){
    axios.get("https://api.unsplash.com/photos/random/?client_id=" + unsplashConfig.application_ID)
    .then(function (response){
        photoData.url = response.data.urls.raw
        photoData.height = response.data.height
        photoData.width = response.data.width
        photoData.width = response.data.id
        photoData.photographer = response.data.user.name
        photoData.photographerIG = response.data.user.instagram_username
    })
    .catch(function (error){
        console.log(error)
    })
}

exports.getSearchTerm = function(sentence){
    var wordString = Rita.RiString(sentence)
    var posArray = wordString.pos()
    for(i = 0; i < posArray.length; ++i ){
        if(posArray[i] != "pps" || posArray[i] != "prp")
        {
            if(posArray[i] == "nn" || posArray[i] == "nns")
            {
                return wordString.wordAt(i)
            }
        }				
    }
}

exports.writeOnPicture = function(sentence, font,  XSTART, YSTART,){
    var loadedImage
    Jimp.read(photoData.url)
        .then(function (image) {
            loadedImage = image
            return Jimp.loadFont(font)
        })
        .then(function (font) {
            loadedImage.print(font, XSTART, YSTART, sentence)
                       .write("./meme.png")
        })
        .catch(function (err) {
            console.error(err)
        })
}

exports.tweet = function(sentence){ //add IG link
    var b64content = fs.readFileSync("./meme.png", { encoding: 'base64' })
    Twitter.post('media/upload', { media_data: b64content }, function (err, data, response) {
        var mediaId = data.media_id_string
        var altText = sentence
        var meta_params = { media_id: mediaId, alt_text: { text: altText } }
        Twitter.post('media/metadata/create', meta_params, function (err, data, response) {
            if (!err) {
                var params = { status: "Photograph by: " + photoData.photographer, media_ids: [mediaId] }
                Twitter.post('statuses/update', params, function (err, data, response) {
                    console.log(data)
                })
            }
        }) 
    })
}