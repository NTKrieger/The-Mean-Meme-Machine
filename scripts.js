// use C:\Program Files (x86)\Google\Chrome\Application\chrome.exe --disable-web-security --user-data-dir="C:\chrome"
// rita-full.js now accepts status code 0 for local files in .loadFrom() Line 671

(function () {
	$(document).ready(function() {
		
		//all constants by namespace		
		let Unsplash = {
			application_ID: "275f81d1fd86d9496a2bfccdf046677f1b6df0915b60c9058f9b4c521aae9223",
			token: 'e2b8461a399ab1bea1fa96b8744a3c622f621655e2ede44bbdc05b356ace2641',
			random_URL: "https://api.unsplash.com/photos/random/?client_id=",
			search_URL: "https://api.unsplash.com/search/photos/?query="
		};		
		
		let Text = {
			markovLunch: new RiMarkov(4, true, false),			
		};
		Text.markovLunch.loadFrom("nakedlunch.txt");
		
		let MG = {
			apiKey: "f838ea33-b1b3-4d2b-a1c8-ee772aaa3100",
			url:  "http://version1.api.memegenerator.net",
		};
		window.MgApi.SetApiKey(MG.apiKey);
		
		// returns URL of a random photo
		function getRandomPhotoUrl(){
			$.ajax
			({
				url:  Unsplash.random_URL + Unsplash.application_ID,
				type: "GET",
				success: function(data, status){
					Unsplash.imageURL = data.urls.raw;								
				}
			});
			return Unsplash.imageURL; 					
		}
		// returns URL of a photo returned from query
		function getTopicalPhotoUrl(search_term){
			$.ajax
			({
				beforeSend: function (xhr) {
					xhr.setRequestHeader ("Authorization", "Bearer " + Unsplash.token);
				},
				url:  Unsplash.search_URL + search_term,
				type: "GET",								
				success: function(data, status){
					if(data.total == 0){
						Unsplash.imageURL = getRandomPhotoUrl();
					}else{
						Unsplash.imageURL = data.results[0].urls.regular;
					}							
				}
			});
			return Unsplash.imageURL; 					
		}
			
		//loads a random image into a MemeGenerator template
		function createGenerator(imageURL){
			$.ajax
			({
				
				url: MG.url + "/Generator_Create",	
				type: "GET",
				image: "https://img-aws.ehowcdn.com/750x428p/cpi.studiod.com/www_ehow_com/i.ehow.com/images/a06/3a/be/study-compass-math-placement-test-800x800.jpg",
				apiKey: MG.apiKey,
				displayName: "naked lunch (remix)" + Date.now(),

				success: function(data, status){
					
					alert("Data: " + data + "\nStatus: " + status);					
				}
			}); 	
		}
		function testGenerator(){
			MG.wtf = window.MgApi.Generators_Search('frog', 0, 24); 
		}
		//creates the final captioned image
		function createInstance(){
			$.ajax
			({				
				url: MG.url + "//Instance_Create",
				type: "GET",
				generatorID: "",
				apiKey: MG.apiKey,
				text0: Text.markovLunch.getRandomSentence,
				success: function(data, status){
					
					alert("Data: " + data + "\nStatus: " + status);					
				}

			}); 	
		}
		//generates the sentence and then searches for the first singular or plural non-proper noun and uses it for an image search
		//now filters pronouns!  Maybe.

		$("#test_button").click(function(){
			
			Text.randomSentence = Text.markovLunch.generateSentence();
			Text.wordString = new RiString(Text.randomSentence);
			Text.posArray = Text.wordString.pos();
			for(i = 0; i < Text.posArray.length; ++i ){
				if(Text.posArray[i] != "pps" || Text.posArray[i] != "prp")
				{
					if(Text.posArray[i] == "nn" || Text.posArray[i] == "nns")
					{
						Unsplash.search_term = Text.wordString.wordAt(i);
						break;
					}
				}				
			}
			MG.photoURL = getTopicalPhotoUrl(Unsplash.search_term);
			createGenerator(MG.photoURL);
			testGenerator();
			console.log(MG.wtf);
		});				
	});
})();



