define(['views/index', 'views/l_index', 'views/create', 'models/User'], function(IndexView, L_IndexView, CreateView, User) {
	var Router = Backbone.Router.extend({
		currentView: null,
		routes: {
			"index": "index",
			"l_index": "l_index",
			"preview": "preview",
			"create": "create"
		},
		changeView: function(v) {
			if (this.currentView != null) {
				//this.currentView.remove(); //calls stopListening, so don't need it.
				this.currentView.close();

				//this is required, since we aren't calling this.currentView
				this.currentView.undelegateEvents();
				this.currentView.stopListening();
				//for any child views, model bindings
				//this.currentView.destroy();
			}
			this.currentView = v;
			this.currentView.render();
		},
		//just an alias for l_index really
		preview: function() {
			this.l_index();
		},
		create: function() {
			this.changeView(new CreateView());
		},
		l_index: function() {
			var _this = this;

			var model = new User();
			model.urlRoot = '/users/me';
			model.fetch({
				success: function() {
					_this.changeView(new L_IndexView({model: model}));
				}
			});
		},
		index: function() {
			this.changeView(new IndexView());
		}
	});

	return Router;
});
