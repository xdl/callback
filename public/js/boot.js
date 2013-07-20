require.config({
	baseUrl: "js", //load here by default
	paths: {
		Backbone: "libs/backbone",
		jQuery: "libs/jquery-2.0.2.min",
		Underscore: "libs/underscore-min",
		text: "libs/text",
		templates: "../templates"
	},

	shim: {
		"Backbone": {
			deps: ['Underscore', 'jQuery', 'text'],
			exports: "Backbone"
		},
		"callBack": {
			deps: ['Backbone']
		}
	}
});

require(["callBack"], function(app) {
	app.initialise();
});
