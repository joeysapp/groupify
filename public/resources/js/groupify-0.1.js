// It would be cool if we could have the page dynamically update
// upon addition/deletion. We'll see if that's possible
var prev = null;

// 

function onUserInput(queryTerm) {

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
	socket = io.connect();

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
