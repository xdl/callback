define(['views/base', 'text!templates/user_panel.html', 'views/user'], function(BaseView, UsersTemplate, User) {
	var Users = BaseView.extend({
		template: _.template(UsersTemplate),

		events: {
			'click input.user': 'selectUser'
		},
		initialize: function(options) {
			this.Directory = options.Directory;

			Backbone.on("describe", this.describe, this);
			Backbone.on("changeTask", this.changeTask, this);

		},
		destroy:function() {
			Backbone.off("describe", this.describe, this);
			Backbone.off("changeTask", this.changeTask, this);
		},
		describe: function(obj) {
			var id = obj.context.object._id;
			var described_model = this.collection.findWhere({_id:id});

			if (described_model != undefined) {
				described_model.set('visibility', true);
			}
		},
		render: function() {
			var _this = this;
			this.$el.html(this.template(this.model.toJSON()));
			this.collection.fetch({
				success: function(collection, response, options) {
					_this.renderUsers();
				}
			});
		},

		selectUser: function() {
			console.log('user selected');
		},
		changeTask: function(res) {
			var taskName = this.Directory.tasks.assigned[res.info.task].task_name;
			var taskID = this.Directory.tasks.assigned[res.info.task]._id;
			this.render();

		},
		users: [],
		renderUsers: function() {
			var _this = this;
			var username = this.model.get('username');

			var userFrag = document.createDocumentFragment(); 
			//don't think we need to regenerate these much, at all. Teammates shouldn't really change much.
			var pub_ids = this.Directory.users.pub = {};
			var priv_ids = this.Directory.users.priv = {};

			var i = 1;
			this.collection.each(function(user) {
				var user_id;
				if (user.get('username') == username ) {
					user_id = 'u0';
					priv_ids.u0 = user.toJSON();
				} else {
					user_id = 'u' + i++;
					pub_ids[user_id] = user.toJSON();
				}

				user.set('user_id', user_id);
				userFrag.appendChild(new User({model:user}).render().el);
			});
			$('.user_container').empty();
			$('.user_container').append(userFrag);
			this.hideDetails();
		},
		hideDetails: function() {
			this.$('.details').hide();
		}
		
	});

	return Users;
});
