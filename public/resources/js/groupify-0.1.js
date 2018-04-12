var	socket = io.connect();
var clients = {};

var auth_token = undefined;
var username = undefined;
var id = socket.id;

// Would be good to find out when this is called on the js stack
// aka make this better
$(document).ready(function() {

	var spotifyLoginWindow;

	if (document.cookie.includes('uuid')){
		$('#loginbutton').hide();
	}

	// $.get(`http://${window.location.hostname}:8000/getAuthURL`, url => {
	// 	// $('#auth').attr('href', url);
	// 	$('#auth').show();
	// 	$('#auth').click(e => {
	// 		spotifyLoginWindow = window.open(url);
	// 	});
	// });

	socket.on('initClients', function(d){
		// Making sure on server reload we've 
		clients = d;
		for (var key in d){
			if (typeof d[key].id !== 'undefined'){
				addClientDiv(d[key]);
			}
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
				$('#'+d.id).children('.client.status').css('background-color','green');
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
		var username = typeof d.username === 'undefined' ? d.id : d.username;
		var tmp = '<div class=\'client\' id='+d.id+'></div>'
		$('#clients').append(tmp);
		// if (d.id == socket.id){
		$('#'+d.id).append(`<div class='client username'>${username}</div>`);
		$('#'+d.id).append(`<div class='client toolbar'>toobar</div>`);
		$('#'+d.id).append(`<div class='client artists'></div>`);
		var top_artists = clients[d.id].top_artists;
		var list = $('<ul>').append(top_artists.map(a => $('<li>').append($('<a>').text(a))
			)
		);

		$(`#${d.id}.client .artists`).append(list);
		if (d.status == 'Authorized'){ 
			var col = 'green';
		} else {
			var col = 'yellow';
		}
		$('#'+d.id).append(`<div class='client status' style='background-color:'${col}'></div>`);

		// }
	}

});
