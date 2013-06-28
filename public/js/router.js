define(['views/index'], function(IndexView) {
	var Router = Backbone.Router.extend({
		currentView: null,
		routes: {
			"index": "index",
			"l_index": "l_index"
		},
		changeView: function(v) {
			if (this.currentView != null)
				this.currentView.undelegateEvents();
			this.currentView = new v;
			this.currentView.render();
		},
		index: function() {
			this.changeView(IndexView);
		}
	});

	return new Router;
});
