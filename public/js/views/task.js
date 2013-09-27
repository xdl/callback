define(['views/entry', 'text!templates/task.html'], function(EntryView, TaskTemplate) {
	var Task = EntryView.extend({
		template: _.template(TaskTemplate)
	});
	return Task;
});
