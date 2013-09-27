module.exports = function(mongoose, fs, async) {

	//Users schema defined in the account model.
	var User = mongoose.model('User');

	var Task = mongoose.model('Task');

	var populateUsers = function(callback) {
		fs.readFile('./testing/testing_data.txt', 'utf8', function(err, payload) {
			if (err)
				throw err;
			else {
				var sample_users = JSON.parse(payload).users;
				var idle_ids = {};
				User.create(sample_users, function(err) {
					if (err)
						throw err;
					else {
						async.series([function(cb) {
							async.each(sample_users, function(user, c) {
								Task.create({delegate: user.username, task_name: "idle", status: "null"}, c); //create an idle task for them.
							}, cb);
						}, function(cb) {
							async.each(sample_users, function(user, c) {
								Task.findOne({delegate: user.username, task_name: "idle"}, function(err, doc) { //get the idle id.
									idle_ids[user.username] = doc._id;
									c();
								});
							}, cb);
						}, function(cb) {
							async.each(sample_users, function(user, c) {
								User.update({username: user.username}, {task_id: idle_ids[user.username], active_task: "idle"}, {upsert: true}, c); //place it in the user.
							}, cb);
						}], callback);

					}
				});
			}
		});
	};

	var dpopulateUsers = function(callback){
		fs.readFile('./testing/testing_data.txt', 'utf8', function(err, payload) {
			if (err)
				throw err;
			else {
				var sample_users = JSON.parse(payload).users;
				User.create(sample_users, callback);
			}
		});
	};

	var showUsers = function(callback) {
		//Model.find(conditions, [fields], [options], [callback])
		//find all users, returns them.
		User.find({}, {'_id': 0, '__v': 0}, callback);
	};

	var removeUsers = function(callback) {
		User.remove({}, callback);
	};

	var populateTasks = function(callback) {
		fs.readFile('./testing/testing_data.txt', 'utf8', function(err, payload) {
			if (err)
				throw err;
			else {
				var sample_tasks = JSON.parse(payload).tasks;
				Task.create(sample_tasks, callback);
			}
		});
	};

	var showTasks = function(callback) {
		Task.find({}, {'_id': 0, '__v': 0}, callback);
	};

	var removeTasks = function(callback) {
		Task.remove({}, callback);
	};

	var regenerateTasks = function(callback) {
		fs.readFile('./testing/testing_data.txt', 'utf8', function(err, payload) {
			if (err)
				throw err;
			else {
				Task.remove({}, function(err) {
					if (err)
						throw err;
					else {
						console.log('successfully removed tasks. Now regenerating:');
						var sample_tasks = JSON.parse(payload).tasks;
						Task.create(sample_tasks, callback);
					}
				});
			}
		});
	};



	var removeEverything = function(callback) {
		if(mongoose.connection.collections['users'])
			mongoose.connection.collections['users'].drop();
		if(mongoose.connection.collections['tasks'])
			mongoose.connection.collections['tasks'].drop();
		callback();
	};
	return {
		populateUsers: populateUsers,
		showUsers: showUsers,
		removeUsers: removeUsers,

		populateTasks: populateTasks,
		showTasks: showTasks,
		removeTasks: removeTasks,

		regenerateTasks: regenerateTasks,

		removeEverything: removeEverything
	};
}
