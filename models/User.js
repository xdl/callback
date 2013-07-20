module.exports = function(mongoose) {
	var UserSchema = new mongoose.Schema({
		username: {type: String, unique: true},
		password: {type: String},
		task_id: {type: String},
		task_name: {type: String},
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

	return {
		login: login,
		findById: findById,
		findByTeam: findByTeam
	};
}
