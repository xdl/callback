define(
	['views/base', 'text!templates/l_index.html', 'views/dashboard', 'views/task_panel', 'models/TaskCollection', 'views/user_panel', 'views/api', 'models/UserCollection', 'views/cmd'], 
	function(BaseView, L_IndexTemplate, Dashboard, TaskPanel, TaskCollection, UserPanel, Api, UserCollection, Cmd) {
	var L_IndexView = BaseView.extend({
		el: $("#content"),
		initialize: function() {

			this.childViews = []; //for easy unbinding later on.
			//this.listenTo(this.model, 'change', this.render);
			
			//listeners:
			
			//directory for sharing
			var Directory = {
				tasks: {
					priv: {},
					assigned: {},
					pub: {}
				},
				users: {
					priv: {},
					pub: {}
				}
			};
			
			//dashboard stuff.
			this.dashboard = new Dashboard({model: this.model, Directory: Directory});
			this.childViews.push(this.dashboard);

			//task panel stuff.
			var tasks_collection = new TaskCollection();
			tasks_collection.url = '/tasks';
			this.taskPanel = new TaskPanel({model: this.model, collection: tasks_collection, Directory: Directory}); //the model contains the User details, the collection contains the tasks.
			this.childViews.push(this.taskPanel);
			
			//user panel stuff.
			var users_collection = new UserCollection();
			//var team = this.model.toJSON().team;
			users_collection.url = '/users';

			this.userPanel = new UserPanel({model: this.model, collection: users_collection, Directory: Directory}); //model contains the User details, collection contains the tasks.
			this.childViews.push(this.userPanel);

			//cmd stuff. Also, initiates the callback.initialize and points to the directory.
			this.cmd = new Cmd({tasks: tasks_collection, users: users_collection, Directory: Directory});	
			this.childViews.push(this.cmd);

			//api stuff.
			this.api = new Api();
			this.childViews.push(this.api);

		},
		template: _.template(L_IndexTemplate),

		render: function() {
			this.$el.html(this.template);

			//dashboard
			this.dashboard.setElement(this.$('.dashboard')).render();
			//task panel stuff
			this.taskPanel.setElement(this.$('.task_panel')).render('todo');
			//user panel stuff
			this.userPanel.setElement(this.$('.user_panel')).render();
			//cmd
			this.cmd.setElement(this.$('.cmd')).render();
			//api
			this.api.setElement(this.$('.api')).render();

		}

	});

	return L_IndexView;
});
