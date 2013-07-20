define(['views/index', 'views/l_index', 'models/User'], function(IndexView, L_IndexView, User) {
	var Router = Backbone.Router.extend({
		currentView: null,
		routes: {
			"index": "index",
			"l_index": "l_index"
		},
		changeView: function(v) {
			if (this.currentView != null) {
				//this.currentView.remove();
				this.currentView.stopListening();
				this.currentView.unbind();
				this.currentView.undelegateEvents();
				//for any child views, model bindings
				this.currentView.destroy();
			}
			this.currentView = v;
			this.currentView.render();
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

	return new Router;
});
