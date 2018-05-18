// use "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --disable-web-security --user-data-dir="C:\chrome"
// rita-full.js now accepts status code 0 for local files in .loadFrom() Line 671

(function () {
	$(document).ready(function() {
		//Unsplash API call	
		const Unsplash = {
			application_ID: "275f81d1fd86d9496a2bfccdf046677f1b6df0915b60c9058f9b4c521aae9223",
			secret: "75c4f0665e1d36c59ba4b03cecc6207212e1579777bc423e9300b29d9ec18038",
			callbackURL: "urn:ietf:wg:oauth:2.0:oob",
			authorize: "",
			public_URL: "https://api.unsplash.com/photos/random/?client_id="
		};

		//meme-generator sample api call
		const MG = {
			apiKey: "f838ea33-b1b3-4d2b-a1c8-ee772aaa3100",
			URL:  "http://version1.api.memegenerator.net"
		};
		//unsplash button
		$("#unsplash_button").click(function(){
			$.ajax
			({
				url:  Unsplash.public_URL + Unsplash.application_ID,
				type: "GET",
				success: function(data, status){
					alert("Data: " + data + "\nStatus: " + status);					
				}
			}); 	
		});
		//mg button
		$("#mg_button").click(function(){
			$.ajax
			({
				beforeSend: function(xhr){xhr.setRequestHeader('apiKey', MG.apiKey);},
				url: MG.URL,
				type: "GET",
				success: function(data, status){
					alert("Data: " + data + "\nStatus: " + status);					
				}
			}); 	
		});
		//text button
		$("#text_button").click( () => ( $("#test").text(Text.markovLunch.generateSentences(10))))
				
		
		let Text = {
			markovLunch : new RiMarkov(4, true, false),
		};
				
		Text.markovLunch.loadFrom("nakedlunch.txt");

	});
})();



