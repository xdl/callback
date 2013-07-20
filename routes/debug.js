module.exports = function(app, models, helpers) {

	app.post('/debug/users', function(req, res) {
		models.Debug.populateUsers(helpers.callback(res));
	});

	app.get('/debug/users', function(req, res) {
		models.Debug.showUsers(function(error, docs) {
			if (error)
				throw error;
			else {
				res.send(docs);
			}
		});
	});

	app.delete('/debug/users', function(req, res) {
		models.Debug.removeUsers(helpers.callback(res));
	});

	app.post( '/debug/tasks' , function(req, res) {
		models.Debug.populateTasks(helpers.callback(res));
	});

	app.get( '/debug/tasks' , function(req, res) {
		models.Debug.showTasks(function(error, docs) {
			if (error)
				throw error;
			else {
				res.send(docs);
			}
		});
	});


	app.delete( '/debug/tasks' , function(req, res) {
		models.Debug.removeTasks(helpers.callback(res));
	});

	app.delete( '/debug/everything', function(req, res) {
		models.Debug.removeEverything(helpers.callback(res));
	});

};
