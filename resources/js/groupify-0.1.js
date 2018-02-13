// Proposed structure of Groupify:
// Upon adding user to placed_users list, we query
// the Spotify API and place all the info about that user
// in a global list of users. Upon removal, that info
// is removed from the list.


var spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(access_token);

// It would be cool if we could have the page dynamically update
// upon addition/deletion. We'll see if that's possible
var prev = null;

function onUserInput(queryTerm) {

	// abort previous request, if any
	if (prev !== null) {
		prev.abort();
	}

	// store the current promise in case we need to abort it
	prev = spotifyApi.searchTracks(queryTerm, {limit: 5});
	prev.then(function(data) {
		// clean the promise so it doesn't call abort
		prev = null;

		console.log(data);

		// ...render list of search results...

		}, function(err) {
			console.error(err);
		});
}

// Main JS file
function addName(e){
		var username = $('#inputtext').val();

		var unique_id = "user"+($('#placed_users').children().length+1);
		var tmp_div = $("<div id="+unique_id+" class='placed_user'>"+username+"</div>");
		var tmp_btn = $("<input type='button' value='x' style='margin-top:1em; margin-left:1em; margin-right:1em'/>");
		
		$(tmp_btn).click(function(){
			$(tmp_btn).remove();
			$(tmp_div).remove();
		})

		$(tmp_div).prepend(tmp_btn);
		$('#placed_users').append(tmp_div);
}

// I believe this $(function(){}); is essentially like a window.onload?
// Would be good to find out when this is called on the js stack
$(document).ready(function() {
	// Handling clicking of our button
	$('#gobutton').click(addName);

	// Handling pressing enter in the text field
	$('#inputtext').on('keypress', function(e){
		if (e.which === 13){
			// addName(e);
			onUserInput('coldplay');
		}
	});



});
