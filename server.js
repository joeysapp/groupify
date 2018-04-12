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
app.use(cookieParser());

// Spotify API creds!
var client_id = '6b745474e58f4ee78852ceb8a3a3e30e';
var client_secret = require('./data/client_secret.js').CLIENT_SECRET;
var redirect_uri = 'http://localhost:8000/authResponse/';
var querystring = require('querystring');

// Util
var client = require('./public/resources/js/client-0.1.js');

server.listen(8000, '0.0.0.0', function(){
	console.log('groupify.server running on localhost:8000');
	console.log('\t\tenter that URL into your browser!')
});
// app.listen(8000, function(){
// 	console.log('groupify server running on localhost:8000');
// })

// Socket details
io.on('connection', function(socket){
	console.log('socket.clients['+socket.id+'] connected');
	console.log('I see cookeis:');
	console.log(socket.handshake.headers.cookie);
	// console.log('socket.clients.length = '+client_ct);

	// Send all current client objects to the socket
	socket.emit('initClients', clients);

	var tmp = new client(socket.id);
	clients[socket.id] = tmp;
	client_ct += 1;
	// Send the new client to all other connected sockets
	io.local.emit('addClient', tmp);

	// Telling other clients what to do when
	// another connected user disconnects.
	socket.on('disconnect', function(){
		client_ct -= 1;
		// console.log('socket.clients['+clients[socket.id].pos+'] disconnected');
		// console.log('socket.clients.length = '+client_ct);
		io.local.emit('removeClient', tmp);
		delete clients[socket.id];
	});

	// Helper function to delete a given client
	socket.on('deleteClient', function(d){
		delete clients[d.id];
	});

	// Should be our Spotify auth, but isn't (have to have it
	// user-activated, aka via a button)
	socket.on('authenticateUser', function(d){
		// console.log('server.authenticateUser');
		// Set our clients info from the socket.id!
		clients[socket.id].username = d;
		io.local.emit('updateClient', clients[socket.id]);
	});
});

app.use(express.static('public'));

app.get('/login', (req, res) => {
	// Random UUID to identify the user (set a 'state');
	// This prevents collisions in the current
	// multi-user environment.
	console.log('wow');
	var state = uuidv4();
	var stateKey = 'spotify-auth-state';
	res.cookie(stateKey, state);

	var scope = 'user-read-private';

	if (typeof client_secret === 'undefined'){
		console.log('You need the client secret file from joey');
	}

	console.log('Redirecting user..');

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

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
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

app.get('/callback', function(req, res){
	console.log('get: \'/callback');
	console.log(req.query);
	// res.sendFile(path.join(__dirname + '/index.html'));
})

// Spotify stuff!
var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi({
	clientId : '6b745474e58f4ee78852ceb8a3a3e30e',
	redirectUri : 'http://localhost:8000/authResponse/'
});

// var sqlite3 = require('sqlite3').verbose();
// var db = new sqlite3.Database('data/users.db', (e) => {
// 	console.log('Database opened');
// });

// db.run('CREATE TABLE users (uuid VARCHAR(36), username TEXT, auth_token TEXT, refresh_token INT)');


// db.all('SELECT * FROM users;', function(err, row){
// 	console.log(row);
// })

// db.close(function(){
// 	console.log('Database closed');
// })

// This would be if I wanted to have things happening
// to the users without any causation
// i.e. no one else doing anything (perlin noise movement!)
// setInterval(function foo(){
// 	console.log('helo');

// }, 10000);

app.listen(8888);

