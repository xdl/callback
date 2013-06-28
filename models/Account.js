module.exports = function(mongoose) {
	var UserSchema = new mongoose.Schema({
		user: {type: String, unique: true},
		password: {type: String}
	});

	var Users = mongoose.model('Users', UserSchema);

	var login = function(user, password, callback) {
		Users.findOne({user: user, password: password}, callback);
	};

	return {
		login: login
	};
}
