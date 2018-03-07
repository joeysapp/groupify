var express = require('express');
var app = express();

// Web sockets
var server = require('http').Server(app);
var io = require('socket.io')(server);

// Misc
var path = require('path');
var useragent = require('useragent');

var server = app.listen(8000, function(){
	console.log();
});

app.use(express.static('public'));
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/authResponse', function(req, res){
	console.log("I was just callbacked to!");
	// res.sendFile(path.join(__dirname + '/index.html'));
});

// Spotify stuff!
var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi({
	clientId : '6b745474e58f4ee78852ceb8a3a3e30e',
	clientSecret : 'bdba2d495125420e8bcf75135ddf8cb6'
	redirectUri : '0.0.0.0:8000/authResponse'
});

