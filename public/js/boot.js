require.config({
	baseUrl: "js", //load here by default
	paths: {
		Backbone: "libs/backbone",
		jQuery: "libs/jquery-2.0.3.min",
		Underscore: "libs/underscore-min",
		text: "libs/text",
		templates: "../templates",
		testing: "../testing/js" //change this to something like api.js later
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
