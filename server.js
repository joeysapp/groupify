var express = require('express');
var app = express();

// Web sockets
var clients = [];
var ID = 0; // this should be a hash later if we really care
var server = require('http').Server(app);
var io = require('socket.io')(server);

// Misc
var path = require('path');
var useragent = require('useragent');

server.listen(8000, "0.0.0.0", function(){
	console.log("\tgroupify.server running: "+server.address());
	console.log("\tgroupify.app running: "+app)
});

// Socket details
io.on('connection', function(socket){

	clients.push({
		id: ID++,
		socket: socket
	});

	console.log("clients: "+clients.length);


	socket.on('socket_emission_from_client', function(data){
		console.log('server-side socket_emission_from_client received');

		// THIS DOES NOT GO BACK TO SENDER.
		// socket.broadcast.emit('placeDot', data);

		// THIS DOES.
		// io.sockets.emit('mouse_was_clicked', data);
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

// Spotify stuff!
var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi({
	clientId : '6b745474e58f4ee78852ceb8a3a3e30e',
	clientSecret : 'bdba2d495125420e8bcf75135ddf8cb6',
	redirectUri : '0.0.0.0:8000/authResponse'
});

