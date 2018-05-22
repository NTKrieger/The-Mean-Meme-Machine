// use C:\Program Files (x86)\Google\Chrome\Application\chrome.exe --disable-web-security --user-data-dir="C:\chrome"
// rita-full.js now accepts status code 0 for local files in .loadFrom() Line 671

(function () {
	$(document).ready(function() {
		
		//all constants by namespace		
		const Unsplash = {
			application_ID: "275f81d1fd86d9496a2bfccdf046677f1b6df0915b60c9058f9b4c521aae9223",
			secret: "75c4f0665e1d36c59ba4b03cecc6207212e1579777bc423e9300b29d9ec18038",
			callbackURL: "urn:ietf:wg:oauth:2.0:oob",
			public_URL: "https://api.unsplash.com/photos/random/?client_id=",
			imageURL: ""
		};		
		
		const Text = {
			markovLunch : new RiMarkov(4, true, false),
		};
		
		const MG = {
			apiKey: "f838ea33-b1b3-4d2b-a1c8-ee772aaa3100",
			url:  "http://version1.api.memegenerator.net",
		};

		Text.markovLunch.loadFrom("nakedlunch.txt");
		
		// returns URL of a random photo
		function getRandomPhotoUrl(){
			$.ajax
			({
				url:  Unsplash.public_URL + Unsplash.application_ID,
				type: "GET",
				success: function(data, status){
					return data.urls.raw;								
				}
			}); 
					
		}

		//returns a randomly generated sentence using markov chains derived from Naked Lunch
		function getRandomSentence(){
			return Text.markovLunch.generateSentences(1);
		} 
		
		//loads a random image into a MemeGenerator template
		function createGenerator(){
			$.ajax
			({
				//beforeSend: function(xhr){xhr.setRequestHeader('apiKey', MG.apiKey)},
				url: MG.url + "//Generator_Create",
				apiKey: MG.apiKey,
				type: "GET",
				image: getRandomPhotoUrl(),
				displayName: "naked lunch (remix)" + Date.now(),

				success: function(data, status){
					
					alert("Data: " + data + "\nStatus: " + status);					
				}
			}); 	
		}
		//creates the final captioned image
		function createInstance(){
			$.ajax
			({
				//beforeSend: function(xhr){xhr.setRequestHeader('apiKey', MG.apiKey)},
				url: MG.url + "//Instance_Create",
				apiKey: MG.apiKey,
				type: "GET",
				imageID: getRandomPhotoUrl(),
				text0: getRandomSentence(),
				success: function(data, status){
					
					alert("Data: " + data + "\nStatus: " + status);					
				}

			}); 	
		}

		$("#test_button").click(function(){
			//createGenerator();
			$("#test").text(getRandomPhotoUrl());
		});				
	});
})();



