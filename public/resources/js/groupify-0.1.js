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
		// We are assuming the input is not malicious or anything
		var username = $('#inputtext').val();

		// validator-js
		// get that^
		if (username.length > 0){
			console.log("client.socket.emit->"+"authenticateUser("+$('#inputtext').val()+")");
			socket.emit('authenticateUser', $('#inputtext').val());

			$('#preinit').remove();
			$('#loggedin').show();
			$('#loggedin').css("display","flex");
			$('#username').html(username);
			this.username = username;

		} else {
			console.log("Enter a username!");
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
