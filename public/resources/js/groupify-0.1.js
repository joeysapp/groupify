var username = "joeysapp";
var auth_token = undefined;
var	socket = io.connect();
var clients = {};

// Would be good to find out when this is called on the js stack

$(document).ready(function() {

	socket.on('initClients', function(d){
		this.clients = d;
	})

	socket.on('receiveClients', function(d){
		this.clients = d;
	})

	socket.on('addClient', function(d){
		// console.log("add_user "+d);
		this.clients[d.id] = d;
	})

	function addUser(e){
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
	};

	// Handling clicking of our button
	$('#inputbutton').click(function(e){
		addUser(e);
	});

	// Handling pressing enter in the text field
	$('#inputtext').on('keypress', function(e){
		if (e.which === 13){
			addUser(e);
		}
	});
});
