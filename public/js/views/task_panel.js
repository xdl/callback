define(['views/base', 'text!templates/task_panel.html', 'views/task'], function (BaseView, TaskPanelTemplate, Task) {
	var TaskPanel = BaseView.extend({
		template: _.template(TaskPanelTemplate),
		initialize: function(options) {

			this.childViews = [];
			//things to for changes in the data
			this.listenTo(this.model, 'change:active_task', this.render);
			this.listenTo(this.collection, 'sync', this.update);

			this.Directory = options.Directory; //keeps reference to the directory

			//API stuff
			Backbone.on("showTasks", this.reFilter, this); //third argument needs to be 'this', otherwise reFilter will think `this` is the event object.
			Backbone.on("createTask", this.createTask, this);
			Backbone.on('do', this.createTask, this); //alias for createTask 
			Backbone.on("done", this.done, this);
			Backbone.on("describe", this.describe, this);

			//Debugging
			Backbone.on("debugPrintTasks", this.debugPrintTasks, this);
			Backbone.on("debugPrintDirectory", this.debugPrintDirectory, this);
			Backbone.on("debugPrintModel", this.debugPrintModel, this);
		},
		destroy:function() {

			Backbone.off("showTasks", this.reFilter, this);
			Backbone.off("createTask", this.createTask, this);
			Backbone.off('do', this.createTask, this);
			Backbone.off("done", this.done, this);
			Backbone.off("describe", this.describe, this);

			//Debugging
			Backbone.off("debugPrintTasks", this.debugPrintTasks, this);
			Backbone.off("debugPrintDirectory", this.debugPrintDirectory, this);
			Backbone.off("debugPrintModel", this.debugPrintModel, this);
		},
		events: {
		},
		log:function(){
			console.log('collection added to!');
		},
		render: function(status) {
			var _this = this;
			this.$el.html(this.template); //renders the stuff that doesn't need another fetch.

			//calls stop listening to the entryViews
			//while (_this.childViews.length != 0) {
				//_this.childViews[0].close();
				//_this.childViews.shift();
			//}

			this.collection.fetch(); //sync event will deal with the actual rendering of tasks
			//this.collection.fetch({
				//success: function(collection, response, options) {
					//_this.renderTasks(status);
				//}
			//});
		},
		//fetches and updates
		update: function() {
			this.collection.remove(this.collection.findWhere({'task_name':'idle'}));
			this.renderTasks(this.filterStatus);
		},
		//for bulk adds. Needs to do a whole fetch from the database, so calls render instead of update (which just refilters it)
		reFetch: function() {
			this.render(this.filterStatus);
		},
		filterStatus: 'todo',
		filter: function(collection, crit) {
			var username = this.model.get('username');
			this.filterStatus = crit;

			var filtered;
			switch(crit) {
				case 'all':
					filtered = collection.where({delegate: username});
				break;
				case 'todo':
					filtered = collection.where({status:'todo', delegate: username});
				break;
				case 'done':
					filtered = collection.where({status:'done', delegate: username});
				break;
				default:
					filtered = collection;
				break;
			}
			return filtered;
		},
		reFilter: function(obj) {
			var crit = obj.info.toShow;
			this.renderTasks(crit);
		},
		renderTasks: function(status) {
			var _this = this;
			var username = this.model.get('username');

			this.$('span').html(status); //tells us what tasks it's displaying
			$('.tasks').empty();
			var list = this.filter(this.collection, status);
			var tasksFrag = document.createDocumentFragment();

			//when these get rendered, we need to regenerate task ids.
			var priv_ids = this.Directory.tasks.priv = {};
			var assigned_ids = this.Directory.tasks.assigned = {};
			var pub_ids = this.Directory.tasks.pub = {};

			var current_task = this.model.get('task_id');
			var i = 1;
			_.each(list, function(task) {
				var task_id;
				if (task.get('_id') == current_task) {
					task_id = 't0';
				} else {
					task_id = 't' + i++;
				}

				var delegate = task.get('delegate');
				var delegator = task.get('delegator');
				
				//assigning it into the directory:
				if (delegator == username) { //private
					priv_ids[task_id] = task.toJSON();
				}
				if (delegate == username){ //assigned
					assigned_ids[task_id] = task.toJSON();
				}
				if (delegate != username && delegator != username) { //public
					pub_ids[task_id] = task.toJSON();
				}


				task.set('task_id', task_id);
				var taskview = new Task({model:task});
				_this.childViews.push(taskview);
				tasksFrag.appendChild(taskview.render().el);
			});
			console.log('_this.Directory:', _this.Directory);
			$('.tasks').append(tasksFrag);
			this.hideDetails();
		},
		hideDetails:function() {
			this.$('.details').hide();
		},
		createTask: function(obj) {
			//console.log('obj:', obj);

			//need to determine what kind of task or tasks you want to create:
			var _this = this;

			var num_tasks = obj.info.tasks.length;
			var num_users = obj.info.users.length;
			var callback = obj.info.callback;
			var delegator = this.model.get('username');
			//console.log('users:', num_users);

			//console.log('num_tasks:', num_tasks);
			//console.log('num_users:', num_users);

			if (num_tasks == 1) { //personal: Let's start small
				//var task = new Task;
				//console.log('task cid:', task.cid); //hmm defintely can't use these as ids! Need to fetch it from mongodb it seems.
				//
				//

				var task_name = obj.info.tasks[0];
				var delegate;

				console.log('Directory:', this.Directory);
				console.log('obj.info.users[0]:', obj.info.users[0]);
				if (_this.Directory.users.pub[obj.info.users[0]]) {
					delegate = _this.Directory.users.pub[obj.info.users[0]].username;
				} else {
					delegate = delegator;
				}

				console.log('callback:', obj.info.callback);
				//console.log('callback:', obj.info.callback.toJSON());

				this.collection.create({
					delegator: delegator,
					delegate: delegate,
					task_name: task_name,
					callback: obj.info.callback
				}, {
					success:function(model, response, options) {
						console.log('successfully updated.');
					},
					error:function(e){
						console.log('error:', e);
					}
				});
			}

			//a bunch of users. haven't decided what to do with callbacks yet.
			else if (num_users != 0 || num_tasks != 0) {
				var task_array = [];

				var preformatted_tasks = obj.info.tasks;
				var preformatted_users = [];

				if (obj.info.users.length == 0) {
					for (var i = 0;i<preformatted_tasks.length;i++) {
						preformatted_users[i] = delegator;
					}
				} else {
					for (var i = 0;i<preformatted_tasks.length;i++) {
						if (_this.Directory.users.pub[obj.info.users[i]]) {
							preformatted_users[i] = _this.Directory.users.pub[obj.info.users[i]].username;
						} else {
							preformatted_users[i] = delegator;
						}
					}
				}
 
				for (var i=0;i<preformatted_tasks.length;i++) {
					var cb = 'nothing';
					//end of the tasks - add the callback
					if (i == preformatted_tasks.length-1) {
						cb = obj.info.callback;
					}
					var task = {
						delegate:preformatted_users[i],
						delegator:delegator,
						task_name:preformatted_tasks[i],
						callback:cb
					}
					task_array.push(task);
				}

				$.ajax('/import/tasks', {
					type: "POST",
					data: {data:task_array},
					success:function() {
						console.log('done adding a bunch of tasks, possibly for other people');
						_this.reFetch();
					},
					error:function() {
						console.log('yikes! must be an error.');
					}
				});
			}
		},
		dealWithCallback:function(obj) {
			var callback = obj.context.object.callback;
			//console.log('obj:', obj);
			if (callback == 'nothing') {
				//do whatever the regular thing is
			} else {
				//console.log('callback:', callback);
				Backbone.trigger(callback.method, callback);
			}
		},
		format:function(obj) {
			return obj;
		},
		done:function(obj) {
			//get the object's task ID:
			console.log('obj:', obj);
			var comment = obj.info.comment;
			var task_id = obj.context.object._id;
			//console.log('task_id:', task_id);
			var model = this.collection.get(task_id);

			if (model.get('status') != 'done') { // so callbacks aren't triggered twice
				model.save({"status": "done", "comment": comment, "date_done": new Date()});
				this.update();
				this.dealWithCallback(obj);
			}
			else {
				//growl that it is already done
			}

		},
		describe:function(obj) {
			var id = obj.context.object._id;
			var described_model = this.collection.findWhere({_id:id});

			if (described_model != undefined) {
				described_model.set('visibility', true);
			}
		},
		debugPrintDirectory:function() {
			console.log(this.Directory);
		},
		debugPrintModel:function() {
			console.log(this.model.toJSON());
		},
		debugPrintTasks: function() {
			//this.collection.each(function(model) {
				//console.log('name:', model.get('cid'));
			//});
			console.log('debug printing tasks:');
			console.log(this.collection.toJSON());
		}
	});

	return TaskPanel;
});
