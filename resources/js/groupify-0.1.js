// Proposed structure of Groupify:
// Upon adding user to placed_users list, we query
// the Spotify API and place all the info about that user
// in a global list of users. Upon removal, that info
// is removed from the list.

// It would be cool if we could have the page dynamically update
// upon addition/deletion. We'll see if that's possible

// Main JS file
function addName(e){
		// Value of input - i.e. username
		var username = $('#inputtext').val();
		console.log(username);

		// Create item to place in our placed_users
		// This will be of the following structure:
		// div id=placed_users
		// 		div id=user1 end div
		//		div id=user2 end div
		//		...
		// end div
		// Each unique id will be of class placed_user
		// with the ability to remove it from the list!

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
$( function() {
	// Handling clicking of our button
	$('#gobutton').click(addName);

	// Handling pressing enter in the text field
	$('#inputtext').on('keypress', function(e){
		if (e.which === 13){
			addName(e);
		}
	});
});
