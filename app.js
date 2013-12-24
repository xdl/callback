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
	env = 'production'; //just checking...
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

//god, sort these out!

//bulk adding
app.post('/import/tasks', function(req, res) {
	var task_array = req.body.data;
	models.Task.createTasks(task_array, function(err, docs) {
		if (err) {
			throw err;
		} else {
			res.send(200, docs);
		}
	});
});

app.get('/users/me', function(req, res) {
	var username = req.session.username;
	models.User.findById(username, function(err, doc) {
		res.send(doc);
	});
});

//get all users (of a team)
app.get('/users', function(req, res) {
	var team = req.session.team;
	models.User.findByTeam(team, function(err, docs) {
		res.send(docs);
	});

});

app.get('/users/:id', function(req, res) {
	console.log('i dont think this is ever called');
	console.log('req.session.loggedIn:', req.session.loggedIn);
	var username = req.session.username;

	if (!username) {
	}
	models.User.findById(username, function(err, doc) {
		res.send(doc);
	});
});

//for changeTask
app.put('/users/me/:id',function(req, res) {
	var user = req.body;
	models.User.changeTask(user, function(err) {
		if (err) {
			throw err;
		} else {
			res.send(200);
		}
	});
});

//for registering
app.post('/create', function(req,res) {
	models.User.create
});


//for createTask
app.post('/tasks', function(req, res) {
	console.log('app - post request received');
	var task = req.body;
	console.log('task:', task);
	models.Task.createTask(task, function(err, doc) {
		res.send(200, doc);
	});
});

//for t1.done()
app.put ('/tasks/:id', function(req, res) {
	var task = req.body;
	models.Task.markDone(task, function(err) {
		if (err) {
			throw err;
		} else {
			res.send(200);
		}
	});
	console.log(task);
});

//get all the tasks
app.get('/tasks', function(req, res) {
	var username = req.session.username;
	models.Task.findByUser(username, function(err, docs) {
		res.send(docs);
	});
});



app.post('/authenticated', function(req, res) {
	console.log('req.session:', req.session);
	if (req.session.loggedIn && req.session.preview != true){
		res.send(200);
	} else {
		res.send(401);
	}
});

app.post('/login', function(req, res) {
	var user = req.param('username', null);
	var password = req.param('password', null);
	var temp = req .param('preview', null);

	if (temp) {
		models.Debug.regenerateTasks(function() {
			models.User.login(user, password, function(err, doc) {
				if (err)
					throw err;
				else if (!doc) {
					res.send(401);
				} else {
					req.session.preview = true;
					req.session.loggedIn = true;
					req.session.username = doc.username;
					req.session.user_id = doc._id;
					req.session.team = doc.team;
					console.log('login from preview successful. set login details.');
					res.send(200);
				}
			});
		});
	}

	else {
		models.User.login(user, password, function(err, doc) {
			if (err)
				throw err;
			else if (!doc) {
				res.send(401);
			} else {
				req.session.loggedIn = true;
				req.session.username = doc.username;
				req.session.user_id = doc._id;
				req.session.team = doc.team;
				console.log('login successful. set login details.');
				res.send(200);
			}
		});
	}

});

app.post('/logout', function(req, res) {
	console.log('logging out');
	req.session.destroy();
	res.send(200);
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log("listening on port " + port);
});
