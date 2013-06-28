require.config({
	baseUrl: "js", //load here by default
	paths: {
		Backbone: "libs/backbone",
		jQuery: "libs/jquery-2.0.2.min",
		Underscore: "libs/underscore-min",
		text: "libs/text"
	},

	shim: {
		"Backbone": {
			deps: ['Underscore', 'jQuery', 'text'],
			exports: "Backbone"
		},
		"define": {
			deps: ['jQuery']
		}
	}
});

require(["Backbone","callBack"], function(b, app) {
	app.initialise();
});
