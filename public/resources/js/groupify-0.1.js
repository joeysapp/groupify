var username = "joeysapp";
var auth_token = undefined;
var	socket = io.connect();
var clients = {};

// Would be good to find out when this is called on the js stack

$(document).ready(function() {

	socket.on('initClients', function(d){
		clients = d;
		console.log('client.initClients->clients.length: '+clientCount());
		for (var key in d){
			var tmp = "<div class='client' id="+key+">Loading...</div>"
			$('#clients').append(tmp);
			if (typeof d[key].name !== 'undefined'){
				console.log("setting name");
				$('#'+key).html(d[key].name);
			}

		}
	})

	socket.on('removeClient', function(d){
		delete clients[d.id];
		$('#'+d.id).remove();
		console.log('client.removeClient->clients.length: '+clientCount());
		// for (var key in d){
		// 	var name = d.id;
		// 	var tmp = "<div class='client' id="+name+">foo</div>"
		// 	$('#clients').append(tmp);
		// }
	})

	function clientCount(){
		var j = 0;
		for (var key in clients){
			j += 1;
		}
		return j;
	};

	socket.on('updateClient', function(d){
		if (clients.hasOwnProperty(d.id)){
			console.log('client.updateClient->SUCCESS');
			clients[d.id] = d;
			if (typeof d.name !== 'undefined'){
				$('#'+socket.id).html(d.name);
			}		
		} else {
			console.log('client.updateClient->FAILURE');
		}
	})

	socket.on('addClient', function(d){
		clients[d.id] = d;
		console.log('client.addClient->clients.length: '+clientCount());
		var name = typeof d.name === 'undefined' ? d.name : "tssmp";
		var tmp = "<div class='client' id="+d.id+">"+name+"</div>"
		$('#clients').append(tmp);
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
			$('#'+socket.id).html(username);
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
