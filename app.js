var express = require("express");
var app = express();

//filereader:
var fs = require('fs');

var mongoose = require("mongoose");

//database path:
var dbPath;


app.configure(function() {
	app.set("view engine", "jade");
	app.use(express.static(__dirname + "/public"));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({secret: "123"}));

	var env = app.get('env');
	//env = 'production'; //just checking...
	if (env == 'development')
		dbPath = 'mongodb://localhost/callback';
	else if (env == 'production')
		dbPath = 'mongodb://Eddie:ededed@dharma.mongohq.com:10054/callback';
	mongoose.connect(dbPath, function onMongooseError(err) {
		if (err)
			throw err;
	});
});

var models = {
	//setup model for testing/repopulation purposes
	Account: require('./models/Account')(mongoose),
	Setup: require('./models/Setup')(mongoose, fs)
};

app.get('/', function(req, res) {
	res.render("index");
});

app.post('/accounts/authenticated', function(req, res) {
	if (req.session.loggedIn){
		res.send(200);
	} else {
		res.send(401);
	}
});

app.post('/login', function(req, res) {
	var user = req.param('username', null);
	var password = req.param('password', null);
	models.Account.login(user, password, function(err, doc) {
		if (err)
			throw err;
		else if (!doc) {
			res.send('invalid user/pass');
		} else {
			req.session.loggedIn = true;
			res.send('successfully logged in');
		}
	});
});

app.post('/test_populateUsers', function(req, res) {
	models.Setup.populate(function(error) {
		if (error)
			throw error;
		else {
			res.send('population_complete');
		}
	});
});

app.post('/test_showUsers', function(req, res) {
	models.Setup.showUsers(function(error, docs) {
		if (error)
			throw error;
		else
			res.send(docs);
	});
});

app.post('/test_removeUsers', function(req, res) {
	models.Setup.removeUsers(function(error) {
		if (error)
			throw error;
		else
			res.send('all users removed');
	});
});

var port = process.env.PORT || 3000;
var pro = process;
app.listen(port, function() {
	console.log("listening on port " + port);
});
