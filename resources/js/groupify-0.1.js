// https://developer.spotify.com/web-api/get-list-users-playlists/

// I want to interact with the web API and show some data on my website. 
// I see that the endpoints I need authorization, but I don’t need/want a login window to pop-up, 
// because I want to grant my own app access to my own playlists once. Is there any way of doing this?

// You basically need an access token and a refresh token issued for your user account. 
// For obtaining a pair of access token / refresh token you need to follow the
// Authorization Code Flow (if you need a certain scope to be approved) or Client Credentials
// (if you just need to sign your request, like when fetching a certain playlist).
// Once you obtain them, you can use your access token and refresh it when it
// expires without having to show any login form.
var access_token = "BQCwrYzPejOgxB4GFxVSYyafUWQBarVlnChkesCoHEbYfN4-AqW01M5yatXgYXkD61PzH3DWjOovXnItmOjoF39ezgCrOZgB5cVO-OpOhlVxtgw7BQIm-hv1PSEYhd-RlnBAUqm3KeSWJ3tMHhmnQwk9_w";

var spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(access_token);

// It would be cool if we could have the page dynamically update
// upon addition/deletion. We'll see if that's possible
var prev = null;

function onUserInput(queryTerm) {

	// abort previous request, if any
	if (prev !== null) {
		// prev.abort();
	}

	// store the current promise in case we need to abort it
	// prev = spotifyApi.searchTracks(queryTerm, {limit: 5});
	// prev.then(function(data) {
	// 	// clean the promise so it doesn't call abort
	// 	prev = null;

	// 	console.log(data);

	// 	// ...render list of search results...

	// 	}, function(err) {
	// 		console.error(err);
	// 	});

	var username = $('#inputtext').val();
	prev = spotifyApi.getUserPlaylists(username, {limit: 5}).then(function(data){
		console.log("data:", data);
	}, function(err){
		console.log(err);
	});
	

}

function addName(e){
		var username = $('#inputtext').val();

		// This creates a unique ID of <div id='user1...n'>
		var unique_id = "user"+($('#placed_users').children().length+1);
		var tmp_div = $("<div id="+unique_id+" class='placed_user'>"+username+"</div>");
		var tmp_btn = $("<input type='button' value='x'>");
		
		$(tmp_btn).click(function(){
			$(tmp_btn).remove();
			$(tmp_div).remove();
		})

		$(tmp_div).prepend(tmp_btn);
		$('#placed_users').append(tmp_div);
}

// Would be good to find out when this is called on the js stack
$(document).ready(function() {
	// Handling clicking of our button
	$('#gobutton').click(function(e){
		addName(e);
		onUserInput(e);
	});

	// Handling pressing enter in the text field
	$('#inputtext').on('keypress', function(e){
		if (e.which === 13){
			addName(e);
			onUserInput(e);
		}
	});
});
