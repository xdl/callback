var express = require("express");
var app = express();
var fs = require('fs');
var mongoose = require("mongoose");
var async = require("async");

//database path:
var dbPath;

app.configure(function() {
	app.set("view engine", "jade");
	app.use(express.static(__dirname + "/public"));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({secret: "123"}));

	var env = app.get('env');
	console.log('environment:', env);
	//env = 'production'; //just checking...
	if (env == 'development') {
		dbPath = 'mongodb://localhost/callback';
	} else if (env == 'production') {
		dbPath = 'mongodb://Eddie:ededed@dharma.mongohq.com:10054/callback';
	}

	mongoose.connect(dbPath, function onMongooseError(err) {
		if (err)
			throw err;
	});
});

var models = {
	User: require('./models/User')(mongoose, async),
	Task: require('./models/Task')(mongoose, async),
	
	//setup model for testing/repopulation purposes
	Debug: require('./models/Debug')(mongoose, fs, async)
};


//will stick this into another file probably, soon.
var helpers = {
	callback: function(res) {
		return function(err) {
			if (err)
				throw err;
			else
				res.send(200);
		};
	}	
};

// Import the routes
fs.readdirSync('routes').forEach(function(file) {
	if ( file[0] == '.' ) 
		return;
	var routeName = file.substr(0, file.indexOf('.'));
	require('./routes/' + routeName)(app, models, helpers);
});



app.get('/', function(req, res) {
	res.render("index");
});

app.get('/users/me', function(req, res) {
	var username = req.session.username;
	models.User.findById(username, function(err, doc) {
		res.send(doc);
	});
});

app.put('/users/me/tasks/:id', function(req, res) {
	var id = req.params.id;
	models.Task.switchTask();
	console.log(id);

});

app.get('/users/me/tasks', function(req, res) {
	var username = req.session.username;
	models.Task.findByUser(username, function(err, docs) {
		res.send(docs);
	});
});

app.get('/users/me/team/:id', function(req, res) {
	var team = req.params.id;
	models.User.findByTeam(team, function(err, docs) {
		res.send(docs);
	});

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
	models.User.login(user, password, function(err, doc) {
		if (err)
			throw err;
		else if (!doc) {
			res.send(401);
		} else {
			req.session.loggedIn = true;
			req.session.username = doc.username;
			res.send(200);
		}
	});
});

app.post('/logout', function(req, res) {
	req.session = null;
	res.send(200);
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log("listening on port " + port);
});
