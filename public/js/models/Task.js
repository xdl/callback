define([], function() {
	var Task = Backbone.Model.extend({

		urlRoot: "/tasks",

		idAttribute: '_id',

		validate: function() {
			console.log('gone through validation');
			//return false; //if it's fine, don't return ANYTHING from validate.
		}
	});

	return Task;
});
