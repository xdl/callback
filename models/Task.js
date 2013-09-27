module.exports = function(mongoose) {
	var TaskSchema = new mongoose.Schema({
		task_name: {type: String},
		delegator: {type: String, default:'default'},
		delegate: {type: String},
		callback: {type: mongoose.Schema.Types.Mixed, default:'nothing'},
		status: {type:String, default: 'todo'}, //done/todo
		comment:{type:String}, //when done, comment has to appear too.
		delegation_date: {type: Date, default: Date.now},
		date_done: {type: Date},

		//these will be optional.
		listeners: [String],
		task_up: {type: String},
		task_down: {type: String},
		task_next: {type: String},
		task_previous: {type: String},
		manhours: {type: Number}

	}, {collection: 'tasks'});
		
	var Task = mongoose.model('Task', TaskSchema);

	var createTask = function(task, callback) {
		//this is waaay too much delegation, surely. Pretty sure you don't need this - just include the Task model in a tasks route! A routes/task to deal with requests requiring tasks, but surely all requests to the server by definition need to fetch some data, i.e. access the database? Not sure, will think about it later.
		Task.create(task, callback);
	}

	var findByUser = function(username, callback) {
	//	Task.find([{delegate: username}, {delegator: username}], {'__v': 0}, callback);
		//Task.or([{delegate:username}, {delegator:username}], {'__v':0}, callback);
		Task.where().or([{delegate:username}, {delegator:username}]).exec(callback);
	}

	var createTasks = function(task_array, callback) {
		Task.create(task_array, callback);
	}

	var markDone = function(task, callback) {
		Task.update({_id:task._id}, {status:'done', comment:task.comment, date_done:task.date_done}, callback);
	}


	return {
		findByUser: findByUser,
		createTask: createTask,
		createTasks: createTasks,
		markDone: markDone
	}

};
