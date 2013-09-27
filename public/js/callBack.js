define(["router", 'views/debug'], function(Router, DebugView) {
	var initialise = function() {

		//debugging:
		//var debug_view = new DebugView();
		//debug_view.render();

		var router = new Router;

		var hashparam = window.location.hash.slice(1);

		if (router.routes[hashparam] == undefined) {
			window.location.hash = 'index';
			Backbone.history.start();
		}

		//the only page that needs authentication
		else if (hashparam == '#l_index') {

			$.ajax("/authenticated", {
				method: "POST",
				success: function(data) {
					window.location.hash = 'l_index';
				},
				error: function(data) {
					window.location.hash = "index";
				},
				complete: function() {
					Backbone.history.start();
				}
			});
		}

		else {
			window.location.hash = hashparam;
			Backbone.history.start();
		}

	};

	return {
		initialise: initialise
	};
});
