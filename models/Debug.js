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
								Task.create({delegate: user.username, task_name: "idle"}, c); //create an idle task for them.
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
								User.update({username: user.username}, {task_id: idle_ids[user.username], task_name: "idle"}, {upsert: true}, c); //place it in the user.
							}, cb);
						}], callback);

						//I CANNOT believe this worked! I'm a fricking genius!!!

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
				//convert the _id strings into objectIDs
//				sample_tasks.forEach(function(element, index, array) {
//					var id;
//					if (id = element._id) {
//						element._id = mongoose.Types.ObjectId(id);
//					}
//				});
				
				//need to now make sure the user has the active_task id for idle.
				//Task.create(sample_tasks, function(err) {
				//	if (err)
				//		throw err;
				//	else {
				//		Task.findOne({'task':'idle'}, {}, function(err, doc) {
				//			if (err)
				//				throw err;
				//			else {
				//				var id = doc._id;
				//				User.findByIdAndUpdate(

				//			}
				//		});
				//	}
				//});

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

		removeEverything: removeEverything
	};
}
