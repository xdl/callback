module.exports = function(mongoose) {
	var TaskSchema = new mongoose.Schema({
		task_name: {type: String},
		delegator: {type: String},
		delegate: {type: String},
		instructions: {type: String},
		delegation_date: {type: Date, default: Date.now},
		date_finished: {type: Date},
		listeners: [String],
		task_up: {type: String},
		task_down: {type: String},
		task_next: {type: String},
		task_previous: {type: String},
		manhours: {type: Number}

	}, {collection: 'tasks'});
		
	var Task = mongoose.model('Task', TaskSchema);

	var findByUser = function(username, callback) {
	//	Task.find([{delegate: username}, {delegator: username}], {'__v': 0}, callback);
		//Task.or([{delegate:username}, {delegator:username}], {'__v':0}, callback);
		Task.where().or([{delegate:username}, {delegator:username}]).exec(callback);
	}



	return {
		findByUser: findByUser
	}

};
