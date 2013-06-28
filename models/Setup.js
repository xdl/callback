module.exports = function(mongoose, fs) {

	//Users schema defined in the account model.
	var Users = mongoose.model('Users');

	var populate = function(callback){
		fs.readFile('./testing/users.txt', 'utf8', function(err, payload) {
			if (err)
				throw err;
			else {
				var sample_users = JSON.parse(payload).users;
				Users.create(sample_users, callback);
			}
		});
	};

	var showUsers = function(callback) {
		//Model.find(conditions, [fields], [options], [callback])
		//find all users, returns them.
		Users.find({}, {'_id': 0, 'user': 1, 'password': 1}, callback);
	};

	var removeUsers = function(callback) {
		Users.remove({}, callback);
	};
	return {
		populate: populate,
		showUsers: showUsers,
		removeUsers: removeUsers
	};
}
