define([], function() {
	var Task = Backbone.Model.extend({
		idAttribute: '_id',

		validate: function() {
		}
	});

	return Task;
});
