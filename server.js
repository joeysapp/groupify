var express = require('express');
var app = express();

// Web sockets
var clients = {};
var client_ct = 0;
var server = require('http').Server(app);
var io = require('socket.io')(server);

// Misc
var path = require('path');
var useragent = require('useragent');
var client = require('./public/resources/js/client-0.1.js');

server.listen(8000, "0.0.0.0", function(){
	console.log("groupify.server running");
});

// Socket details
io.on('connection', function(socket){
	console.log('socket.clients['+socket.id+"] connected");
	console.log('socket.clients.length = '+client_ct);

	// Send all current client objects to the socket
	socket.emit('initClients', clients);

	var tmp = new client(socket.id,[0,0]);
	clients[socket.id] = tmp;
	client_ct += 1;
	// Send the new client to all other connected sockets
	io.local.emit('addClient', tmp);

	socket.on('disconnect', function(){
		client_ct -= 1;
		console.log('socket.clients['+clients[socket.id].pos+"] disconnected");
		console.log('socket.clients.length = '+client_ct);
		io.local.emit('removeClient', tmp);
		delete clients[socket.id];
	});

	socket.on('deleteClient', function(d){
		delete clients[d.id];
	});

	socket.on('authenticateUser', function(d){
		console.log('server.authenticateUser');

		// Set our clients info from the socket.id!
		clients[socket.id].username = d;

		console.log(clients[socket.id]);


		if (true){
			clients[socket.id].status = 'Authorized';
		} else {
			clients[socket.id].status = 'FailedAuth';
		}
		io.local.emit('updateClient', clients[socket.id]);
		// console.log(clients[socket.id]);
		// io.local.emit('sendClient', clients[socket.id]);

		// io.socket.emit('sendClients', clients);
	});
});


app.use(express.static('public'));

app.get('/', function(req, res){
	var agent = useragent.parse(req.headers['user-agent']);
	// console.log('get: \'/\' groupify.req.headers: '+req.headers);
	console.log('get: \'/\' groupify.agent: '+agent);

	res.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/authResponse', function(req, res){
	var agent = useragent.parse(req.headers['user-agent']);
	// console.log('get: \'/authResponse\' groupify.req.headers: '+req.headers);
	console.log('get: \'/authResponse\' groupify.agent: '+agent);

	// res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/callback', function(req, res){
	console.log('get: \'/callback');
	console.log(req.query);
	// res.sendFile(path.join(__dirname + '/index.html'));

})

// Spotify stuff!
var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi({
	clientId : '6b745474e58f4ee78852ceb8a3a3e30e',
	// clientSecret : 'bdba2d495125420e8bcf75135ddf8cb6',
	redirectUri : 'http://localhost:8000/callback/'
});

var scopes = [];
var state = 'getting-data';
var authorizeURL = spotifyApi.createAuthorizeURL(scopes,state);
console.log(authorizeURL);

// This would be if I wanted to have things happening
// to the users without any causation
// i.e. no one else doing anything (perlin noise movement!)
// setInterval(function foo(){
// 	console.log("helo");

// }, 10000);

