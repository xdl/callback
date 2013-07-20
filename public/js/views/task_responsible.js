define(['views/base', 'text!templates/task_responsible.html'], function(BaseView, TaskTemplate) {
	var Task = BaseView.extend({
		tagName: 'div',


		events: {
			'click input': 'triggerTaskChange'
			//'change input:checked': 'toggleDoneBtn' //won't work, unfortunately. Need to do this on the collection level. 
		},

		template: _.template(TaskTemplate),

		toggleDoneBtn: function() {
			console.log('should be triggering twice, right?');
			var button = this.$el.find('button');
			if (typeof button.prop('disabled') == "undefined") {
				button.prop('disabled', true);
			} else {
				button.prop('disabled', false);
			}
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		triggerTaskChange: function() { //triggers task change on the parent.
			this.options.task_panel.changeTask(this.model.toJSON());


		},
		

		toggle: function() {
			//reimplement this. I think we can scrap it, actually.
			//console.log(this.model.get('active'));
			//var flip = !this.model.get('active');
			////console.log(flip);
			//this.model.save({active: flip});
			//console.log(this.model.get('active'));
		}

	});
	
	return Task;
});
