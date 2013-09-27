define([], function() {
	var User = Backbone.Model.extend({
		
		urlRoot: "/users",

		idAttribute: '_id'

	});

	return User;
});
