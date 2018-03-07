


// Would be good to find out when this is called on the js stack
$(document).ready(function() {
	socket = io.connect();

	socket.on('init', function(d){
		console.log("init ");
	})

	socket.on('add_user', function(d){
		console.log("add_user "+d);
	})

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
