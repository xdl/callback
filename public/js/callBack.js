define(["router"], function(router) {
	var initialise = function() {
		checkLogin(runApplication);
	}

	var checkLogin = function(callback) {
		$.ajax("/accounts/authenticated", {
			method: "POST",
			success: function() {
				callback(true);
			},
			error: function() {
				callback(false);
			}
		});
	};

	var runApplication = function(authenticated) {
		if (!authenticated) {
			window.location.hash = "index";
		} else {
			window.location.hash = "l_index";
		}
		Backbone.history.start();
	};

	return {
		initialise: initialise
	};
});
