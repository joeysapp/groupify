var username = "joeysapp";
var auth_token = undefined;
var	socket = io.connect();
var clients = {};

// Would be good to find out when this is called on the js stack

$(document).ready(function() {

	socket.on('initClients', function(d){
		// console.log(d);
		// for (key in d){
		// 	clients[key] = d[key];
		// }
		clients = d;
		console.log('client.initClients->clients.length: '+clientCount());
	})

	function clientCount(){
		console.log('client.client.length: ');
		var j = 0;
		for (var key in clients){
			j += 1;
		}
		return j;
	};

	socket.on('sendClient', function(d){
		clients[d.id] = d;
	})

	socket.on('addClient', function(d){
		clients[d.id] = d;
		console.log('client.addClient->clients.length: '+clientCount());
	})

	function getUserInput(e){
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
		getUserInput(e);
	});

	// Handling pressing enter in the text field
	$('#inputtext').on('keypress', function(e){
		if (e.which === 13){
			getUserInput(e);
		}
	});
});
