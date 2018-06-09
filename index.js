//dependencies
var Rita = require("rita")
var Jimp = require("jimp")
var Twit = require("twit")
var unsplashConfig = require("./unsplashConfig.js")
var twitterConfig = require("./twitterConfig.js")
var Methods = require("./functions.js")
//constructors
var MarkovLunch = new RiMarkov(4, true, false)		
var Twitter = new twit(twitterConfig)
//generate sentence and photoURL
MarkovLunch.loadFrom("nakedlunch.txt")
var sentence = MarkovLunch.generateSentence()
var photoURL = getTopicalPhotoUrl(getSearchTerm(sentence))
//caption and save photograph
var loadedImage
Jimp.read(photoURL)
    .then(function (image) {
        loadedImage = image
        return Jimp.loadFont(Jimp.FONT_SANS_16_BLACK)
    })
    .then(function (font) {
        loadedImage.print(font, 10, 10, sentence)
                   .write("./meme.png")
    })
    .catch(function (err) {
        console.error(err)
    })
//upload photograph to Twitter
var b64content = fs.readFileSync("./meme.png", { encoding: 'base64' })
Twitter.post('media/upload', { media_data: b64content }, function (err, data, response) {
    var mediaId = data.media_id_string
    var altText = sentence
    var meta_params = { media_id: mediaId, alt_text: { text: altText } }
    //set metadata
    Twitter.post('media/metadata/create', meta_params, function (err, data, response) {
      if (!err) {
        //post Tweet to timeline
        var params = { status: sentence, media_ids: [mediaId] }
        Twitter.post('statuses/update', params, function (err, data, response) {
          console.log(data)
        })
      }
    })
  })