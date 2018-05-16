(function () {
	$(document).ready(function() {
		var OED = {};
			OED.app_id = "531adc43";
			OED.app_key = "70a2e33e0c7cd19daa75de7c0837bebe";
			OED.word_id = "get";
			OED.url = "https://od-api.oxforddictionaries.com/api/v1/entries/en/";
			OED.object = {};
				
		$("#oed_button").click(function(){
			$.ajax
			({
				beforeSend: function(xhr){xhr.setRequestHeader('app_id', OED.app_id);
										  xhr.setRequestHeader('app_key',OED.app_key);},
				url: OED.url + OED.word_id,
				type: "GET",
				success: function(data, status){
					alert("Data: " + data + "\nStatus: " + status);							
				}
			});
			
		});
			
		var Unsplash = {};
			Unsplash.application_ID = "275f81d1fd86d9496a2bfccdf046677f1b6df0915b60c9058f9b4c521aae9223";
			Unsplash.secret = "75c4f0665e1d36c59ba4b03cecc6207212e1579777bc423e9300b29d9ec18038";
			Unsplash.callbackURL = "urn:ietf:wg:oauth:2.0:oob";
			Unsplash.authorize = "";
			Unsplash.public_URL = "https://api.unsplash.com/photos/random/?client_id=";
		
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
		
		var MG = {};
			MG.apiKey = "f838ea33-b1b3-4d2b-a1c8-ee772aaa3100";
			MG.URL = "http://version1.api.memegenerator.net";
			
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
		
	});
})();