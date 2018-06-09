var config = require("./unsplashConfig");

exports.getTopicalPhotoUrl = function(search_term) {
    $.ajax 
    ({
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + config.token);
        },
        url: "https://api.unsplash.com/search/photos/?query=" + search_term,
        type: "GET",
        success: function (data, status) {
            if (data.total == 0) {
                Unsplash.imageURL = getRandomPhotoUrl();
            }
            else {
                Unsplash.imageURL = data.results[0].urls.regular;
            }
        }
    });
    return Unsplash.imageURL;
}
exports.getRandomPhotoUrl = function(){
    $.ajax
    ({
        url:   "https://api.unsplash.com/photos/random/?client_id=" + config.application_ID,
        type: "GET",
        success: function(data, status){
            Unsplash.imageURL = data.urls.raw;								
        }
    });
    return Unsplash.imageURL; 					
}
exports.getSearchTerm = function(sentence){
    var wordString = new RiString(sentence);
    var posArray = wordString.pos();
    for(i = 0; i < posArray.length; ++i ){
        if(posArray[i] != "pps" || posArray[i] != "prp")
        {
            if(posArray[i] == "nn" || posArray[i] == "nns")
            {
                return wordString.wordAt(i);
            }
        }				
    }
}
