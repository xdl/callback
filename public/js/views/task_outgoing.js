define(['views/base', 'text!templates/task_outgoing.html', 'views/task_delegated'], function(BaseView, TaskCreationTemplate, TaskDelegated) {
	var TaskCreation = BaseView.extend({
		template: _.template(TaskCreationTemplate),
		events: {},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
		},
		renderTasks: function() {
			$('.delegated_tasks').empty();

			this.collection.fetch({
				success: function(collection, response, options) {
					collection.each(function(task) {
						var taskHtml = new TaskDelegated({model: task});
					});
				}
			});
		}
	});
});
