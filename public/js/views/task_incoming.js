define(['views/base', 'text!templates/task_incoming.html', 'views/task_responsible'], function(BaseView, TaskIncomingTemplate, TaskResponsible) {
	var TaskIncoming = BaseView.extend({

		template: _.template(TaskIncomingTemplate),

		initialize: function() {
			//this.listenTo(this.collection, 'reset', this.renderTasks);
		
			this.listenTo(this.model, 'change', this.render); //listen for when a new task is selected.
		},

		events: {
			'click input:checked': 'toggle'
		},

		toggle: function(e) {
			console.log(e);

		},

		logChange: function() {
			console.log('change detected');
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			this.renderTasks();
		},

		changeTask: function(m) {
			var id = m._id;
			var task_name = m.task_name;

			this.model.set({ //set this to 'save' instead.
				task_name: task_name,
				task_id: id
			});
		},



		renderTasks: function() {
			//console.log(this.collection);
			$('.task_container').empty();
			//console.log(this.collection);
			
			//We'll use this to check get the default radio settings.
			var activeTaskID = this.model.get('task_id');

			var _this = this;
			
			this.collection.fetch({
				success: function(collection, response, options) {

					collection.each(function(task) {

						if (task.get('_id') == activeTaskID) {
							task.set('active', true);
							task.set('delegator', 'yourself');
						} else {
							task.set('active', false);
						}

						var taskHtml = new TaskResponsible({model: task, task_panel: _this}).render().el;

						$('.tasks_responsible').append(taskHtml);

					});


				}
			});
		}

	});

	return TaskIncoming;
});
