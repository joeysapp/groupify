var express = require('express');
var app = express();

// Web sockets
var clients = {};
var ID = 0; // this should be a hash later if we really care
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
	clients[socket.id] = new client(socket,socket.id,0,0);
	// socket.emit('init', clients);
	console.log('socket.clients['+socket.id+"] connected");

	socket.on('disconnect', function(){
		console.log('socket.clients['+socket.id+"] disconnected");
		delete clients[socket.id];
	});

	socket.on('authenticateUser', function(d){
		console.log("authenticateUser("+d+")");
	})
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

// This would be if I wanted to have things happening
// to the users without any causation
// i.e. no one else doing anything (perlin noise movement!)
// setInterval(function foo(){
// 	console.log("helo");

// }, 10000);

