define(["router", 'views/debug'], function(router, DebugView) {
	var initialise = function() {
		
		//debugging:
		var debug_view = new DebugView();
		debug_view.render();

		$.ajax("/accounts/authenticated", {
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

	};

	return {
		initialise: initialise
	};
});
