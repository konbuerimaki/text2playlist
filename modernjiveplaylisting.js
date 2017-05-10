// After the API loads, call a function to get the uploads playlist ID.
function handleAPILoadedSearch() {

	// After the API loads, call a function to enable the search box.
	
	$('#playlist-button').attr('disabled', false);
	$('#searchsong-button').attr('disabled', false);
	$('#checkPlayList-button').attr('disabled', false);
	$('#addPlayList-button').attr('disabled', false);
	$('#deleteall-button').attr('disabled', false);
	//$('#search-button').attr('disabled', false);
	
}

function handleClientLoad() {
	// Loads the client library and the auth2 library together for efficiency.
	// Loading the auth2 library is optional here since `gapi.client.init` function will load
	// it if not already loaded. Loading it upfront can save one network request.
	gapi.load('client:auth2', initClient);
}

function initClient() {
	// Initialize the client with API key and People API, and initialize OAuth with an
	// OAuth 2.0 client ID and scopes (space delimited string) to request access.
	gapi.client.init({
		apiKey: 'AIzaSyCfbrzcjjrBj2QCoERl15jaMuvruOA7UDE',
		discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"],
		clientId: '681391917174-t1ruo3j36g1nbjthpalgn484rspfqbl5.apps.googleusercontent.com',
		scope: 'https://www.googleapis.com/auth/youtube'
	}).then(function () {
		// Listen for sign-in state changes.
		gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
		// Handle the initial sign-in state.
		updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
	});
}

function updateSigninStatus(isSignedIn) {
	// When signin status changes, this function is called.
	// If the signin status is changed to signedIn, we make an API call.
	if (isSignedIn) {
		handleAPILoadedSearch();
	}
}
var _URL = "";
var _playlist_id = "";

_URL = "http://sirokurocya.sakura.ne.jp/development/modernjivescript/PlaylistDemo.txt";
_URL = "http://sirokurocya.sakura.ne.jp/development/modernjivescript/PlaylistDemo_100.txt";
_playlist_id = "PLsOsWUE7opcDL7XfJjEKZrqaPnEOpWbVs";

var _ArraySongs = [];
var _ArrVideoId = []; 
var errCount = 0;
var _AddedVideoId = []; 
var _VideoMap;
var _VideoMapPic;

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
					
					$(".root").append("<div style='font-weight:bold; margin-top:1em;'>number of data item: " + counter + "</div><br/>");
					
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
			
			_VideoMap = new Map();
			_VideoMapPic = new Map();
			
			for(var i = 0; i < _ArraySongs.length; i++) {
				
				song = _ArraySongs[i].trim();
				idx = song.lastIndexOf(" ");
				
				if (idx > 0) {
					
					song = song.substring(0, idx - 1);
					
					gapi.client.request({
						
						'path':'youtube/v3/search',
						'params':{
									'q': song,
									'part': 'snippet'
								}
					
					}).then(function(response) {
						
						jsonObj = response.result;
						videoId = jsonObj.items[0].id.videoId;
						
						_ArrVideoId.push(videoId);
						
						_VideoMap.set(videoId, jsonObj.items[0].snippet.title);
						_VideoMapPic.set(videoId, "<img src=" + jsonObj.items[0].snippet.thumbnails.default.url + "></img>");
						
						$(".result").append("<div>");
						$(".result").append("<img src=" + jsonObj.items[0].snippet.thumbnails.default.url + "></img>");
						$(".result").append("<span style='margin-right:1em;'>[" + videoId + "] </span>");
						$(".result").append("<span style='font-weight:bold;'>" + jsonObj.items[0].snippet.title + "</span>");
						$(".result").append("</div>");
						
						//var str = JSON.stringify(response.result);
						//document.getElementById('console').innerHTML ='<pre>' + response.result.items[0].snippet.title + '</pre>';
						
					});
					
					
					/*
					var request = gapi.client.youtube.search.list({
						q: song,
						part: 'snippet'
					});
					
					request.execute(function(response) {
						
						jsonObj = response.result;
						videoId = jsonObj.items[0].id.videoId;
						
						_ArrVideoId.push(videoId);
						
						$(".result").append("<tr>");

						$(".result").append("<td>");
						$(".result").append("<img src=" + jsonObj.items[0].snippet.thumbnails.default.url + "></img>");
						$(".result").append("</td>");

						$(".result").append("<td>");
						$(".result").append("<span style='font-weight:bold;'>" + jsonObj.items[0].snippet.title + "</span>");
						$(".result").append("</td>");

						$(".result").append("<td>");
						$(".result").append("<span style=''>" + videoId + "</span>");
						$(".result").append("</td>");
						
						$(".result").append("<td>");
						$(".result").append("<span style=''>" + GetSongDetail(videoId) + "</span>");
						$(".result").append("</td>");
						
						$(".result").append("</tr>");
						
					});
					*/
				} 
				else {
					
					$(".result").append("N/A<br/>");
					
				}
				
				counter = counter + 1;
				
			}
			
			$(".result").append("<div style='font-weight:bold; margin-bottom:1em;'>number of data item: " + counter + "</div><br/>");
			
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
			
			/*
			AddSong(arrVideoId[errCount], playlist_id);
			errCount = errCount + 1;
			currentPlayList(playlist_id);
			*/
			
			errCount = 0;
			
			AddSongRawAjax(arrVideoId[0], playlist_id);
			
			AddSongRawAjax(arrVideoId[1], playlist_id);
			
			AddSongRawAjax(arrVideoId[2], playlist_id);
			
			AddSongRawAjax(arrVideoId[3], playlist_id);
			
			AddSongRawAjax(arrVideoId[4], playlist_id);
			
		}
		
		function AddSongRawAjax(prmVideoId, prmPlaylistId) {
			
			var workURL = "http://sirokurocya.sakura.ne.jp/development/modernjivescript/worker.html?addingVideoId=" + prmVideoId + "&addingPlaylist_id=" + prmPlaylistId;
			
			var win = window.open(workURL, "_blank");
			//win.close();
			
			/*
			$.ajax({
				url: "http://sirokurocya.sakura.ne.jp/development/modernjivescript/worker.html?addingVideoId=" + prmVideoId + "&addingPlaylist_id=" + prmPlaylistId,
				async: false,
				dataType: "text",
				success: function(data) {
					$(".status").append("<span style=''>" + data + "</span><br/>");
				},
				error: function(data) {
					$(".status").append("<span style='color:red;'>" + data + "</span><br/>");
				}
				
			});
			*/
			
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
			
			//currentPlayList();

			var batch = gapi.client.newBatch();
			
			var statRequest = function(vid) {
				
				return gapi.client.request({
					'path':'youtube/v3/videos',
					'params':{
								"part":"statistics",
								"id": vid
							}
						
				});
				
			}
			
			for (i = 0; i < _ArrVideoId.length; i++) {
				//batch.add(statRequest(_ArrVideoId[i]), {'id': 'searchViewCount'});
				batch.add(statRequest(_ArrVideoId[i]));
			}
			
			$(".result").append("<br/>");
			$(".result").append("<br/>");
			
			batch.then(function(response) {
				
				$(".result").empty();
				
				$(".result").append("<table>");
				$(".result").append("<tbody>");
				
				$.each(response.result, function(index, item) {
					$(".result").append("<tr>");
					$(".result").append("<td style='margin-right:1em;'>" + _VideoMapPic.get(item.result.items[0].id) + "</td>");
					$(".result").append("<td style='margin-right:1em;'>[" + item.result.items[0].id + "]</td>");
					$(".result").append("<td style='margin-right:1em; font-weight:bold;'>" + _VideoMap.get(item.result.items[0].id) + "</td>");
					$(".result").append("<td style='text-align:right; margin-left:1em;'>" + item.result.items[0].statistics.viewCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</span></td>");
					$(".result").append("</tr>");
				});
				
				$(".result").append("</tbody>");
				$(".result").append("</table>");
				
				/*
				for (i = 0; i < response.result.length; i++) {
					$(".result").append("[" + response.result[i].result.items[0].id + "] " + response.result[i].result.items[0].statistics.viewCount + "<br/>");
				}
				*/
			});
			
		});
		
		function currentPlayList() {
			
			var requestOptions;
			
			requestOptions = {
				playlistId: _playlist_id,
				part: 'snippet'
			};
			
			var request = gapi.client.youtube.playlistItems.list(requestOptions);
			
			request.execute(function(response) {
		    	
		    	$('.check').empty().append("<div style='font-weight:bold; margin-bottom:1em;'> totalResult: " + response.result.pageInfo.totalResults + "</div><br/>");
		    	
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
