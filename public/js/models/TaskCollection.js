define(['models/Task'], function(Task) {
	var TaskCollection = Backbone.Collection.extend({
		model: Task
	});

	return TaskCollection;
});
