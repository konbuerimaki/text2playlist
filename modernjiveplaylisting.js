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
		clientId: '- YOUR CLIENT ID -.apps.googleusercontent.com',
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
var _PLAYLIST_ID = "";

_URL = "http://sirokurocya.sakura.ne.jp/development/modernjivescript/PlaylistDemo.txt";
_URL = "http://sirokurocya.sakura.ne.jp/development/modernjivescript/PlaylistDemo_60.txt";
_PLAYLIST_ID = "PLsOsWUE7opcDL7XfJjEKZrqaPnEOpWbVs";

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
				id: _PLAYLIST_ID,
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
			
			var tag;
			var player;
			
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
						
						try {
								
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
							
						} catch(e) {
							
						}
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
					try {
						$(".result").append("<tr>");
						$(".result").append("<td style='margin-right:1em;'>" + _VideoMapPic.get(item.result.items[0].id) + "</td>");
						$(".result").append("<td style='margin-right:1em;'>[" + item.result.items[0].id + "]</td>");
						$(".result").append("<td style='margin-right:1em; font-weight:bold;'>" + _VideoMap.get(item.result.items[0].id) + "</td>");
						$(".result").append("<td style='text-align:right; margin-left:1em;'>" + item.result.items[0].statistics.viewCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</span></td>");
						$(".result").append("</tr>");
					} catch(e) {
						
					}
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
		
		$("#addPlayList-button").click(function(e){
			
			if (errCount >= _ArrVideoId.length) {
				alert("all item added.");
			}
			else {
				//AddSongPlaylist(_ArrVideoId, _PLAYLIST_ID);
				AddSong(_ArrVideoId, 0, _PLAYLIST_ID) 
			}
		});
		
		function AddSong(addingVideoIds, idx, addingPlaylist_id) {
			
			gapi.client.request({
				
				path: '/youtube/v3/playlistItems?part=snippet',
				method: 'POST',
				body:JSON.stringify({
					snippet: {
						playlistId: addingPlaylist_id,
						position: 0,
						resourceId: {
							videoId: addingVideoIds[idx],
							kind: 'youtube#video'
						}
					}
				})
				
			}).then(function(response) {
				
				jsonObj = response.result;
				
				$(".status").append("<span style='font-weight:bold;'>" + jsonObj.snippet.title + "</span><br/>");
				
				if (idx < addingVideoIds.length) {
					AddSong(addingVideoIds, ++idx, addingPlaylist_id);
				} else {
					$(".status").append("[" + moment().add(9, "h").toISOString() + "] idx: " + idx);
				}
				
			}, function(reason) {
				$(".error").append("[" + moment().add(9, "h").toISOString() + "][" + addingVideoIds[idx] + "]" + reason.statusText + "<br/>");
				if (idx < addingVideoIds.length) {
					AddSong(addingVideoIds, ++idx, addingPlaylist_id);
				} else {
					$(".status").append("[" + moment().add(9, "h").toISOString() + "] idx: " + idx);
				}
			});
			
			/*
			
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
			
			*/
			
		}
		
		/*
		function currentPlayList() {
			
			var requestOptions;
			
			requestOptions = {
				playlistId: _PLAYLIST_ID,
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
		*/
		
		/*
		function checkAddedSong() {
			
			var requestOptions;
			var request;
			var playlistItems;
			
			$.each(_ArrVideoId, function(indexJ, itemY) {
				
				requestOptions = {
					playlistId: _PLAYLIST_ID,
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
		*/
		
		/*
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
		*/
		
		$("#deleteall-button").click(function(e){
			
			gapi.client.request({
				
				'path':'/youtube/v3/playlistItems',
				'params':{
					"part":"snippet",
					"maxresults": "1",
					"playlistId": _PLAYLIST_ID
				}
				
			}).then(function(response) {
				
				$('.error').empty();
				DoDeleteAll(0, response.result.pageInfo.totalResults);
				
			}, function(reason) {
				$(".error").append("[" + moment().add(9, "h").toISOString() + "]" + reason.statusText + "<br/>");
			});
			
		});
		
		function DoDeleteAll(idx, idxDeleteIds) {
			
			var deletePlaylistItemId; 
			var deleteRequest;
			var batch;
		
			gapi.client.request({
				
				'path':'/youtube/v3/playlistItems',
				'params':{
					"part":"snippet",
					"maxresults": "50",
					"playlistId": _PLAYLIST_ID
				}
				
			}).then(function(response) {
				
				batch = gapi.client.newBatch();
				
				for(i = 0; i < 5; i++) {
					
					try {
						deletePlaylistItemId = response.result.items[i].id;
					} catch (e) {
					}
					
					deleteRequest = function() {
						
						return gapi.client.request({
							'path':'youtube/v3/playlistItems',
							'method':'DELETE',
							'params':{
								"id": deletePlaylistItemId
							}
						});
						
					}
					
					batch.add(deleteRequest());
				
				}
				
				batch.then(function(response) {
					
					//$(".error").append("[" + moment().add(9, "h").toISOString() + "] DELETED [" + response.status + "] " + response.statusText + "<br/>");
					
					gapi.client.request({
						
						'path':'/youtube/v3/playlistItems',
						'params':{
							"part":"snippet",
							"maxresults": "1",
							"playlistId": _PLAYLIST_ID
						}
						
					}).then(function(response) {
						
						$(".error").append("[" + moment().add(9, "h").toISOString() + "] [totalResults] " + response.result.pageInfo.totalResults + "<br/>");
						
						if(response.result.pageInfo.totalResults == 0) {
							$(".error").append("[" + moment().add(9, "h").toISOString() + "] All playlist items were deleted.<br/>");
							return false;
						}
						else {
							DoDeleteAll(0, response.result.pageInfo.totalResults);
						}
						
					}, function(reason) {
						return false;
					});
					
				}, function(reason) {
					
					return false;
					
				});
				
			}, function(reason) {
				$(".error").append("[" + moment().add(9, "h").toISOString() + "]" + reason.status + " " + reason.statusText + "<br/>");
			});
			
		}
		
	});

})(jQuery);
