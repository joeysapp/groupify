var	socket = io.connect();
var clients = {};

var auth_token = undefined;
var username = undefined;
var id = socket.id;

// Would be good to find out when this is called on the js stack

$(document).ready(function() {

	socket.on('initClients', function(d){
		// Making sure on server reload we've 
		clients = d;
		console.log('client.initClients->clients.length: '+clientCount());
		for (var key in d){
			addClientDiv(d[key]);

		}
	})

	socket.on('removeClient', function(d){
		delete clients[d.id];
		$('#'+d.id).remove();
		console.log('client.removeClient->clients.length: '+clientCount());
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
			if (typeof d.username !== 'undefined'){
				$('#'+d.id).children('.client.username').html(d.username);
				$('#'+d.id).children('.client.status').css("background-color","green");
			}		
		} else {
			console.log('client.updateClient->FAILURE');
		}
	})

	socket.on('addClient', function(d){
		addClientDiv(d);
	})

	function addClientDiv(d){
		clients[d.id] = d;
		console.log('client.addClientDiv->clients.length: '+clientCount());
		var username = typeof d.username === 'undefined' ? d.id : d.username;
		var tmp = "<div class='client' id="+d.id+"></div>"
		$('#clients').append(tmp);
		// if (d.id == socket.id){
		$('#'+d.id).append("<div class='client username'>"+username+"</div>");
		$('#'+d.id).append("<div class='client toolbar'>toobar</div>");
		$('#'+d.id).append("<div class='client artists'>none</div>");
		if (d.status == 'Authorized'){ 
			var col = 'green';
		} else {
			var col = 'yellow';
		}
		$('#'+d.id).append("<div class='client status' style='background-color:"+col+"'></div>");

		// }
	}

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
			// $('#'+socket.id).children('.username').html(username);

			this.username = username;
		} else {
			console.log("Enter a username!");
		}
	};

	// Handling clicking of our button
	$('#inputbutton').click(function(e){
		getUserInput(e);
	});

	$('#logoutbutton').click(function(e){
		console.log('client.logout nonfunctional');
		// delete clients[id];
		// $('#'+id).remove();
		// socket.emit('deleteClient', id);
		// console.log('client.logoutbutton->clients.length: '+clientCount());
	});

	// Handling pressing enter in the text field
	$('#inputtext').on('keypress', function(e){
		if (e.which === 13){
			getUserInput(e);
		}
	});
});
