var username = "joeysapp";
var auth_token = undefined;

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
	$('#inputbutton').click(function(e){
		if ($('#inputtext').val().length > 0){
			console.log("client.socket.emit->"+"authenticateUser("+$('#inputtext').val()+")");
			socket.emit('authenticateUser', $('#inputtext').val());
		}
	});

	// Handling pressing enter in the text field
	$('#inputtext').on('keypress', function(e){
		if (e.which === 13){
			addName(e);
			onUserInput(e);
		}
	});
});
