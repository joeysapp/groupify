var express = require('express');
var app = express();
var cors = require('cors');
// Use this for our states!
var uuidv4 = require('uuid/v4');
app.use(cors());

// Web sockets
var clients = {};
var client_ct = 0;
var server = require('http').Server(app);
var io = require('socket.io')(server);

// Misc
var path = require('path');
var useragent = require('useragent');
var cookie = require('cookie');
var moment = require('moment');
var request = require('request');
var cookieParser = require('cookie-parser');
var cookieParserio = require('socket.io-cookie');

app.use(cookieParser());

// Spotify API creds!
var client_id = '6b745474e58f4ee78852ceb8a3a3e30e';
var client_secret = require('./data/client_secret.js').CLIENT_SECRET;
var redirect_uri = 'http://localhost:8000/authResponse/';
var querystring = require('querystring');

var firebase = require('firebase');
var config = {
	apiKey: "AIzaSyCEqXgSFuRFp0Gb9cGfozy6qBIJz563G4k",
	authDomain: "groupify-tamu.firebaseapp.com",
	databaseURL: "https://groupify-tamu.firebaseio.com",
};
firebase.initializeApp(config);
var db = firebase.database();

// Util
var client = require('./public/resources/js/client-0.1.js');

(function(){
	console.log('currently retrieving users/ from firebase');
	var all_keys = firebase.database().ref('users/').once('value').then(function(snapshot){
		snapshot.forEach(child => {
			var snapshot_result = child.val();
			var client_uuid = snapshot_result.uuid;
			console.log('PULLED DATA of: '+snapshot_result.id);
			clients[client_uuid] = snapshot_result;
			clients['retrieved_successfully'] = true;
		});
	});
})();

server.listen(8000, '0.0.0.0', function(){
	console.log('groupify.server running on localhost:8000');
});

// Socket details
io.use(cookieParserio);
io.on('connection', function(socket){
	if (typeof socket.handshake.headers.cookie !== 'undefined'){
		var cookie_uuid = socket.handshake.headers.cookie.uuid;
		console.log(cookie_uuid+' connected');
	};

	// Send all current client objects to the socket
	socket.emit('initClients', clients);
	// getAllClients();

	// clients[socket.id] = tmp;
	// client_ct += 1;
	// Send the new client to all other connected sockets
	// io.local.emit('addClient', tmp);

	// Telling other clients what to do when
	// another connected user disconnects.
	socket.on('disconnect', function(){
		if (typeof socket.handshake.headers.cookie !== 'undefined'){
			var cookie_uuid = socket.handshake.headers.cookie.uuid;
			console.log(cookie_uuid+' disconnected');
		} else {
			console.log('anonymous user disconnected');
		}
		// console.log('socket.clients.length = '+client_ct);
		io.local.emit('removeClient', null);
		delete clients[socket.id];
	});

	// Helper function to delete a given client
	socket.on('deleteClient', function(d){
		delete clients[d.id];
	});
});

app.use(express.static('public'));

app.get('/login', (req, res) => {
	// Random UUID to identify the user (set a 'state');
	// This prevents collisions in the current
	// multi-user environment.
	var state = uuidv4();
	var stateKey = 'spotify-auth-state';
	res.cookie(stateKey, state);

	var scope = 'user-read-private playlist-read-private user-top-read';

	if (typeof client_secret === 'undefined'){
		console.log('You need the client secret file from joey');
	}
	res.redirect('https://accounts.spotify.com/authorize?' +
		querystring.stringify({
			response_type: 'code',
			client_id: client_id,
			scope: scope,
			redirect_uri: redirect_uri,
			state: state
		}));
});

app.get('/authResponse', function(req, res) {

	// your application requests refresh and access tokens
	// after checking the state parameter

	console.log('User said yes');

	var stateKey = 'spotify-auth-state';

	var code = req.query.code || null;
	var state = req.query.state || null;
	var storedState = req.cookies ? req.cookies[stateKey] : null;

	if (state === null || state !== storedState) {
		res.redirect('/#' +
		querystring.stringify({
		error: 'state_mismatch'
		}));
	} else {
		res.clearCookie(stateKey);
		var authOptions = {
			url: 'https://accounts.spotify.com/api/token',
			form: {
				code: code,
				redirect_uri: redirect_uri,
				grant_type: 'authorization_code'
			},
			headers: {
				'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
			},
			json: true
		};

		var tmp_uuid = uuidv4();
		res.cookie('uuid', tmp_uuid);
		request.post(authOptions, function(error, response, body) {
			if (!error && response.statusCode === 200) {
				var access_token = body.access_token,
				refresh_token = body.refresh_token;

				// Get basic info
				var options1 = {
					url: 'https://api.spotify.com/v1/me',
					headers: { 'Authorization': 'Bearer ' + access_token },
					json: true
				};
				// use the access token to access the Spotify Web API
				request.get(options1, function(error, response, body) {
					console.log(body);
					// firebase.database().ref('users/').push(username);
					var updates = {};
					updates[tmp_uuid] = { 'uuid':tmp_uuid, 'id': body.id };
					firebase.database().ref('users/').update(updates);
				});

				// Get playlists!
				var options2 = {
					url: 'https://api.spotify.com/v1/me/playlists',
					headers: { 'Authorization': 'Bearer ' + access_token },
					json: true
				};
				request.get(options2, function(error, response, body) {
					playlists = [];
					for (var item of body.items){
						// These are urls to each of the user's
						// followed playlists. Limit of 20 rn
						// console.log(item.href);
						playlists.push(item.href);
					}
					// firebase.database().ref('users/').push(username);
					var updates = { 'followed_playlists': playlists };
					firebase.database().ref('users/'+tmp_uuid).update(updates);
				});

				// Get top artists
				var options3 = {
					url: 'https://api.spotify.com/v1/me/top/artists',
					headers: { 'Authorization': 'Bearer ' + access_token },
					json: true
				};
				request.get(options3, function(error, response, body) {
					top_artists = [];
					console.log('top artists');
					for (var artist of body.items){
						top_artists.push(artist.name);
					}
					console.log(top_artists);
					var updates = { 'top_artists': top_artists };
					firebase.database().ref('users/'+tmp_uuid).update(updates);
				});

			// we can also pass the token to the browser to make requests from there
				res.redirect('/#' +
					querystring.stringify({
						access_token: access_token,
						refresh_token: refresh_token
				}));
			} else {
				res.redirect('/#' +
					querystring.stringify({
						error: 'invalid_token'
				}));
			}
		});
	}
});

app.get('/getAuthURL', function(req, res){
	var scopes = [];
	var state = 'getting-data';
	// So we need to get the user to click this!
	var authorizeURL = spotifyApi.createAuthorizeURL(scopes,state);
	res.send(authorizeURL);
});

// Spotify stuff!
var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi({
	clientId : '6b745474e58f4ee78852ceb8a3a3e30e',
	redirectUri : 'http://localhost:8000/authResponse/'
});


