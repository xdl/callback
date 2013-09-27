module.exports = function(mongoose) {
	var UserSchema = new mongoose.Schema({
		username: {type: String, unique: true},
		password: {type: String},
		task_id: {type: String},
		active_task: {type: String},
		team: {type:String}
	}, {collection: 'users'});

	var User = mongoose.model('User', UserSchema);

	var login = function(user, password, callback) {
		User.findOne({username: user, password: password}, callback);
	};

	var findById = function(username, callback){
		User.findOne({username: username}, {'__v': 0}, callback);
	};

	var findByTeam = function(team, callback) {
		User.find({team: team}, {'__v': 0}, callback);
	};

	var changeTask = function(user, callback) {
		User.update({_id: user._id}, {active_task: user.active_task, task_id: user.task_id}, callback);
	};

	return {
		login: login,
		findById: findById,
		findByTeam: findByTeam,
		changeTask: changeTask
	};
}
