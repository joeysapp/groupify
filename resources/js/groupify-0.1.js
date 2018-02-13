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
		// $('#placed_users').css('clear', 'both');

		// Now we need to add a button to it, lol
		// I assume there might be a smarter way? shrug



} 
$( function() {
	$('#gobutton').click(addName);

	$('#inputtext').on('keypress', function(e){
		if (e.which === 13){
			addName(e);
		}
	});
});
