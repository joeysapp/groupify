// https://accounts.spotify.com/authorize?client_id=bdba2d495125420e8bcf75135ddf8cb6&redirect_uri=http://localhost&response_type=token

/* Load the HTTP library */
var express = require('express');
var app = express();
var path = require('path');

var server = app.listen(8000, function(){
	console.log('groupify running at ' + server.address().address + ':' + server.address().port);
});

app.use(express.static('public'));

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname + '/index.html'));
});



// Spotify Client Credential Flow
var clientId = '6b745474e58f4ee78852ceb8a3a3e30e',
    clientSecret = 'bdba2d495125420e8bcf75135ddf8cb6';

global.SpotifyWebApi = require('spotify-web-api-node');
global.spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

(function(){
	spotifyApi.clientCredentialsGrant()
	  .then(function(data) {
	    console.log('The access token expires in ' + data.body['expires_in']);
	    console.log('The access token is ' + data.body['access_token']);

	    // Save the access token so that it's used in future calls
	    spotifyApi.setAccessToken(data.body['access_token']);
	  }, function(err) {
	        console.log('Something went wrong when retrieving an access token', err);
	  });
});
