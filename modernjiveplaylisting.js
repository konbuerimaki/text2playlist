// After the API loads, call a function to get the uploads playlist ID.
function handleAPILoadedSearch() {

	// After the API loads, call a function to enable the search box.
	
	$('#checkPlayList-button').attr('disabled', false);
	$('#playlist-button').attr('disabled', false);
	$('#searchsong-button').attr('disabled', false);
	$('#addPlayList-button').attr('disabled', false);
	$('#deleteall-button').attr('disabled', false);
	//$('#search-button').attr('disabled', false);
	
}


var _URL = "http://sirokurocya.sakura.ne.jp/development/modernjivescript/PlaylistDemo.txt";
var _playlist_id = "PLsOsWUE7opcDL7XfJjEKZrqaPnEOpWbVs";

var _ArraySongs = [];
var _ArrVideoId = []; 
var errCount = 0;
var _AddedVideoId = []; 

(function($){
	
	$(document).ready(function($){
		
		var evtRow = "<div>datetime: " + moment().add(9, "h").toISOString() + "</div>";
		$(".post-auth").empty().append(evtRow);
		
		$("#playlist-button").click(function(e){
			
			$(".textplaylistname").empty().append("(selected text file...)");
			$(".youtubeplaylistname").empty().append("(selected youtube playlist...)");
			
			$(".root").empty();
			$(".status").empty();
			$(".check").empty();
			$(".result").empty();
			
			$.ajax({
				
				url: _URL,
				async: false,
				dataType: "text",
				success: function(data){
					
					_ArraySongs = data.split("\n");
					
					var song = "";
					var idx = 0;
					var counter = 0;
					
					for(var i = 0; i < _ArraySongs.length; i++) {
						
						song = _ArraySongs[i].trim();
						idx = song.lastIndexOf(" ");
						
						if (idx > 0) {
							
							song = song.substring(0, idx - 1);
							$(".root").append(song + "<br/>");
							
						} 
						else {
							
							$(".root").append("N/A<br/>");
							
						}
						
						counter = counter + 1;
						
					}
					
					$(".root").append(counter + "<br/>");
					
				}
				
			});
			

			var requestOptions;
			
			requestOptions = {
				id: _playlist_id,
				part: 'snippet'
			};
			
			var request = gapi.client.youtube.playlists.list(requestOptions);
			
			request.execute(function(response) {
				
				var playlistItself = response.result.items;
				
				if (playlistItself) {
					
					_AddedVideoId = [];
					
					$.each(playlistItself, function(index, item) {
						$('.textplaylistname').empty().append("[data source text] <span style='font-weight:bold;'>" + _URL + "</span>");
						$('.youtubeplaylistname').empty().append("[target youtube playlist name] <span style='font-weight:bold;'>" + item.snippet.title + "</span>");
					});
					
				} else {
					$('.error').append('Sorry you have no item -> ' + vid + "<br/>");
				}
				
			});
			
		});
		
		$("#searchsong-button").click(function(e){
			
			$(".result").empty();
			
			var song = "";
			var idx = 0;
			var jsonObj;
			var videoId;
			
			var counter = 0;
			
			for(var i = 0; i < _ArraySongs.length; i++) {
				
				song = _ArraySongs[i].trim();
				idx = song.lastIndexOf(" ");
				
				if (idx > 0) {
					
					song = song.substring(0, idx - 1);
					
					var request = gapi.client.youtube.search.list({
						q: song,
						part: 'snippet'
					});
					
					request.execute(function(response) {
						
						jsonObj = response.result;
						videoId = jsonObj.items[0].id.videoId;
						
						_ArrVideoId.push(videoId);
						
						$(".result").append("<span style='font-weight:bold;'>" + jsonObj.items[0].snippet.title + "</span><br/>");
						$(".result").append(videoId + "<br/>");
						$(".result").append("<img src=" + jsonObj.items[0].snippet.thumbnails.default.url + "></img>" + "<br/><br/>");
						
					});
					
				} 
				else {
					
					$(".result").append("N/A<br/>");
					
				}

				counter = counter + 1;

			}
			
			$(".result").append(counter + "<br/>");
		});
		
		$("#addPlayList-button").click(function(e){
			
			if (errCount >= _ArrVideoId.length) {
				alert("all item added.");
			}
			else {
				AddSongPlaylist(_ArrVideoId, _playlist_id);
			}
		});
		
		function AddSongPlaylist(arrVideoId, playlist_id) {
			
			/*
			var counter = 0;
			
			for (var i = 0; i < arrVideoId.length; i++) {
				
				if (arrVideoId[i] == 0) {
				} 
				else {
					AddSong(arrVideoId[i], playlist_id);
					counter = counter + 1;
				}
			}
			*/
			
			
			AddSong(arrVideoId[errCount], playlist_id);
			errCount = errCount + 1;
			currentPlayList(playlist_id);
			
		}
		
		function AddSong(addingVideoId, addingPlaylist_id) {
			
			var details = {
				videoId: addingVideoId,
				kind: 'youtube#video'
			}
			
			var request = gapi.client.youtube.playlistItems.insert({
				part: 'snippet',
				resource: {
					snippet: {
						playlistId: addingPlaylist_id,
						resourceId: details
					}
				}
			});
			
			try {
				
				request.execute(function(response) {
					
					jsonObj = response.result;
					
					$(".status").empty().append(errCount + "<br/>");
					$(".status").append("<span style='font-weight:bold;'>" + jsonObj.snippet.title + "</span><br/>");
					//$(".status").append("<img src=" + jsonObj.snippet.thumbnails.high.url + "></img>" + "<br/><br/>");
					
				});
			
			} catch(e) {
				//$('.error').append("[" + moment().add(9, "h").toISOString() + "] " + e.name + " " + e.message + "<br/>");
			}
			
		}
		
		$("#checkPlayList-button").click(function(e){
			
			currentPlayList();
			//checkAddedSong();
			
		});
		
		function checkAddedSong() {
			
			var requestOptions;
			var request;
			var playlistItems;
			
			$.each(_ArrVideoId, function(indexJ, itemY) {
				
				requestOptions = {
					playlistId: _playlist_id,
					part: 'snippet',
					videoId: _ArrVideoId[indexJ]
				};
				
				request = gapi.client.youtube.playlistItems.list(requestOptions);
				
				request.execute(function(response) {
			    	
					playlistItems = response.result.items;
					
					if (playlistItems) {
						_ArrVideoId[indexJ] = 0;
						return false;
					}
					
				});
				
			});
			
		}
		
		function currentPlayList() {
			
			var requestOptions;
			
			requestOptions = {
				playlistId: _playlist_id,
				part: 'snippet'
			};
			
			var request = gapi.client.youtube.playlistItems.list(requestOptions);
			
			request.execute(function(response) {
		    	
		    	$('.check').empty().append(response.result.pageInfo.totalResults + "<br/>");
		    	
				var playlistItems = response.result.items;
				
				if (playlistItems) {
					
					_AddedVideoId = [];
					
					$.each(playlistItems, function(index, item) {
						$('.check').append(item.snippet.title + "<br/>");
						_AddedVideoId.push(item.snippet.resourceId.videoId);
					});
					
					UpdateAddingSongs();
					
				} else {
					$('.check').append('Sorry you have no item -> ' + vid + "<br/>");
				}
				
			});
			
		}
		
		function UpdateAddingSongs() {
			
			$.each(_AddedVideoId, function(indexK, itemX) {
				$.each(_ArrVideoId, function(indexJ, itemY) {
					if(itemX == itemY) {
						_ArrVideoId[indexJ] = 0;
						return false;
					}
				});
			});
			
		}
		
		$("#deleteall-button").click(function(e){
			
			var arrDeleteIds = []; 
			var requestOptions;
			
			requestOptions = {
				playlistId: _playlist_id,
				part: 'snippet'
			};
			
			var request = gapi.client.youtube.playlistItems.list(requestOptions);
			request.execute(function(response) {
		    	
		    	//$('.check').empty().append(response.result.pageInfo.totalResults + "<br/>");
		    	
				var playlistItems = response.result.items;
				
				if (playlistItems) {
					
					$.each(playlistItems, function(index, item) {
						arrDeleteIds.push(item.id);
					});
					
					DoDeleteAll(arrDeleteIds);
					
				} else {
					//$('.check').append('Sorry you have no item -> ' + vid + "<br/>");
				}
				
			});
			
		});
		
		function DoDeleteAll(arrDeleteIds) {
			
			var request;
			var requestOptions;
			
			$('.error').empty();
			
			try {
				
				for(var i = 0; i < arrDeleteIds.length; i++) {
					
					requestOptions = {
						id: arrDeleteIds[i]
					};
					
					request = gapi.client.youtube.playlistItems.delete(requestOptions);
					
					request.execute(function(response) {
						$('.error').append("[" + moment().add(9, "h").toISOString() + "] " + arrDeleteIds[i] + " " + JSON.stringify(response) + "<br/>");
					});
					
				}
				
			}
			catch(e) {
				$('.error').append("[" + moment().add(9, "h").toISOString() + "] " + e.name + " " + e.message + "<br/>");
			}
			
		}
		
	});

})(jQuery);
