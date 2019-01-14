
var _URL = "";
var _PLAYLIST_ID = "";

//_URL = "http://sirokurocya.sakura.ne.jp/development/modernjivescript/PlaylistDemo_10.txt";

var _ArraySongs = [];
var _ArrVideoId = []; 
var _DelArrVideoId = []; 
var errCount = 0;
var _AddedVideoId = []; 
var _VideoMap;
var _VideoMapPic;

function handleClientLoad() {
	// Loads the client library and the auth2 library together for efficiency.
	// Loading the auth2 library is optional here since `gapi.client.init` function will load
	// it if not already loaded. Loading it upfront can save one network request.
	
	gapi.load('client:auth2', initClient);
	
	//var cid = $("#clientid").val();
	
	//var OAuthURL = '';
	//OAuthURL = OAuthURL + 'https://accounts.google.com/o/oauth2/auth?';
	//OAuthURL = OAuthURL +  '' + 'client_id=' + cid;
	//OAuthURL = OAuthURL + '&' + 'redirect_uri=http%3a%2f%2fsirokurocya%2esakura%2ene%2ejp%2fdevelopment%2fmodernjivescript%2findex%2ehtml';
	//OAuthURL = OAuthURL + '&' + 'response_type=token';
	//OAuthURL = OAuthURL + '&' + 'apiKey=AIzaSyCfbrzcjjrBj2QCoERl15jaMuvruOA7UDE';
	//OAuthURL = OAuthURL + '&' + 'scope=https://www.googleapis.com/auth/youtube';
	
	//window.location.href = OAuthURL;
	
}

function initClient() {
	
	var cid = $("#clientid").val();

	// Initialize the client with API key and People API, and initialize OAuth with an
	// OAuth 2.0 client ID and scopes (space delimited string) to request access.
	gapi.client.init({
		apiKey: 'AIzaSyC5lOC0HsKLQtPBMk5NXCzDsM_4oe421XA',
		discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"],
		clientId: cid,
		scope: 'https://www.googleapis.com/auth/youtube'
	}).then(function () {
		// Listen for sign-in state changes.
		gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
		// Handle the initial sign-in state.
		updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
	}, function(error){
		
		alert(error.message);
		
	});
	
	//gapi.client.request({
	//	'clientId': cid,
	//	'redirect_uri': 'http%3a%2f%2fsirokurocya%2esakura%2ene%2ejp%2fdevelopment%2fmodernjivescript%2f',
	//	'response_type': 'token',
	//	'apiKey': 'AIzaSyCfbrzcjjrBj2QCoERl15jaMuvruOA7UDE',
	//	'scope': 'https://www.googleapis.com/auth/youtube'
	//	
	//}).then(function(response) {
	//	
	//	handleAPILoadedSearch();
	//	
	//}, function(reason) {
	//	
	//	alert('[initClient] ' + reason);
	//	
	//});
	
	// Initialize the client with API key and People API, and initialize OAuth with an
	// OAuth 2.0 client ID and scopes (space delimited string) to request access.
	/*
	gapi.client.init({
		clientId: cid,
		redirect_uri: 'http%3a%2f%2fsirokurocya%2esakura%2ene%2ejp%2fdevelopment%2fmodernjivescript%2f',
		response_type: 'token',
		apiKey: 'AIzaSyCfbrzcjjrBj2QCoERl15jaMuvruOA7UDE',
		discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"],
		scope: 'https://www.googleapis.com/auth/youtube'
	}).then(function () {
		// Listen for sign-in state changes.
		gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
		// Handle the initial sign-in state.
		updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
	}, function(error){
		
		alert(error.message);
		
	});
	*/
}

function updateSigninStatus(isSignedIn) {
	// When signin status changes, this function is called.
	// If the signin status is changed to signedIn, we make an API call.
	
	if (isSignedIn) {
		handleAPILoadedSearch();
	}
}

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

(function($){
	
	$(document).ready(function($){
		
		var evtRow = "<div>datetime: " + moment().add(9, "h").toISOString() + "</div>";
		$(".post-auth").empty().append(evtRow);
		
		var access_token = window.location.href;
		
		$("#logon-button").click(function(e){
			
			handleClientLoad();
			
		});
		
		$("#playlist-button").click(function(e){
			
			$(".textplaylistname").empty().append("(selected text file...)");
			$(".youtubeplaylistname").empty().append("(selected youtube playlist...)");
			
			$(".root").empty();
			$(".status").empty();
			$(".check").empty();
			$(".result").empty();
			
			var txtSongTitles = $("#playlistinput").val();
			_ArraySongs = txtSongTitles.split("\n");
			
			var song = "";
			var idx = 0;
			var counter = 0;
			
			for(var i = 0; i < _ArraySongs.length; i++) {
				
				song = _ArraySongs[i].trim();
				$(".root").append(song + "<br/>");
				/*
				idx = song.lastIndexOf(" ");
				
				if (idx > 0) {
					song = song.substring(0, idx - 1);
					$(".root").append(song + "<br/>");
				} 
				else {
					$(".root").append("N/A<br/>");
				}
				*/
				
				counter = counter + 1;
				
			}
			
			$(".root").append("<div style='font-weight:bold; margin-top:1em;'>number of data item: " + counter + "</div><br/>");
			
			
			/*
			
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
			
			*/
			
			/*
			var pid = $("#playlistid").val();
			
			var requestOptions;
			
			requestOptions = {
				id: pid,
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
			*/
			
		});
		
		$("#searchsong-button").click(function(e){
			
			var pid = $("#playlistid").val();
			
			gapi.client.request({
				'path':'/youtube/v3/playlists',
				'params':{
							'part': 'snippet',
							'id': pid
						}
			}).then(function(response) {
				$('.youtubeplaylistname').empty().append("[target youtube playlist name] <span style='font-weight:bold;'>" + response.result.items[0].snippet.title + "</span>");
			}, function(reason) {
				$(".error").append("[" + moment().add(9, "h").toISOString() + " youtubeplaylistname] " + reason.body + "<br/>");
			});
			
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
			
			_ArrVideoId = [];
			
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
		
		function getStatistics(count, max) {
			
			vid = _ArrVideoId[count];
			
			gapi.client.request({
				
				'path':'youtube/v3/videos',
				'params':{
					"part":"statistics",
					"id": vid
				}
				
			}).then(function(response) {
				
				$(".result").append("<tr>");
				$(".result").append("<td style='margin-right:1em;'>" + _VideoMapPic.get(response.result.items[0].id) + "</td>");
				$(".result").append("<td style='margin-right:1em;'>[" + response.result.items[0].id + "]</td>");
				$(".result").append("<td style='margin-right:1em; font-weight:bold;'>" + _VideoMap.get(response.result.items[0].id) + "</td>");
				$(".result").append("<td style='text-align:right; margin-left:1em;'>" + response.result.items[0].statistics.viewCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</span></td>");
				$(".result").append("</tr>");
				
				count = count + 1;
				if (count <= (max - 1)) {
					getStatistics(count, max);
				} 
				else {
					
				}
				
			});
			
		}
		
		$("#checkPlayList-button").click(function(e){
			
			$(".result").empty();

			$(".result").append("<br/>");
			$(".result").append("<br/>");
			$(".result").append("<table>");
			$(".result").append("<tbody>");
			
			var count = 0;
			getStatistics(count, _ArrVideoId.length);
			
			/*
			for(var i = 0; i < _ArrVideoId.length; i++) {
				
				vid = _ArrVideoId[i];
				
				gapi.client.request({
					
					'path':'youtube/v3/videos',
					'params':{
						"part":"statistics",
						"id": vid
					}
					
				}).then(function(response) {
					
					try {
						
						$(".result").append("<tr>");
						$(".result").append("<td style='margin-right:1em;'>" + _VideoMapPic.get(response.result.items[i].id) + "</td>");
						$(".result").append("<td style='margin-right:1em;'>[" + response.result.items[i].id + "]</td>");
						$(".result").append("<td style='margin-right:1em; font-weight:bold;'>" + _VideoMap.get(response.result.items[i].id) + "</td>");
						$(".result").append("<td style='text-align:right; margin-left:1em;'>" + response.result.items[i].statistics.viewCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</span></td>");
						$(".result").append("</tr>");
						
					} catch(e) {
						alert(e.message);
					}
					
				});
				
			}
			
			*/
			
			/*
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
			
			
			batch.then(function(response) {
				
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
				
				//for (i = 0; i < response.result.length; i++) {
				//	$(".result").append("[" + response.result[i].result.items[0].id + "] " + response.result[i].result.items[0].statistics.viewCount + "<br/>");
				//}
				
			}, function(reason) {
				
				try {
					$(".result").append("<tr>");
					$(".result").append("<td style='margin-right:1em;'>[" + reason.body + "]</td>");
					$(".result").append("</tr>");
				} catch(e) {
					
				}
				
			});
			
			*/
			
			$(".result").append("</tbody>");
			$(".result").append("</table>");
			
		});
		
		$("#addPlayList-button").click(function(e){
			
			var pid = $("#playlistid").val();
			
			if (errCount >= _ArrVideoId.length) {
				alert("all item added.");
			}
			else {
				//AddSongPlaylist(_ArrVideoId, _PLAYLIST_ID);
				_ArrVideoId.reverse();
				AddSong(_ArrVideoId, 0, pid) 
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
				
				$(".status").append("<span style='font-weight:bold;'>[" + idx + "]" + jsonObj.snippet.title + "</span><br/>");
				
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
			
			$('.error').empty();
			_DelArrVideoId = []; 
			
			var pid = $("#playlistid").val();
			
			$('.error').append("[" + moment().add(9, "h").toISOString() + "] " + "playlistid:" + " " + pid + "<br/>");
			
			gapi.client.request({
				
				'path':'/youtube/v3/playlistItems',
				'params':{
					"part":"snippet",
					"maxresults": "50",
					"playlistId": pid
				}
				
			}).then(function(response) {
				
				for (i = 0; i < response.result.items.length; i++) {
					_DelArrVideoId.push(response.result.items[i].snippet.resourceId.videoId);
				}
				
				$('#execDeleteAll-button').attr('disabled', false);
				
				$('.error').append("[" + moment().add(9, "h").toISOString() + "] " + "_DelArrVideoId:" + " " + _DelArrVideoId.lengh + "<br/>");
			
				
			});
			
		});
		
		$("#execDeleteAll-button").click(function(e){
			
			$('.error').empty();
			
			DoDeleteAll(0, _DelArrVideoId.length);
			
		});
		
		
		function DoDeleteAll(idx, idxDeleteIds) {
			
			var pid = $("#playlistid").val();
			var pos = idx;
			var vid = _DelArrVideoId[pos];
			
			gapi.client.request({
				
				'path':'youtube/v3/playlistItems',
				'method':'DELETE',
				'params':{
					"id": vid
				}
				
			}).then(function(response) {
				
				if (pos < idxDeleteIds) {
					pos = pos + 1;
					DoDeleteAll(pos, idxDeleteIds);
				}
				else {
					$(".status").append("[" + moment().add(9, "h").toISOString() + "] ALL DELETED");
					return false;
				}
				
			}, function(reason) {
				$(".error").append("[" + moment().add(9, "h").toISOString() + "] " + vid + " " + reason.statusText);
			});
			
		}
		
	});

})(jQuery);
